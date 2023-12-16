import { LitElement, html, css } from "lit";
import { property } from "lit/decorators.js";
import {
    BackIcon,
    CenterIcon,
    DisneyPlusIcon,
    DownIcon,
    HomeIcon,
    LeftIcon,
    NetflixIcon,
    PrimeVideoIcon,
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
    play: { config: "play", command: "MEDIA_PLAY" },
    pause: { config: "pause", command: "MEDIA_PAUSE" },
    stop: { config: "stop", command: "MEDIA_STOP" },
    play_pause: { config: "play_pause", command: "MEDIA_PLAY_PAUSE" },
    fast_forward: { config: "fast_forward", command: "MEDIA_FAST_FORWARD" },
    rewind: { config: "rewind", command: "MEDIA_REWIND" },
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

        this._config.remote = this._config.remote || "default";

        !this._config.hasOwnProperty("showRemote")
            ? (this._config.showRemote = true)
            : "";
        !this._config.hasOwnProperty("showVolume")
            ? (this._config.showVolume = true)
            : "";
        !this._config.hasOwnProperty("showBasic")
            ? (this._config.showBasic = true)
            : "";
        !this._config.hasOwnProperty("showApps")
            ? (this._config.showApps = true)
            : "";
        !this._config.hasOwnProperty("showMedia")
            ? (this._config.showMedia = false)
            : "";
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
                    actionIcon=${RemoteIcon}
                    _hass=${this._hass}
                    entity_id=${entity_id}
                    primaryInfo=${this._hass["states"][entity_id]["attributes"][
                        "friendly_name"
                    ]}
                    @additionalclick=${this._changeRemote}
                    @headericonclick=${this._press_power}>
                </polr-headercard>
                <div id="main-grid">
                    ${state === "on" && this._config.showRemote
                        ? this._renderPad()
                        : ""}
                    ${state === "on" && this._config.showBasic
                        ? this._renderBasicGrid()
                        : ""}
                    ${this._config.showApps ? this._renderApps() : ""}
                    ${state === "on" && this._config.showVolume
                        ? this._renderVolume()
                        : ""}
                    ${state === "on" && this._config.showMedia
                        ? this._renderMedia()
                        : ""}
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
        return html` <div class="grid">
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
                                        this._turn_on(
                                            "https://www.disneyplus.com"
                                        ),
                                }}
                                icon=${DisneyPlusIcon}></polr-button>
                        `
                    );
                    break;
                case "netflix":
                    app_buttons.push(
                        html`
                            <polr-button
                                @click=${{
                                    handleEvent: () =>
                                        this._turn_on(
                                            "https://www.netflix.com/title"
                                        ),
                                }}
                                icon=${NetflixIcon}></polr-button>
                        `
                    );
                    break;
                case "prime":
                    app_buttons.push(
                        html`
                            <polr-button
                                @click=${{
                                    handleEvent: () =>
                                        this._turn_on(
                                            "https://app.primevideo.com"
                                        ),
                                }}
                                icon=${PrimeVideoIcon}></polr-button>
                        `
                    );
                    break;
                default:
                    app_buttons.push(
                        html`
                            <polr-button
                                @click=${() => this._press_custom(app)}>
                                <ha-icon icon="${app.icon}"></ha-icon>
                            </polr-button>
                        `
                    );
            }
        }
        return html`<div class="grid">${app_buttons}</div>`;
    }

    private _renderVolume() {
        return html`
            <div class="grid">
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

    private _renderMedia() {
        if (!this._config.media_controls) {
            return html``;
        }

        let buttons = [];
        for (const item of this._config?.media_controls) {
            switch (item) {
                case "rewind":
                    buttons.push(
                        html`
                            <polr-button
                                @click=${() =>
                                    this._press(buttonCommands.rewind.config)}
                                ><ha-icon icon="mdi:rewind"></ha-icon
                            ></polr-button>
                        `
                    );
                    break;
                case "play_pause":
                    buttons.push(
                        html`
                            <polr-button
                                @click=${() =>
                                    this._press(
                                        buttonCommands.play_pause.config
                                    )}
                                ><ha-icon icon="mdi:play-pause"></ha-icon
                            ></polr-button>
                        `
                    );
                    break;
                case "fast_forward":
                    buttons.push(
                        html`
                            <polr-button
                                @click=${() =>
                                    this._press(
                                        buttonCommands.fast_forward.config
                                    )}
                                ><ha-icon icon="mdi:fast-forward"></ha-icon
                            ></polr-button>
                        `
                    );
                    break;
                case "play":
                    buttons.push(
                        html`
                            <polr-button
                                @click=${() =>
                                    this._press(buttonCommands.play.config)}
                                ><ha-icon icon="mdi:play"></ha-icon
                            ></polr-button>
                        `
                    );
                    break;
                case "stop":
                    buttons.push(
                        html`
                            <polr-button
                                @click=${() =>
                                    this._press(buttonCommands.stop.config)}
                                ><ha-icon icon="mdi:stop"></ha-icon
                            ></polr-button>
                        `
                    );
                    break;
            }
        }
        return html`<div class="grid">${buttons}</div>`;
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
        .grid {
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
        _config.media_controls = ev.detail.value.media_controls;

        _config.showRemote = ev.detail.value.showRemote;
        _config.showBasic = ev.detail.value.showBasic;
        _config.showApps = ev.detail.value.showApps;
        _config.showVolume = ev.detail.value.showVolume;
        _config.showMedia = ev.detail.value.showMedia;

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

        var schema = [
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
                name: "showRemote",
                selector: {
                    boolean: {},
                },
            },
            ...(this._config.showRemote
                ? [
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
                  ]
                : []),
            {
                name: "showBasic",
                selector: {
                    boolean: {},
                },
            },
            {
                name: "showApps",
                selector: {
                    boolean: {},
                },
            },
            ...(this._config.showApps
                ? [
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
                  ]
                : []),
            {
                name: "showVolume",
                selector: {
                    boolean: {},
                },
            },
            {
                name: "showMedia",
                selector: {
                    boolean: {},
                },
            },
            ...(this._config.showMedia
                ? [
                      {
                          name: "media_controls",
                          selector: {
                              select: {
                                  mode: "dropdown",
                                  multiple: true,
                                  options: [
                                      { label: "Play", value: "play" },
                                      {
                                          label: "Play Pause",
                                          value: "play_pause",
                                      },
                                      { label: "Stop", value: "stop" },
                                      { label: "Rewind", value: "rewind" },
                                      {
                                          label: "Fast Forward",
                                          value: "fast_forward",
                                      },
                                  ],
                              },
                          },
                      },
                  ]
                : []),
        ];

        return html`
            <ha-form
                .hass=${this._hass}
                .data=${this._config}
                .schema=${schema}
                .computeLabel=${this._computeLabel}
                @value-changed=${this._valueChanged}></ha-form>
        `;
    }

    _computeLabel(schema) {
        var labelMap = {
            entity_id: "Entity",
            remote: "Remote Style",
            apps: "Apps",
            media_controls: "Media Controls",
            showRemote: "Show navigation",
            showBasic: "Show home/back buttons",
            showApps: "Show apps",
            showVolume: "Show volume",
            showMedia: "Show media",
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
