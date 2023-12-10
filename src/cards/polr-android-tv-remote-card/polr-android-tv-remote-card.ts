import { LitElement, html, css } from "lit";
import { property } from "lit/decorators.js";
import {
    DisneyPlusApp,
    NetflixApp,
    PrimeVideoApp,
    TvAppInterface,
} from "./apps";
import {
    BackIcon,
    CenterIcon,
    DownIcon,
    HomeIcon,
    LeftIcon,
    RemoteIcon,
    RightIcon,
    TelevisionIcon,
    UpIcon,
    VolumeDownIcon,
    VolumeMuteIcon,
    VolumeUpIcon,
} from "../../utils/icons";
import "../elements/dpad";
import "../elements/header";
import "../elements/button";
import "../elements/touchpad";

export const buttonCommands = {
    up: { config: "up", command: "DPAD_UP" },
    down: { config: "down", command: "DPAD_DOWN" },
    left: { config: "left", command: "DPAD_LEFT" },
    right: { config: "right", command: "DPAD_RIGHT" },
    center: { config: "center", command: "DPAD_CENTER" },
    home: { config: "home", command: "HOME" },
    back: { config: "back", command: "BACK" },
    volumeup: { config: "volumeup", command: "VOLUME_UP" },
    volumedown: { config: "volumedown", command: "VOLUME_DOWN" },
    volumemute: { config: "volumemute", command: "MUTE" },
};

export interface ATVRemoteCardConfig {
    entity_id: string;
    remote: string;
    apps: Array<App> | [];
    volume: boolean;
}

export interface App {}

export interface CustomApp extends App {
    icon: string;
    url: string;
}

export interface ServiceApp extends App {
    service: string;
    data: {};
}

export class PoLRATVRemoteCard extends LitElement {
    @property() _config: any;
    @property() _hass: any;

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

    setConfig(config: ATVRemoteCardConfig) {
        if (!config.entity_id) {
            throw new Error("entity_id must be specified");
        }

        this._config = structuredClone(config);

        if (!this._config.hasOwnProperty("volume")) {
            this._config.volume = true;
        }

        if (!this._config.hasOwnProperty("remote")) {
            this._config.remote = "default";
        }
    }

    set hass(hass) {
        this._hass = hass;
    }

    render() {
        var entity_id = this._config["entity_id"];
        var state = this._hass?.states[entity_id]?.state;

        return html`
            <ha-card>
                <polr-headercard
                    icon=${TelevisionIcon}
                    _hass=${this._hass}
                    entity_id=${entity_id}
                    primaryInfo=${this._hass["states"][entity_id]["attributes"][
                        "friendly_name"
                    ]}
                    additionalIcon=${RemoteIcon}
                    @additionalclick=${this._changeRemote}
                    @headericonclick=${this._press_power}
                    toggleIcon="true">
                </polr-headercard>
                <div id="main-grid">
                    ${state === "on" ? this._renderPad() : ""}
                    ${state === "on" ? this._renderBasicGrid() : ""}
                    ${this._renderApps()}
                    ${state === "on" ? this._renderVolume() : ""}
                </div>
            </ha-card>
        `;
    }

    private _renderPad() {
        switch (this._config?.remote) {
            case "default":
                return this._renderDefaultpad();
            case "touch":
                return this._renderTouchpad();
            case "dpad":
                return this._renderDpad();
        }
    }

    private _renderDpad() {
        return html`
            <polr-dpad
                id="dpad-grid"
                @clickup=${() => this._press(buttonCommands.up.config)}
                @clickdown=${() => this._press(buttonCommands.down.config)}
                @clickleft=${() => this._press(buttonCommands.left.config)}
                @clickright=${() => this._press(buttonCommands.right.config)}
                @clickcenter=${() => this._press(buttonCommands.center.config)}>
            </polr-dpad>
        `;
    }

    private _renderTouchpad() {
        return html`
            <polr-touchpad
                _hass=${this._hass}
                @touchup=${() => this._press(buttonCommands.up.config)}
                @touchdown=${() => this._press(buttonCommands.down.config)}
                @touchleft=${() => this._press(buttonCommands.left.config)}
                @touchright=${() => this._press(buttonCommands.right.config)}
                @touchtap=${() =>
                    this._press(buttonCommands.center.config)}></polr-touchpad>
        `;
    }

