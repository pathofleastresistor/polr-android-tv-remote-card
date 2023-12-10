import { LitElement, html, css } from "lit";
import { property, query } from "lit/decorators.js";
import "hammerjs";

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
    private _mc: any;
    @query("#additional-button") additionalButton;
    private _mcAdditionaButton: any;

    connectedCallback() {
        super.connectedCallback();
        this._mc = new Hammer(this);
        this._mc.add(new Hammer.Press({ time: 0 }));
        this._mc.on("pressup", (ev) => {
            this.dispatchEvent(new CustomEvent("pressup"));
        });
        this._mc.on("press", (ev) => {
            this.dispatchEvent(new CustomEvent("press"));
        });
        if (this.additionalButton) {
            this._mcAdditionaButton = new Hammer(this.additionalButton);
            this._mcAdditionaButton.add(new Hammer.Press({ time: 0 }));
            this._mcAdditionaButton.on("pressup", (ev) => {
                this.dispatchEvent(new CustomEvent("pressup-addl-button"));
            });
            this._mcAdditionaButton.on("press", (ev) => {
                this.dispatchEvent(new CustomEvent("press-addl-button"));
            });
        }
    }

    disconnectedCallback(): void {
        super.disconnectedCallback();
        if (this._mcAdditionaButton) {
            this._mc.destroy();
            this._mc = undefined;
        }
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
                        id="additional-button"
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
                        id="additional-button"
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
                <div
                    @click=${this._headericonClick}
                    class="header-icon ${this.toggleIcon && state === "on"
                        ? "icon-on"
                        : "icon-off"}">
                    ${icon_content}
                </div>
                <div class="header-content">${header_content}</div>
                ${additional_content}
            </div>
        `;
    }

    _headericonClick(ev) {
        const event = new Event("headericonclick", {
            bubbles: true,
            composed: true,
        });
        this.dispatchEvent(event);
    }
    _additionalClick(ev) {
        const event = new Event("additionalclick", {
            bubbles: true,
            composed: true,
        });
        this.dispatchEvent(event);
    }

    static styles = css`
        :host {
            color: var(--primary-text-color);
            overflow: hidden;
            height: 100%;
        }
        .header-grid {
            display: grid;
            align-items: center;
            background: var(
                --ha-card-background,
                var(--card-background-color, #fff)
            );
            padding: 12px;
            gap: 12px;
        }
        .grid-col-2 {
            grid-template-columns: auto 1fr;
        }
        .grid-col-3 {
            grid-template-columns: auto 1fr auto;
        }
        .header-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            margin: auto;
            background-color: rgba(111, 111, 111, 0.2);
            height: 40px;
            width: 40px;
            cursor: pointer;
        }
        .icon-off > svg {
            fill: var(--polr-fox-icon-color-disabled, rgba(111, 111, 111));
            width: 24px;
        }
        .icon-on > svg {
            fill: var(--polr-fox-icon-color, #ffffff);
            width: 24px;
        }
        .header-content {
            display: flex;
            flex-direction: column;
        }
        .header-content .primary-info {
            font-size: var(--polr-fox-primary-font-size, 14px);
            font-weight: var(--card-primary-font-weight, bold);
        }
        .header-content .secondary-info {
            font-size: var(--polr-fox-secondary-font-size, 12px);
            font-weight: var(--card-secondary-font-weight, bold);
            color: var(--secondary-text-color);
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
            transition: background 0.4s;
        }
        .off {
            background: none;
            transition: background 0.4s;
            display: none;
        }
        .header-additional svg {
            fill: #ffffff;
            width: 21px;
            height: 21px;
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
