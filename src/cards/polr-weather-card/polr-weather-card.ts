import { LitElement, html, css } from "lit";
import { property } from "lit/decorators.js";
import { PlayCircleIcon, TvRemoteIcon } from "../../utils/icons";
import "../elements/header";
import { getWeatherStateSVG, WeatherStrings } from "./utils";

export class PoLRWeatherCard extends LitElement {
    @property() private _config: any;
    @property() private _hass: any;
    @property() private _entity: string;

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
    }

    set hass(hass) {
        this._hass = hass;
    }

    render() {
        var weather = this._hass?.states[this._entity];

        var weather_additional_content = html`
            <div class="primary-info">
                ${weather.attributes.temperature}
                ${weather.attributes.temperature_unit}
            </div>
            <div class="secondary-info">
                ${weather.attributes.forecast[0].templow}
                ${weather.attributes.temperature_unit} /
                ${weather.attributes.forecast[0].temperature}
                ${weather.attributes.temperature_unit}
            </div>
        `;

        return html`
            <ha-card>
                <polr-headercard
                    icon=${getWeatherStateSVG(weather.state, false)}
                    _hass=${this._hass}
                    entity_id=${this._entity}
                    primaryInfo=${WeatherStrings[weather.state]}
                    secondaryInfo=${WeatherStrings[weather.state]}
                    additionalInfo=${weather_additional_content}>
                </polr-headercard>
            </ha-card>
        `;
    }
    static styles = css`
        ha-card {
            overflow: hidden;
        }
    `;
}

customElements.define("polr-weather-card", PoLRWeatherCard);
(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
    type: "polr-weather-card",
    name: "PoLR Weather Card",
    description: "A weather card.",
});
