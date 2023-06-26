import { LitElement, html, css } from "lit";
import { property } from "lit/decorators.js";
import { PowerIcon } from "../../utils/icons";
import "../elements/header";

export class PoLRToggleCard extends LitElement {
    @property() private _config: any;
    @property() private _hass: any;
    @property() private _entity: string;
    @property() private _icon: string;

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
    }

    set hass(hass) {
        this._hass = hass;
    }

    render() {
        var entity = this._hass?.states[this._entity];
        var brightness = entity.attributes.brightness ?? 0;

        return html`
            <ha-card>
                <polr-headercard
                    @click=${this._toggle}
                    mdiIcon=${this._icon}
                    _hass=${this._hass}
                    entity_id=${this._entity}
                    primaryInfo=${entity.attributes.friendly_name}
                    secondaryInfo="${Math.round((100 * brightness) / 255)}%">
                </polr-headercard>
            </ha-card>
        `;
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
