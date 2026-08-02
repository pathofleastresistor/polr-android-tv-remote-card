/**
 * The directional pad, in three flavours.
 *
 * Emits `atv-nav` with a direction; it knows nothing about Home Assistant or
 * about config. That keeps the gesture handling — the fiddliest code in the
 * card — testable in isolation and stops it leaking into the card element.
 *
 * The touchpad uses Pointer Events, which cover mouse, touch and pen in one
 * code path. v1 maintained parallel mouse* and touch* handlers that had already
 * drifted apart, and cached its element refs in firstUpdated() so switching
 * layout at runtime left them pointing at removed nodes.
 */

import { LitElement, html, nothing, type TemplateResult } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";

import type { PadStyle } from "./config";
import { press } from "./press";
import { remoteStyles } from "./styles";
import { tileStyles } from "./kit/styles";
import { fireEvent } from "./kit/types";

export type NavDirection = "up" | "down" | "left" | "right" | "center";

/** Below this fraction of the pad, a drag counts as a tap. */
const TAP_THRESHOLD = 0.06;

const ARROWS: Record<string, NavDirection> = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
  Enter: "center",
  " ": "center",
};

@customElement("polr-atv-nav-pad")
export class PolrAtvNavPad extends LitElement {
  static override styles = [tileStyles, remoteStyles];

  @property({ type: String }) public pad: PadStyle = "buttons";
  @property({ type: Boolean }) public repeat = true;
  @property({ type: Boolean }) public haptics = true;

  @query(".touchpad") private _touchpad?: HTMLElement;
  @query(".touchpad-dot") private _dot?: HTMLElement;

  @state() private _tracking = false;

  private _startX = 0;
  private _startY = 0;

  private _emit(direction: NavDirection): void {
    fireEvent(this, "atv-nav", { direction });
  }

  private _key(
    direction: NavDirection,
    icon: string,
    label: string,
    extraClass = "",
  ): TemplateResult {
    return html`
      <button
        class="pad-key ${extraClass}"
        type="button"
        aria-label=${label}
        ${press({
          onPress: () => this._emit(direction),
          repeat: this.repeat && direction !== "center",
          haptics: this.haptics,
        })}
      >
        <ha-icon icon=${icon}></ha-icon>
      </button>
    `;
  }

  private _blank(): TemplateResult {
    return html`<span class="pad-key blank" aria-hidden="true"></span>`;
  }

  /**
   * A plus-shaped button pad.
   *
   * v1 packed power, home, back and favourite into the four corners of this
   * grid, which is why it had to suppress the separate navigation row. Keeping
   * the pad purely directional means one obvious home for each control, and no
   * setting to reconcile the two.
   */
  private _renderButtons(): TemplateResult {
    return html`
      <div class="button-pad" role="group" aria-label="Directional pad">
        ${this._blank()} ${this._key("up", "mdi:chevron-up", "Up")} ${this._blank()}
        ${this._key("left", "mdi:chevron-left", "Left")}
        ${this._key("center", "mdi:circle", "Select", "ok")}
        ${this._key("right", "mdi:chevron-right", "Right")}
        ${this._blank()} ${this._key("down", "mdi:chevron-down", "Down")} ${this._blank()}
      </div>
    `;
  }

  private _renderDpad(): TemplateResult {
    return html`
      <div class="dpad" role="group" aria-label="Directional pad">
        ${this._key("up", "mdi:chevron-up", "Up", "up")}
        ${this._key("left", "mdi:chevron-left", "Left", "left")}
        <button
          class="pad-key ok"
          type="button"
          aria-label="Select"
          ${press({ onPress: () => this._emit("center"), haptics: this.haptics })}
        >
          <span>OK</span>
        </button>
        ${this._key("right", "mdi:chevron-right", "Right", "right")}
        ${this._key("down", "mdi:chevron-down", "Down", "down")}
      </div>
    `;
  }

  /**
   * Swipe to move, tap to select.
   *
   * `role="application"` plus arrow-key handling, because a swipe surface is
   * otherwise completely unusable from a keyboard — which is what v1 shipped.
   */
  private _renderTouchpad(): TemplateResult {
    return html`
      <div
        class="touchpad"
        role="application"
        tabindex="0"
        aria-label="Touchpad: swipe to move, tap to select, or use the arrow keys"
        @pointerdown=${this._onPointerDown}
        @pointermove=${this._onPointerMove}
        @pointerup=${this._onPointerUp}
        @pointercancel=${this._onPointerCancel}
        @keydown=${this._onKeyDown}
      >
        <ha-icon class="touchpad-mark" icon="mdi:gesture-swipe"></ha-icon>
        <span class="touchpad-dot ${this._tracking ? "visible" : ""}"></span>
        <span class="touchpad-hint">swipe to move · tap to select</span>
      </div>
    `;
  }

  private _onPointerDown = (event: PointerEvent): void => {
    if (event.button !== 0) return;
    event.preventDefault();
    this._touchpad?.setPointerCapture(event.pointerId);
    this._startX = event.clientX;
    this._startY = event.clientY;
    this._tracking = true;
    this._moveDot(event);
  };

  private _onPointerMove = (event: PointerEvent): void => {
    if (!this._tracking) return;
    event.preventDefault();
    this._moveDot(event);
  };

  private _moveDot(event: PointerEvent): void {
    const pad = this._touchpad;
    const dot = this._dot;
    if (!pad || !dot) return;
    const rect = pad.getBoundingClientRect();
    dot.style.transform = `translate(${event.clientX - rect.left}px, ${
      event.clientY - rect.top
    }px)`;
  }

  private _onPointerUp = (event: PointerEvent): void => {
    if (!this._tracking) return;
    this._tracking = false;

    const pad = this._touchpad;
    if (!pad) return;
    const rect = pad.getBoundingClientRect();
    const dx = (event.clientX - this._startX) / rect.width;
    const dy = (event.clientY - this._startY) / rect.height;

    if (Math.abs(dx) < TAP_THRESHOLD && Math.abs(dy) < TAP_THRESHOLD) {
      this._emit("center");
      return;
    }
    // Dominant axis wins, as v1 did — diagonal swipes are ambiguous on a TV.
    if (Math.abs(dx) >= Math.abs(dy)) {
      this._emit(dx < 0 ? "left" : "right");
    } else {
      this._emit(dy < 0 ? "up" : "down");
    }
  };

  private _onPointerCancel = (): void => {
    this._tracking = false;
  };

  private _onKeyDown = (event: KeyboardEvent): void => {
    const direction = ARROWS[event.key];
    if (!direction) return;
    event.preventDefault();
    this._emit(direction);
  };

  protected override render(): TemplateResult | typeof nothing {
    return html`
      <div class="pad">
        ${this.pad === "touchpad"
          ? this._renderTouchpad()
          : this.pad === "dpad"
            ? this._renderDpad()
            : this._renderButtons()}
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "polr-atv-nav-pad": PolrAtvNavPad;
  }
}