    private _renderDefaultpad() {
        return html`
            <div id="defaultpad-grid">
                <div></div>
                <polr-button
                    @click=${() => this._press(buttonCommands.up.config)}
                    icon=${UpIcon}></polr-button>
                <div></div>
                <polr-button
                    @click=${() => this._press(buttonCommands.left.config)}
                    icon=${LeftIcon}></polr-button>
                <polr-button
                    @click=${() => this._press(buttonCommands.center.config)}
                    icon=${CenterIcon}></polr-button>
                <polr-button
                    @click=${() => this._press(buttonCommands.right.config)}
                    icon=${RightIcon}></polr-button>
                <div></div>
                <polr-button
                    @click=${() => this._press(buttonCommands.down.config)}
                    icon=${DownIcon}></polr-button>
                <div></div>
            </div>
        `;
    }

    private _changeRemote() {
        switch (this._config.remote) {
            case "default":
                this._config.remote = "dpad";
                break;
            case "dpad":
                this._config.remote = "touch";
                break;
            case "touch":
                this._config.remote = "default";
                break;
            default:
                break;
        }
        this.requestUpdate();
    }

    private _renderBasicGrid() {
        return html` <div id="basicbutton-grid">
            <polr-button
                @click=${() => this._press(buttonCommands.home.config)}
                icon=${HomeIcon}></polr-button>
            <polr-button
                @click=${() => this._press(buttonCommands.back.config)}
                icon=${BackIcon}></polr-button>
        </div>`;
    }

    private _renderApps() {
        if (!this._config.apps) {
            return html``;
        }

        let app_buttons = [];
        for (const app of this._config?.apps) {
            switch (app) {
                case "disneyplus":
                    app_buttons.push(
                        html`
                            <polr-button
                                @click=${{
                                    handleEvent: () =>
                                        this._turn_on(DisneyPlusApp.url),
                                }}
                                icon=${DisneyPlusApp.icon}>
                            </polr-button>
                        `
                    );
                    break;
                case "netflix":
                    app_buttons.push(
                        html`
                            <polr-button
                                @click=${{
                                    handleEvent: () =>
                                        this._turn_on(NetflixApp.url),
                                }}
                                icon=${NetflixApp.icon}>
                            </polr-button>
                        `
                    );
                    break;
                case "prime":
                    app_buttons.push(
                        html`
                            <polr-button
                                @click=${{
                                    handleEvent: () =>
                                        this._turn_on(PrimeVideoApp.url),
                                }}
                                icon=${PrimeVideoApp.icon}>
                            </polr-button>
                        `
                    );
                    break;
                default:
                    app_buttons.push(
                        html`
                            <polr-button
                                @click=${{
                                    handleEvent: () => this._press_custom(app),
                                }}>
                                <ha-icon icon="${app.icon}"></ha-icon>
                            </polr-button>
                        `
                    );
            }
        }
        return html`<div id="app-grid">${app_buttons}</div>`;
    }

    private _renderVolume() {
        return html`
            <div id="volume-grid">
                <polr-button
                    @click=${() =>
                        this._press(buttonCommands.volumedown.config)}
                    icon=${VolumeDownIcon}></polr-button>
                <polr-button
                    @click=${() =>
                        this._press(buttonCommands.volumemute.config)}
                    icon=${VolumeMuteIcon}></polr-button>
                <polr-button
                    @click=${() => this._press(buttonCommands.volumeup.config)}
                    icon=${VolumeUpIcon}></polr-button>
            </div>
        `;
    }

    private _turn_on(action: string) {
        this._hass.callService("remote", "turn_on", {
            entity_id: this._config.entity_id,
            activity: action,
        });
    }

    private _press(command: string) {
        if (!buttonCommands.hasOwnProperty(command)) {
            return;
        }

        if (this._config[command]) {
            this._callService(this._config[command]);
            return;
        }

        this._hass.callService("remote", "send_command", {
            entity_id: this._config.entity_id,
            command: buttonCommands[command].command,
        });
    }

