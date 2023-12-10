import { LitElement, html, css } from "lit";
import { property, query } from "lit/decorators.js";
import { PowerIcon } from "../../utils/icons";
import "hammerjs";
import "../elements/header";

export class PoLRToggleCard extends LitElement {
    @property() _mc: any;
    @property() private _config: any;
    @property() private _hass: any;
    @property() private _entity_id: string;
    @property() private _icon: string;
    @property() private _name;
    private _timer;
    string;
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
        this._entity_id = config.entity_id;
        this._icon = config.icon || "mdi:lightbulb";
        this._name = config.name || "No name";
        this._attribute = config.info || 0;
    }

    set hass(hass) {
        this._hass = hass;
    }

    connectedCallback() {
        super.connectedCallback();
    }

    disconnectedCallback(): void {
        super.disconnectedCallback();
        if (this._mc) {
            this._mc.destroy();
            this._mc = undefined;
        }
    }

    render() {
        var entity = this._hass?.states[this._entity_id];
        var info_value = entity.attributes[this._attribute] ?? 0;

        return html`
            <ha-card>
                <polr-headercard
                    @click=${this._toggle}
                    @press=${this._startPress}
                    @pressup=${this._endPress}
                    mdiIcon=${this._icon}
                    _hass=${this._hass}
                    entity_id=${this._entity_id}
                    primaryInfo=${this._name}
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
            entity_id: this._entity_id,
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
            entityId: this._entity_id,
        };
        this.dispatchEvent(event);
    }

    static styles = css`
        :host {
            --polr-fox-color-primary: #d0bcff;
            --polr-fox-color-background: #381e72;
            --mdc-icon-size: 24px;
            --polr-fox-icon-primary-size: 18px;
            --polr-fox-primary-font-size: 14px;
            --polr-fox-card-height: 76px;
        }
        ha-card {
            overflow: hidden;
            cursor: pointer;
            border: none;
            border-radius: 12px;
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
