/**
 * Press handling for every control on the card.
 *
 * v1 wired `@click` onto bare `<div>`s: no keyboard, no screen-reader
 * semantics, no press feedback, no way to hold an arrow down. This replaces all
 * of it with one directive used everywhere, so a control cannot accidentally be
 * built without those things.
 *
 * Taps resolve on *release*, never on pointerdown. Firing on pointerdown means
 * that on a phone, putting a thumb on an app tile to scroll the page launches
 * the app — the gesture has not yet declared itself as a tap or a drag. The
 * cost is that a tap lands when the finger lifts rather than when it touches,
 * which is how every native control behaves.
 *
 * Repeat is deliberately *repeated discrete presses*, not Android's long-press.
 * `remote.send_command` accepts a `hold_secs`, but that maps to START_LONG /
 * END_LONG — a long press, which on a TV means "open the context menu", not
 * "move down eight rows".
 */

import { noChange, type ElementPart, type Part } from "lit";
import { directive, type PartInfo, PartType } from "lit/directive.js";
import { AsyncDirective } from "lit/async-directive.js";

import { fireEvent } from "./kit/types";

/** How long to hold before the first repeat. */
const REPEAT_DELAY_MS = 500;
/** Interval between repeats after that. Tuned on a real network; easy to move. */
const REPEAT_INTERVAL_MS = 220;
/** Backstop so a stuck pointer cannot flood the TV's websocket. */
const MAX_REPEATS = 40;
/** How long a press must last to count as a hold. Matches HA's own handler. */
const HOLD_MS = 500;
/** Window for a second tap. Only applied when a double-tap action exists. */
const DOUBLE_TAP_MS = 250;
/**
 * How far a pointer may travel and still count as a tap.
 *
 * Beyond this the gesture is a scroll or a drag, and the press is abandoned.
 * Chrome's own touch slop is 8px; a little more is forgiving of thumbs without
 * making a deliberate tap hard to land.
 *
 * Exported because the volume bar is both a button and a slider, and the two
 * have to agree about where one gesture stops being the other: the drag starts
 * on the pixel the tap is abandoned on, or there is a band where a finger does
 * both or neither.
 */
export const SLOP_PX = 12;

export interface PressOptions {
  /** Runs on release, and on every repeat while held. */
  onPress: () => void;
  /**
   * Runs when the press passes the hold threshold.
   *
   * Mutually exclusive with `repeat`: a control cannot both repeat while held
   * and do something else on hold. When both are supplied, hold wins, because
   * it was configured explicitly and repeat is only ever a default.
   */
  onHold?: () => void;
  /**
   * Runs on a second tap inside the double-tap window.
   *
   * Supplying this delays the single tap by that window, since there is no way
   * to know a tap is single until it has passed. Left undefined, taps fire on
   * release — which is why it is only wired when actually configured.
   */
  onDoubleTap?: () => void;
  /** Hold to repeat. Only sensible for idempotent, directional controls. */
  repeat?: boolean;
  /** Fire HA haptic feedback (Companion app only; a no-op elsewhere). */
  haptics?: boolean;
  disabled?: boolean;
}

/**
 * Wire pointer, keyboard and press-feedback onto an element.
 *
 * Used as `<button ${press({onPress})}>`. A directive rather than a set of
 * `@pointerdown=` bindings because the listeners have to co-operate — the
 * repeat timer, the slop threshold and the `.pressed` class are one unit, and
 * splitting them across a template is how they drift apart.
 */
class PressDirective extends AsyncDirective {
  private _element?: HTMLElement;
  private _options?: PressOptions;
  private _repeatTimer?: number;
  private _holdTimer?: number;
  private _tapTimer?: number;
  private _repeats = 0;
  private _inFlight = false;
  private _bound = false;

  /** A press is in progress and has not yet been abandoned. */
  private _active = false;
  /** Something already fired for this press: hold, or a repeat. */
  private _resolved = false;
  private _startX = 0;
  private _startY = 0;
  private _awaitingSecondTap = false;

  constructor(partInfo: PartInfo) {
    super(partInfo);
    if (partInfo.type !== PartType.ELEMENT) {
      throw new Error("press() can only be used on an element");
    }
  }

  override render(_options: PressOptions): typeof noChange {
    return noChange;
  }

  override update(part: Part, [options]: [PressOptions]): typeof noChange {
    this._element = (part as ElementPart).element as HTMLElement;
    this._options = options;

    if (!this._bound) {
      this._bound = true;
      const el = this._element;
      el.addEventListener("pointerdown", this._onPointerDown);
      el.addEventListener("pointermove", this._onPointerMove);
      el.addEventListener("pointerup", this._onPointerUp);
      // The browser fires pointercancel the moment it decides the gesture is a
      // scroll, which is exactly when the press must be abandoned.
      el.addEventListener("pointercancel", this._abort);
      el.addEventListener("pointerleave", this._abort);
      el.addEventListener("keydown", this._onKeyDown);
      el.addEventListener("keyup", this._onKeyUp);
      el.addEventListener("blur", this._abort);
      // Otherwise a long press pops a text-selection or context menu, which is
      // exactly the gesture hold-to-repeat needs.
      el.addEventListener("contextmenu", (event) => event.preventDefault());
    }
    return noChange;
  }

  /* ---------------------------------------------------------------- pointer */

