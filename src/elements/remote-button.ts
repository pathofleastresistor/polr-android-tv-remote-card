import { LitElement, html, css } from "lit";
import { property, query } from "lit/decorators.js";

class PoLRRemoteButton extends LitElement {
    @property() _hass: any;
    @property() icon: any;
    @query("#remotebutton") remotebutton;

    render() {
        return html`
            <div @click=${this._click} id="remotebutton">${this.icon}</div>
        `;
    }

    _click(ev) {}

    static styles = css`
        #remotebutton {
            display: flex;
            align-items: center;
            justify-content: center;
            justify-items: center;
            fill: var(--primary-text-color);
            border-radius: 8px;
            background-color: #373737;
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
    `;
}
customElements.define("polr-remotebutton", PoLRRemoteButton);
