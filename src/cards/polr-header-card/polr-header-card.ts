import { LitElement, html, css } from "lit";
import { property } from "lit/decorators.js";
import { PlayCircleIcon, TvRemoteIcon } from "../../utils/icons";
import "../elements/header";

export class PoLRHeaderCard extends LitElement {
    @property() _config: any;
    @property() _hass: any;
    @property() _primaryInfo: string;
    @property() _secondaryInfo: string;

    constructor() {
        super();

        document.body.style.height = document.body.clientHeight + 100 + "px";
    }

    static getConfigElement() {
        return document.createElement("polr-android-tv-remote-card-editor");
    }

    static getStubConfig() {
        return {
            entity_id: "remote.atvremote",
            apps: ["disneyplus"],
            remote: "touch",
        };
    }

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

        this._config = JSON.parse(JSON.stringify(config));
        this._primaryInfo = config["title"] || "Hello";
        this._secondaryInfo = config["subtitle"] || "More information";
    }

    set hass(hass) {
        this._hass = hass;
    }

    render() {
        var entity_id = this._config["entity_id"];
        var state = this._hass?.states[entity_id]?.state;
        if (state !== "on") {
            return html``;
        }
        return html``;
        return html`
            <div id="footer">
                <div id="play-homespeakers">${PlayCircleIcon}</div>
                <div id="info-homespeakers">
                    <div class="primary-info">KUOW</div>
                    <div class="secondary-info">Home Speakers</div>
                </div>
            </div>
        `;
    }
    static styles = css`
        :host {
        }
        svg {
            display: block;
            margin: auto;
            fill: white;
            height: 48px;
            width: 48px;
        }
        #footer {
            position: fixed;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 300px;
            z-index: 11;
            height: 80px;
            background: rgb(56, 30, 114);
            box-shadow: 0 3px 3px #121212;
            display: grid;
            grid-template-columns: min-content 2fr;
            gap: 10px;
            align-items: center;
        }
        #play-homespeakers,
        #play-tv {
            cursor: pointer;
            padding: 0 10px;
        }
        #info-tv {
            text-align: right;
        }
        .primary-info {
            font-weight: bold;
            font-size: 14px;
        }
        .secondary-info {
            font-size: 12px;
            line-height: 1em;
        }
    `;
}

customElements.define("polr-header-card", PoLRHeaderCard);
(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
    type: "polr-header-card",
    name: "PoLR Header Card",
    description: "A header card.",
});