  private _onPointerDown = (event: PointerEvent): void => {
    // Primary button only; a right-click should not drive the TV.
    if (event.button !== 0) return;
    const options = this._options;
    if (!options || options.disabled) return;

    // Deliberately no preventDefault and no pointer capture: both interfere
    // with the browser's own scroll detection, and this element wants that
    // detection to win.
    this._active = true;
    this._resolved = false;
    this._startX = event.clientX;
    this._startY = event.clientY;
    this._element?.classList.add("pressed");

    if (options.onHold) {
      this._holdTimer = window.setTimeout(() => {
        if (!this._active) return;
        this._resolved = true;
        this._fire(options.onHold!, "medium");
      }, HOLD_MS);
      return;
    }

    if (!options.repeat) return;
    this._repeats = 0;
    this._repeatTimer = window.setTimeout(() => {
      if (!this._active) return;
      // Held long enough to be a repeat rather than a tap: fire the first one
      // now, so holding feels immediate from here on.
      this._resolved = true;
      this._fire(options.onPress);
      this._repeatTimer = window.setInterval(() => {
        if (!this._active || this._repeats >= MAX_REPEATS) {
          this._reset();
          return;
        }
        this._repeats += 1;
        this._fire(options.onPress);
      }, REPEAT_INTERVAL_MS);
    }, REPEAT_DELAY_MS);
  };

  private _onPointerMove = (event: PointerEvent): void => {
    if (!this._active) return;
    const dx = event.clientX - this._startX;
    const dy = event.clientY - this._startY;
    if (dx * dx + dy * dy > SLOP_PX * SLOP_PX) this._abort();
  };

  private _onPointerUp = (): void => {
    if (!this._active) return;
    const resolved = this._resolved;
    this._reset();
    // A hold that reached its threshold, or a press that already started
    // repeating, has had its say.
    if (!resolved) this._tap();
  };

  /* --------------------------------------------------------------- keyboard */

  private _onKeyDown = (event: KeyboardEvent): void => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    // Held keys arrive as a stream of keydowns; let the repeat timer own the
    // cadence instead of the OS key-repeat rate.
    if (event.repeat || this._active) return;

    const options = this._options;
    if (!options || options.disabled) return;

    // A keyboard press cannot turn into a scroll, so there is nothing to wait
    // for: fire immediately and let hold/repeat build on top.
    this._active = true;
    this._resolved = true;
    this._startX = 0;
    this._startY = 0;
    this._element?.classList.add("pressed");
    this._tap();

    if (options.onHold) {
      this._holdTimer = window.setTimeout(() => {
        if (this._active) this._fire(options.onHold!, "medium");
      }, HOLD_MS);
      return;
    }
    if (!options.repeat) return;
    this._repeats = 0;
    this._repeatTimer = window.setTimeout(() => {
      this._repeatTimer = window.setInterval(() => {
        if (!this._active || this._repeats >= MAX_REPEATS) {
          this._reset();
          return;
        }
        this._repeats += 1;
        this._fire(options.onPress);
      }, REPEAT_INTERVAL_MS);
    }, REPEAT_DELAY_MS);
  };

  private _onKeyUp = (): void => {
    this._reset();
  };

  /* ------------------------------------------------------------------ firing */

  /** A tap, resolving single vs double first when that distinction exists. */
  private _tap(): void {
    const options = this._options;
    if (!options) return;

    if (!options.onDoubleTap) {
      this._fire(options.onPress);
      return;
    }

    if (this._awaitingSecondTap) {
      window.clearTimeout(this._tapTimer);
      this._awaitingSecondTap = false;
      this._fire(options.onDoubleTap);
      return;
    }

    this._awaitingSecondTap = true;
    this._tapTimer = window.setTimeout(() => {
      this._awaitingSecondTap = false;
      this._fire(options.onPress);
    }, DOUBLE_TAP_MS);
  }

  private _fire(run: () => void, haptic = "light"): void {
    const options = this._options;
    if (!options) return;

    // Coalesce: on a slow websocket a repeat can outrun the previous call, and
    // the queue arrives long after the finger lifts.
    if (this._inFlight) return;
    this._inFlight = true;
    // Cleared on a microtask rather than awaiting the call: presses stay
    // responsive, but two cannot be issued from the same tick.
    Promise.resolve().then(() => {
      this._inFlight = false;
    });

    if (options.haptics !== false && this._element) {
      fireEvent(this._element, "haptic", haptic);
    }
    run();
  }

  /* ---------------------------------------------------------------- teardown */

  /** Give up on the current press without firing anything further. */
  private _abort = (): void => {
    this._reset();
  };

  private _reset(): void {
    this._active = false;
    this._resolved = false;
    this._repeats = 0;
    this._element?.classList.remove("pressed");
    if (this._repeatTimer !== undefined) {
      window.clearTimeout(this._repeatTimer);
      window.clearInterval(this._repeatTimer);
      this._repeatTimer = undefined;
    }
    if (this._holdTimer !== undefined) {
      window.clearTimeout(this._holdTimer);
      this._holdTimer = undefined;
    }
  }

  protected override disconnected(): void {
    this._reset();
    if (this._tapTimer !== undefined) {
      window.clearTimeout(this._tapTimer);
      this._tapTimer = undefined;
    }
    this._awaitingSecondTap = false;
  }
}

export const press = directive(PressDirective);
