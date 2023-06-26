import { LitElement, html, css } from "lit";
import { property, query } from "lit/decorators.js";

class PoLRHeaderCard extends LitElement {
    @property() private _hass: any;
    @property() public icon: any;
    @property() public mdiIcon: any;
    @property() public additionalIcon;
    @property() public mdiAdditionalIcon;
    @property() public additionalInfo;
    @property() public primaryInfo;
    @property() public secondaryInfo;
    @property() public entity_id;
    @property() public toggleIcon;

    constructor() {
        super();
    }

    render() {
        var state = this._hass["states"][this.entity_id]["state"];

        //TODO: improve on this logic
        var icon_content;
        if (this.icon) {
            icon_content = html` ${this.icon} `;
        } else if (this.mdiIcon) {
            icon_content = html` <ha-icon icon="${this.mdiIcon}"></ha-icon> `;
        }

        var header_content = [];
        header_content.push(
            html`<div class="primary-info">${this.primaryInfo}</div>`
        );
        if (this.secondaryInfo) {
            header_content.push(
                html`<div class="secondary-info">${this.secondaryInfo}</div>`
            );
        }

        //TODO: improve on this logic
        var additional_content;
        if (this.additionalIcon) {
            additional_content = html`
                <div class="header-additional">
                    <div
                        class="button ${this.toggleIcon && state === "on"
                            ? "on"
                            : "off"}"
                        @click=${this._additionalClick}>
                        ${this.additionalIcon}
                    </div>
                </div>
            `;
        } else if (this.mdiAdditionalIcon) {
            additional_content = html`
                <div class="header-additional">
                    <div
                        class="button ${this.toggleIcon && state === "on"
                            ? "on"
                            : "off"}"
                        @click=${this._additionalClick}>
                        ${this.mdiAdditionalIcon}
                    </div>
                </div>
            `;
        } else if (this.additionalInfo) {
            additional_content = html`
                <div class="header-additional">${this.additionalInfo}</div>
            `;
        }

        return html`
            <div
                class="header-grid ${additional_content
                    ? "grid-col-3"
                    : "grid-col-2"}">
                <div class="header-icon">${icon_content}</div>
                <div class="header-content">${header_content}</div>
                ${additional_content}
            </div>
        `;
    }

    _additionalClick(ev) {
        this.dispatchEvent(new CustomEvent("additionalclick"));
    }

    static styles = css`
        :host {
            color: #d0bcff;
        }
        .header-grid {
            display: grid;
            align-items: center;
            background: #381e72;
            height: 56px;
            padding: 20px 20px;
            gap: 20px;
        }
        .grid-col-2 {
            grid-template-columns: 36px 1fr;
        }
        .grid-col-3 {
            grid-template-columns: 36px 1fr 70px;
        }
        .header-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 5px;
            width: 36px;
            height: 36px;
        }
        .header-icon svg {
            fill: #d0bcff;
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
            display: flex;
            flex-direction: column;
            text-align: right;
            justify-self: end;
        }
        .header-additional .button {
            border-radius: 5px;
            cursor: pointer;
            width: fit-content;
        }
        .on {
            background: #1e0d40;
            transition: background 0.4s;
        }
        .off {
            background: none;
            transition: background 0.4s;
        }
        .header-additional svg {
            fill: #d0bcff;
            width: 26px;
            height: 26px;
            padding: 5px 5px 0 5px;
        }
        .header-additional .primary-info {
            flex: 1fr;
            font-weight: bold;
            font-size: 18px;
        }
        .header-additional .secondary-info {
            flex: 1fr;
            font-size: 12px;
        }
    `;
}
customElements.define("polr-headercard", PoLRHeaderCard);
