import { LitElement, html, css } from "lit";
import { property, query } from "lit/decorators.js";
import { PowerIcon } from "../../utils/icons";
import "../elements/header";

export class PoLRToggleCard extends LitElement {
    @property() private _config: any;
    @property() private _hass: any;
    @property() private _entity: string;
    @property() private _icon: string;
    @property() private _attribute: number;
    @query("ha-card") _card;

    static getConfigElement() {}

    static getStubConfig() {}

    static get properties() {
        return {
            _hass: {},
            _config: {},
        };
    }

    setConfig(config) {
        if (!config.entity_id) {
            throw new Error("entity_id must be specified");
        }
        this._entity = config.entity_id;
        this._icon = config.icon || "mdi:lightbulb";
        this._attribute = config.info || 0;
    }

    set hass(hass) {
        this._hass = hass;
    }

    render() {
        var entity = this._hass?.states[this._entity];
        var info_value = entity.attributes[this._attribute] ?? 0;

        return html`
            <ha-card
                @mousedown=${this._startPress}
                @mouseup=${this._endPress}
                @touchstart=${this._startPress}
                @touchend=${this._endPress}>
                <polr-headercard
                    @click=${this._toggle}
                    mdiIcon=${this._icon}
                    _hass=${this._hass}
                    entity_id=${this._entity}
                    primaryInfo=${entity.attributes.friendly_name}
                    secondaryInfo="${Math.round((100 * info_value) / 255)}%">
                </polr-headercard>
            </ha-card>
        `;
    }

    _startPress(ev) {
        this._card.classList.add("pressed");
    }
    _endPress(ev) {
        this._card.classList.remove("pressed");
    }

    _toggle(ev) {
        this._hass?.callService("light", "toggle", {
            entity_id: this._entity,
        });
    }

    _moreinfo(ev) {
        console.log("more-info");
        const event = new Event("hass-more-info", {
            bubbles: true,
            cancelable: true,
            composed: true,
        });
        (event as any).detail = {
            entityId: this._entity,
        };
        this.dispatchEvent(event);
    }

    static styles = css`
        ha-card {
            overflow: hidden;
            cursor: pointer;
        }

        .pressed {
            transform: matrix(0.95, 0, 0, 0.95, 0, 0);
        }
    `;
}

customElements.define("polr-toggle-card", PoLRToggleCard);
(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
    type: "polr-toggle-card",
    name: "PoLR Toggle Card",
    description: "A toggle card.",
});
