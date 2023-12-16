import { LitElement, html, css } from "lit";
import {
    eventOptions,
    property,
    query,
    queryAsync,
    state,
} from "lit/decorators.js";
import { Ripple } from "@material/mwc-ripple";
import { RippleHandlers } from "@material/mwc-ripple/ripple-handlers";

class PoLRButton extends LitElement {
    @property() _hass: any;
    @property() icon: any;
    @property() primary: any;
    @queryAsync("mwc-ripple") private _ripple!: Promise<Ripple | null>;

    @state() private _shouldRenderRipple = false;

    protected render() {
        return html`
            <button
                type="button"
                class="button"
                @focus=${this.handleRippleFocus}
                @blur=${this.handleRippleBlur}
                @mousedown=${this.handleRippleActivate}
                @mouseup=${this.handleRippleDeactivate}
                @mouseenter=${this.handleRippleMouseEnter}
                @mouseleave=${this.handleRippleMouseLeave}
                @touchstart=${this.handleRippleActivate}
                @touchend=${this.handleRippleDeactivate}
                @touchcancel=${this.handleRippleDeactivate}>
                <slot>
                    <div class="container">
                        <div class="icon-container">${this.icon}</div>
                        <div class="info-container">
                            <div class="primary">${this.primary}</div>
                            <div class="secondary"></div>
                        </div></div
                ></slot>
                ${this._shouldRenderRipple
                    ? html`<mwc-ripple></mwc-ripple>`
                    : ""}
            </button>
        `;
    }
    private _rippleHandlers: RippleHandlers = new RippleHandlers(() => {
        this._shouldRenderRipple = true;
        return this._ripple;
    });

    @eventOptions({ passive: true })
    private handleRippleActivate(evt?: Event) {
        this._rippleHandlers.startPress(evt);
    }

    private handleRippleDeactivate() {
        this._rippleHandlers.endPress();
    }

    private handleRippleMouseEnter() {
        this._rippleHandlers.startHover();
    }

    private handleRippleMouseLeave() {
        this._rippleHandlers.endHover();
    }

    private handleRippleFocus() {
        this._rippleHandlers.startFocus();
    }

    private handleRippleBlur() {
        this._rippleHandlers.endFocus();
    }

    static styles = css`
        :host {
            display: block;
            --control-button-icon-color: var(--primary-text-color);
            --control-button-background-color: var(--disabled-color);
            --control-button-background-opacity: 0.2;
            --control-button-border-radius: 10px;
            --mdc-icon-size: 20px;
            color: var(--primary-text-color);
            height: 40px;
            -webkit-tap-highlight-color: transparent;
        }
        .button {
            overflow: hidden;
            position: relative;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 100%;
            border-radius: var(--control-button-border-radius);
            border: none;
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            outline: none;
            overflow: hidden;
            background: none;
            --mdc-ripple-color: var(--control-button-background-color);
            /* For safari border-radius overflow */
            z-index: 0;
            font-size: inherit;
            color: inherit;
        }
        svg {
            width: 21px;
            height: 21px;
            fill: var(--primary-text-color);
        }
        .button::before {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            height: 100%;
            width: 100%;
            background-color: var(--control-button-background-color);
            transition: background-color 180ms ease-in-out,
                opacity 180ms ease-in-out;
            opacity: var(--control-button-background-opacity);
        }
        .button ::slotted(*) {
            transition: color 180ms ease-in-out;
            color: var(--control-button-icon-color);
            pointer-events: none;
        }
        .button:disabled {
            cursor: not-allowed;
            --control-button-background-color: var(--disabled-color);
            --control-button-icon-color: var(--disabled-text-color);
            --control-button-background-opacity: 0.2;
        }
        .container {
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 0px;
        }
        .icon-container {
            margin-right: 0px;
        }
    `;
}
customElements.define("polr-button", PoLRButton);
