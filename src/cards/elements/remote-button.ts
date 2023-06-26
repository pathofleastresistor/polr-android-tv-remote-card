import { LitElement, html, css } from "lit";
import { property, query } from "lit/decorators.js";

class PoLRRemoteButton extends LitElement {
    @property() _hass: any;
    @property() icon: any;
    @query("#remotebutton") remotebutton;

    render() {
        return html`
            <div
                @click=${this._click}
                @mousedown=${this._startPress}
                @mouseup=${this._endPress}
                @touchstart=${this._startPress}
                @touchend=${this._endPress}
                id="remotebutton">
                ${this.icon}
            </div>
        `;
    }

    _startPress(ev) {
        this.remotebutton.classList.add("pressed");
    }
    _endPress(ev) {
        this.remotebutton.classList.remove("pressed");
    }

    _click(ev) {}

    static styles = css`
        #remotebutton {
            display: flex;
            align-items: center;
            justify-content: center;
            justify-items: center;
            fill: #381e72;
            border-radius: 8px;
            background-color: #d0bcff;
            cursor: pointer;
            height: 100%;
            min-height: 30px;
            min-width: 30px;
            padding: 5px;
        }

        svg {
            height: 36px;
            width: 36px;
        }
        .pressed {
            transform: matrix(0.95, 0, 0, 0.95, 0, 0);
        }
    `;
}
customElements.define("polr-remotebutton", PoLRRemoteButton);