    private _press_power() {
        if (this._config["power"]) {
            this._callService(this._config["power"]);
        }
        this._hass.callService("remote", "toggle", {
            entity_id: this._config.entity_id,
        });
    }

    private _press_custom(app) {
        if (app.hasOwnProperty("service")) {
            this._callService(app);
        } else {
            this._turn_on(app.url);
        }
    }

    private _callService(s: ServiceApp) {
        let vals: any;
        vals = s.service.split(".");
        this._hass.callService(vals[0], vals[1], s.data);
    }

    static styles = css`
        :host {
            --polr-fox-color-primary: #ffffff;
            --polr-fox-color-background: #00000000;
            --mdc-icon-size: 21px;
            --polr-fox-primary-font-size: 14px;
            --polr-fox-card-height: 44px;
            --polr-fox-primary-icon-size: 21px;
            --polr-fox-remote-icon-width: 100%;
            --polr-fox-remote-icon-height: 40px;
            --polr-fox-remote-icon-size: 21px;
            --polr-fox-remote-button-background: rgba(111, 111, 111, 0.2);
            --polr-fox-remote-button-fill: rgb(255, 255, 255);
        }
        ha-card {
            overflow: hidden;
        }
        #main-grid {
            margin: auto;
            padding: 0 12px 12px 12px;
            display: grid;
            gap: 12px;
        }
        #defaultpad-grid {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 12px;
        }
        #basicbutton-grid,
        #app-grid,
        #volume-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(50px, 1fr));
            gap: 12px;
            width: 100%;
            margin: auto;
        }
    `;
}

class PoLRATVRemoteCardEditor extends LitElement {
    @property() _config: any;
    @property() _hass: any;

    static get properties() {
        return {
            hass: {},
            _config: {},
        };
    }

    setConfig(config) {
        this._config = config;
    }

    set hass(hass) {
        this._hass = hass;
    }

    _valueChanged(ev) {
        if (!this._config || !this._hass) {
            return;
        }
        const _config = Object.assign({}, this._config);
        _config.entity_id = ev.detail.value.entity_id;
        _config.remote = ev.detail.value.remote;
        _config.apps = ev.detail.value.apps;

        this._config = _config;

        const event = new CustomEvent("config-changed", {
            detail: { config: _config },
            bubbles: true,
            composed: true,
        });
        this.dispatchEvent(event);
    }

    render() {
        if (!this._hass || !this._config) {
            return html``;
        }
        return html`
            <ha-form
                .hass=${this._hass}
                .data=${this._config}
                .schema=${[
                    {
                        name: "entity_id",
                        selector: {
                            entity: {
                                filter: [
                                    {
                                        integration: "androidtv_remote",
                                        domain: "remote",
                                    },
                                ],
                            },
                        },
                    },
                    {
                        name: "remote",
                        selector: {
                            select: {
                                mode: "dropdown",
                                options: [
                                    { label: "Basic", value: "default" },
                                    { label: "Touch", value: "touch" },
                                    { label: "DPad", value: "dpad" },
                                ],
                            },
                        },
                    },
                    {
                        name: "apps",
                        selector: {
                            select: {
                                mode: "dropdown",
                                multiple: true,
                                options: [
                                    { label: "Disney+", value: "disneyplus" },
                                    { label: "Netflix", value: "netflix" },
                                    { label: "Amazon Prime", value: "prime" },
                                ],
                            },
                        },
                    },
                ]}
                .computeLabel=${this._computeLabel}
                @value-changed=${this._valueChanged}></ha-form>
        `;
    }

    _computeLabel(schema) {
        var labelMap = {
            entity_id: "Entity",
            remote: "Remote Style",
            apps: "Apps",
        };
        return labelMap[schema.name];
    }
}

customElements.define(
    "polr-android-tv-remote-card-editor",
    PoLRATVRemoteCardEditor
);
customElements.define("polr-android-tv-remote-card", PoLRATVRemoteCard);
(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
    type: "polr-android-tv-remote-card",
    name: "PoLR Android TV Remote Card",
    description: "Control your Android TV",
});
