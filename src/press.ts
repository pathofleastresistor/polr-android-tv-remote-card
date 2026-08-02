/**
 * Press handling for every control on the card.
 *
 * v1 wired `@click` onto bare `<div>`s: no keyboard, no screen-reader
 * semantics, no press feedback, no way to hold an arrow down. This replaces all
 * of it with one directive used everywhere, so a control cannot accidentally be
 * built without those things.
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

export interface PressOptions {
  /** Runs on press, and on every repeat. */
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
   * to know a tap is single until it has passed. Left undefined, taps fire
   * immediately — which is why it is only wired when actually configured.
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
 * repeat timer, the pointer capture and the `.pressed` class are one unit, and
 * splitting them across a template is how they drift apart.
 */
class PressDirective extends AsyncDirective {
  private _element?: HTMLElement;
  private _options?: PressOptions;
  private _timer?: number;
  private _holdTimer?: number;
  private _tapTimer?: number;
  private _repeats = 0;
  private _inFlight = false;
  private _bound = false;
  private _held = false;
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
      el.addEventListener("pointerup", this._onRelease);
      el.addEventListener("pointercancel", this._onRelease);
      el.addEventListener("pointerleave", this._onRelease);
      el.addEventListener("keydown", this._onKeyDown);
      el.addEventListener("keyup", this._onRelease);
      el.addEventListener("blur", this._onRelease);
      // The browser would otherwise pop a text-selection or context menu on a
      // long press, which is exactly the gesture hold-to-repeat needs.
      el.addEventListener("contextmenu", (event) => event.preventDefault());
    }
    return noChange;
  }

  private _onPointerDown = (event: PointerEvent): void => {
    // Primary button only; a right-click should not drive the TV.
    if (event.button !== 0) return;
    event.preventDefault();
    this._element?.setPointerCapture?.(event.pointerId);
    this._start();
  };

  private _onKeyDown = (event: KeyboardEvent): void => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    // Held keys arrive as a stream of keydowns; let the repeat timer own the
    // cadence instead of the OS key-repeat rate.
    if (event.repeat) return;
    this._start();
  };

  private _start(): void {
    const options = this._options;
    if (!options || options.disabled) return;

    this._element?.classList.add("pressed");
    this._held = false;

    // A hold action means the press cannot resolve until the pointer lifts or
    // the threshold passes, so nothing fires here.
    if (options.onHold) {
      this._holdTimer = window.setTimeout(() => {
        this._held = true;
        this._fire(options.onHold!, "medium");
      }, HOLD_MS);
      return;
    }

    this._tap();

    if (!options.repeat) return;
    this._repeats = 0;
    this._timer = window.setTimeout(() => {
      this._timer = window.setInterval(() => {
        if (this._repeats >= MAX_REPEATS) {
          this._stop();
          return;
        }
        this._repeats += 1;
        this._fire(options.onPress);
      }, REPEAT_INTERVAL_MS);
    }, REPEAT_DELAY_MS);
  }

  /** A tap, resolving single vs double first when that distinction exists. */
  private _tap(): void {
    const options = this._options!;
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

  private _onRelease = (): void => {
    const options = this._options;
    // A hold that never reached the threshold is an ordinary tap.
    if (options?.onHold && !this._held && this._holdTimer !== undefined) {
      this._tap();
    }
    this._stop();
  };

  private _stop(): void {
    this._element?.classList.remove("pressed");
    if (this._timer !== undefined) {
      window.clearTimeout(this._timer);
      window.clearInterval(this._timer);
      this._timer = undefined;
    }
    if (this._holdTimer !== undefined) {
      window.clearTimeout(this._holdTimer);
      this._holdTimer = undefined;
    }
    this._held = false;
    this._repeats = 0;
  }

  protected override disconnected(): void {
    this._stop();
    if (this._tapTimer !== undefined) {
      window.clearTimeout(this._tapTimer);
      this._tapTimer = undefined;
    }
    this._awaitingSecondTap = false;
  }
}

export const press = directive(PressDirective);
