import { LitElement, html, css } from "lit";
import { property, query } from "lit/decorators.js";

class PoLRHeaderCard extends LitElement {
    @property() private _hass: any;
    @property() public icon: any;
    @property() public additionalIcon;
    @property() public primaryInfo;
    @property() public secondaryInfo;
    @property() public entity_id;

    constructor() {
        super();
    }

    render() {
        var state = this._hass["states"][this.entity_id]["state"];

        var header_content = [];
        header_content.push(
            html`<div class="primary-info">${this.primaryInfo}</div>`
        );
        if (this.secondaryInfo) {
            header_content.push(
                html`<div class="secondary-info">${this.secondaryInfo}</div>`
            );
        }
        return html`
            <div class="header-grid">
                <div class="header-icon">${this.icon}</div>
                <div class="header-content">${header_content}</div>
                <div
                    class="header-additional ${state === "on" ? "on" : "off"}"
                    @click=${this._additionalClick}>
                    ${this.additionalIcon}
                </div>
            </div>
        `;
    }

    _additionalClick(ev) {
        this.dispatchEvent(new CustomEvent("additionalclick"));
    }

    static styles = css`
        .header-grid {
            background: #381e72;
            display: grid;
            grid-template-columns: 36px 1fr min-content;
            align-items: center;
            height: 56px;
            padding: 20px 20px;
            gap: 20px;
        }
        .header-icon {
            border-radius: 5px;
            width: 36px;
            height: 36px;
        }
        .header-icon svg {
            fill: #ededed;
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
            border-radius: 5px;
            width: 36px;
            height: 36px;
            margin: auto;
            padding: 4px;
        }
        .on {
            background: #1e0d40;
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
