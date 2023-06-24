import { LitElement, html, css } from "lit";
import { property, query } from "lit/decorators.js";
import 'hammerjs';


class PoLRTouchpad extends LitElement {
    @property() _mc : any;
    @property() _hass : any;
    @property() up : any;
    @query("touchpad") touchpad;

    constructor() {
        super();
    }

    connectedCallback() {
        super.connectedCallback()
        this._mc = new Hammer(this);
        this._mc.get('swipe').set({ direction: Hammer.DIRECTION_ALL });
        this._mc.on("swipeup swipedown swiperight swipeleft tap press", (ev) => {
            console.log(ev.type);

            this.dispatchEvent(
                new CustomEvent("padaction", {
                    detail: {
                        action: ev.type
                    }

                })
            );
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
            <ha-card id="pad">
            </ha-card>
        `;
    }

    static styles = css`
        #pad {
            height: 300px;
            width: 100%;
            min-width: 250px;
            background: #ededed;
            border-radius: 12px;
        }
    `;


}
customElements.define("polr-touchpad", PoLRTouchpad);