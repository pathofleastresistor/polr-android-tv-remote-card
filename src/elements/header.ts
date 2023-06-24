import { LitElement, html, css } from "lit";
import { property, query } from "lit/decorators.js";

class PoLRHeaderCard extends LitElement {
    @property()
    private _hass: any;

    @property()
    public icon: any;

    @property()
    public additionalIcon;

    constructor() {
        super();
    }

    render() {
        return html`
            <div class="header-grid">
                <div class="header-icon">${this.icon}</div>
                <div class="header-content">
                    <div class="primary-info">Living Room TV Remote</div>
                    <div class="secondary-info">Netflix</div>
                    <div class="secondary-info"></div>
                </div>
                <div class="header-additional">
                    <div>${this.additionalIcon}</div>
                </div>
            </div>
        `;
    }

    static styles = css`
        .header-grid {
            background-color: grey;
            display: grid;
            grid-template-columns: 36px 1fr 36px;
            align-items: center;
            height: 56px;
            padding: 20px 20px;
            gap: 20px;
        }
        .header-icon {
            background-color: blue;
            border-radius: 5px;
            width: 36px;
            height: 36px;
        }
        .header-icon ha-icon {
            --mdc-icon-size: 36px;
            color: var(--polr-fox-primary-on-dark-color);
        }
        .header-content {
            display: flex;
            flex-direction: column;
        }
        .header-content .primary-info {
            font-weight: bold;
            font-size: 14px;
        }
        .header-content .secondary-info {
            font-size: 12px;
        }
        .header-additional {
            background-color: blue;
            border-radius: 5px;
            width: 36px;
            height: 36px;
            margin: auto;
        }
        .header-additional svg {
            fill: white;
            width: 26px;
            height: 26px;
            padding: 5px;
        }
    `;
}
customElements.define("polr-headercard", PoLRHeaderCard);
