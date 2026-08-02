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

export interface PressOptions {
  /** Runs on press, and on every repeat. */
  onPress: () => void;
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
  private _repeats = 0;
  private _inFlight = false;
  private _bound = false;

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
    this._fire();

    if (!options.repeat) return;
    this._repeats = 0;
    this._timer = window.setTimeout(() => {
      this._timer = window.setInterval(() => {
        if (this._repeats >= MAX_REPEATS) {
          this._stop();
          return;
        }
        this._repeats += 1;
        this._fire();
      }, REPEAT_INTERVAL_MS);
    }, REPEAT_DELAY_MS);
  }

  private _fire(): void {
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
      fireEvent(this._element, "haptic", "light");
    }
    options.onPress();
  }

  private _onRelease = (): void => {
    this._stop();
  };

  private _stop(): void {
    this._element?.classList.remove("pressed");
    if (this._timer !== undefined) {
      window.clearTimeout(this._timer);
      window.clearInterval(this._timer);
      this._timer = undefined;
    }
    this._repeats = 0;
  }

  protected override disconnected(): void {
    this._stop();
  }
}

export const press = directive(PressDirective);
