import { LitElement, html, css } from "lit";
import { property, query } from "lit/decorators.js";
import "hammerjs";

class PoLRTouchpad extends LitElement {
    @property() _mc: any;
    @property() _hass: any;
    @property() up: any;
    @query("#pad") pad;
    @query("#circle") circle;

    connectedCallback() {
        super.connectedCallback();
        this._mc = new Hammer(this);
        this._mc.get("swipe").set({ direction: Hammer.DIRECTION_ALL });
        this._mc.get("pan").set({ direction: Hammer.DIRECTION_ALL });
        this._mc.on(
            "swipeup swipedown swiperight swipeleft tap press",
            (ev) => {
                this.dispatchEvent(
                    new CustomEvent("padaction", {
                        detail: {
                            action: ev.type,
                        },
                    })
                );
            }
        );
        this._mc.on("panstart panmove", (event) => {
            const rect = this.pad.getBoundingClientRect();
            const size = 20;
            this.circle.style.padding = `${size}px`;
            this.circle.style.opacity = 1;
            this.circle.style.transition = "opacity 0s";
            const clientX = event.center.x;
            const clientY = event.center.y;

            this.circle.style.visibility = "visible";

            this.circle.style.left = `${this.clamp(
                clientX - rect.left - size,
                0 - size,
                rect.width - rect.left + size
            )}px`;

            this.circle.style.top = `${this.clamp(
                clientY - rect.top - size,
                0 - size,
                rect.height - size
            )}px`;
        });
        this._mc.on("panend", (event) => {
            this.circle.style.transition = "all 1s";
            this.circle.style.opacity = 0;
        });
    }
    disconnectedCallback(): void {
        super.disconnectedCallback();
        if (this._mc) {
            this._mc.destroy();
            this._mc = undefined;
        }
    }

    render() {
        return html`
            <div id="pad">
                <div id="circle"></div>
            </div>
        `;
    }

    static styles = css`
        #pad {
            position: relative;
            height: 100%;
            min-height: 100px;
            max-height: 600px;
            width: 100%;
            min-width: 250px;
            background: #ededed;
            border-radius: 12px;
            overflow: hidden;
        }

        #circle {
            position: absolute;
            padding: 20px;
            background-color: #1e0d40;
            border-radius: 50%;
            opacity: 0%;
        }
    `;

    clamp(value: number, min: number, max: number) {
        return Math.min(Math.max(value, min), max);
    }
}
customElements.define("polr-touchpad", PoLRTouchpad);
