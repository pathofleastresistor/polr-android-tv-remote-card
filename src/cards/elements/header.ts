import { LitElement, html, css } from "lit";
import { property, query } from "lit/decorators.js";
import "./button";

class PoLRHeaderCard extends LitElement {
    @property() private _hass: any;
    @property() public icon: any;
    @property() public mdiIcon: any;
    @property() public actionIcon;
    @property() public mdiActionIcon;
    @property() public primaryInfo;
    @property() public secondaryInfo;
    @property() public entity_id;

    render() {
        var state = this._hass["states"][this.entity_id]["state"];

        return html`
            <div class="header">
                <div
                    class="icon-container ${state === "on" ? "on" : ""}"
                    @click=${this._iconClick}>
                    ${this.icon}
                </div>
                <div class="info-container" @click=${this._iconClick}>
                    <div class="primary">${this.primaryInfo}</div>
                    <div class="secondary">${this.secondaryInfo}</div>
                </div>
                <polr-button
                    class="action-container ${state === "on" ? "on" : "off"}"
                    @click=${this._actionClick}
                    icon=${this.actionIcon}></polr-button>
            </div>
        `;
    }

    _iconClick(ev) {
        const event = new Event("headericonclick", {
            bubbles: true,
            composed: true,
        });
        this.dispatchEvent(event);
    }
    _actionClick(ev) {
        const event = new Event("additionalclick", {
            bubbles: true,
            composed: true,
        });
        this.dispatchEvent(event);
    }

    static styles = css`
        :host {
            color: var(--primary-text-color);
        }
        .header {
            display: grid;
            align-items: center;
            padding: 12px;
            gap: 12px;
            grid-template-columns: min-content 1fr 40px;
            background: var(
                --ha-card-background,
                var(--card-background-color, #fff)
            );
        }
        .icon-container {
            display: flex;
            justify-content: center;
            border-radius: 50%;
            background-color: rgba(111, 111, 111, 0.2);
            height: 40px;
            width: 40px;
            cursor: pointer;
        }
        .icon-container > svg {
            fill: var(--polr-fox-icon-color-disabled, rgba(111, 111, 111));
            width: 24px;
        }
        .icon-container.on svg {
            fill: var(--polr-fox-icon-color, #ffffff);
        }
        .info-container {
            display: flex;
            flex-direction: column;
            cursor: pointer;
        }
        .info-container .primary {
            font-size: var(--polr-fox-primary-font-size, 14px);
            font-weight: var(--card-primary-font-weight, bold);
        }
        .info-container .secondary {
            font-size: var(--polr-fox-secondary-font-size, 12px);
            font-weight: var(--card-secondary-font-weight, bold);
            color: var(--secondary-text-color);
        }
        .action-container {
            cursor: pointer;
        }
        .action-container.off {
            display: none;
        }
        .action-container svg {
            fill: #ffffff;
            width: 21px;
            height: 21px;
            padding: 5px 5px 0 5px;
        }
    `;
}
customElements.define("polr-headercard", PoLRHeaderCard);
