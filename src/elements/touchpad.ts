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
            const clientX = event.center.x;
            const clientY = event.center.y;

            this.circle.style.padding = `${size}px`;
            this.circle.style.transition = "opacity 0s";
            this.circle.style.opacity = 1;
            this.circle.style.visibility = "visible";
            this.circle.style.left = `${this.clamp(
                clientX - rect.left - size,
                0 - size,
                rect.width + size - rect.left
            )}px`;

            this.circle.style.top = `${this.clamp(
                clientY - rect.top - size,
                0 - size,
                rect.height - size
            )}px`;
        });
        this._mc.on("panend", (event) => {
            this.circle.style.opacity = 0;
            this.circle.style.transition = "opacity 0.4s";
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
            <div id="pad" @click=${this._click}>
                <div id="circle"></div>
            </div>
        `;
    }

    _click(e) {
        var d = document.createElement("div");
        d.className = "clickEffect";
        d.style.top = e.clientY + "px";
        d.style.left = e.clientX + "px";
        this.pad.appendChild(d);
        d.addEventListener(
            "animationend",
            function () {
                this.pad.removeChild(d);
            }.bind(this)
        );
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

        div.clickEffect {
            position: fixed;
            background-color: #1e0d40;
            border-radius: 50%;
            animation: clickEffect 0.4s ease-out;
        }
        @keyframes clickEffect {
            0% {
                opacity: 1;
                width: 20px;
                height: 20px;
            }
            100% {
                opacity: 0.2;
                width: 15em;
                height: 15em;
                margin: -7.5em;
                border-width: 0.03em;
            }
        }
    `;

    clamp(value: number, min: number, max: number) {
        return Math.min(Math.max(value, min), max);
    }
}
customElements.define("polr-touchpad", PoLRTouchpad);
