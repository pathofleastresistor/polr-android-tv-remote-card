import { LitElement, html, css } from "lit";
import { property, query } from "lit/decorators.js";

class PoLRRemoteButton extends LitElement {
    @property() _hass: any;
    @property() icon: any;

    constructor() {
        super();
    }

    render() {
        return html` <div id="remotebutton">${this.icon}</div> `;
    }

    static styles = css`
        #remotebutton {
            display: flex;
            align-items: center;
            justify-content: center;
            justify-items: center;
            fill: var(--primary-text-color);
            border-radius: 5px;
            background-color: var(
                --ha-card-border-color,
                var(--divider-color, #e0e0e0)
            );
            cursor: pointer;
            height: 30px;
            pading: 20px;
        }

        svg {
            height: 30px;
            width: 30px;
        }
    `;
}
customElements.define("polr-remotebutton", PoLRRemoteButton);
