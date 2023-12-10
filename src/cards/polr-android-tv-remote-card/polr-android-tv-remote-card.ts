import { LitElement, html, css } from "lit";
import { property } from "lit/decorators.js";
import { ATVRemoteCardConfig, ServiceApp } from "./types";
import {
    DisneyPlusApp,
    NetflixApp,
    PrimeVideoApp,
    TvAppInterface,
} from "./apps";
import { buttonCommands } from "./buttonCommands";
import {
    BackIcon,
    CenterIcon,
    DownIcon,
    FavoriteIcon,
    HomeIcon,
    LeftIcon,
    PowerIcon,
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
import "../elements/remote-button";
import "../elements/touchpad";

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

        this._config = JSON.parse(JSON.stringify(config));

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
        var padlayout;
        var applayout;
        var volumelayout;

        var layout = [];
        layout.push(html`
            <polr-headercard
                icon=${TelevisionIcon}
                _hass=${this._hass}
                entity_id=${entity_id}
                primaryInfo=${this._hass["states"][entity_id]["attributes"][
                    "friendly_name"
                ]}
                additionalIcon=${RemoteIcon}
                @additionalclick=${this._change_remote}
                @headericonclick=${this._press_power}
                toggleIcon="true">
            </polr-headercard>
        `);

        if (state === "on") {
            padlayout = this._choosePad(padlayout);
            applayout = this._chooseApps();
            volumelayout = this._config.volume ? this._chooseVolume() : html``;
            layout.push(html`
                <div id="main-grid">
                    ${padlayout} ${applayout} ${volumelayout}
                </div>
            `);
        } else {
            applayout = this._chooseApps();
            layout.push(html`
                <div id="main-grid">
                    ${padlayout} ${applayout} ${volumelayout}
                </div>
            `);
        }
        var entity_id = this._config["entity_id"];

        return html` <ha-card>${layout} </ha-card> `;
    }

    private _choosePad(padlayout: any) {
        switch (this._config?.remote) {
            case "default":
                padlayout = this._render_defaultpad();
                break;
            case "touch":
                padlayout = this._render_touchpad();
                break;
            case "dpad":
                padlayout = this._render_dpad();
                break;
            default:
                break;
        }
        return padlayout;
    }

    private _chooseVolume() {
        return html`
            <div id="volume-grid">
                <polr-remotebutton
                    @click=${() =>
                        this._press(buttonCommands.volumedown.config)}
                    icon=${VolumeDownIcon}></polr-remotebutton>
                <polr-remotebutton
                    @click=${() =>
                        this._press(buttonCommands.volumemute.config)}
                    icon=${VolumeMuteIcon}></polr-remotebutton>
                <polr-remotebutton
                    @click=${() => this._press(buttonCommands.volumeup.config)}
                    icon=${VolumeUpIcon}></polr-remotebutton>
            </div>
        `;
    }

    private _render_dpad() {
        return html`
            <polr-dpad
                id="dpad-grid"
                @clickup=${() => this._press(buttonCommands.up.config)}
                @clickdown=${() => this._press(buttonCommands.down.config)}
                @clickleft=${() => this._press(buttonCommands.left.config)}
                @clickright=${() => this._press(buttonCommands.right.config)}
                @clickcenter=${() => this._press(buttonCommands.center.config)}>
            </polr-dpad>
            <div id="basicbutton-grid">
                <polr-remotebutton
                    @click=${() => this._press(buttonCommands.home.config)}
                    icon=${HomeIcon}></polr-remotebutton>
                <polr-remotebutton
                    @click=${() => this._press(buttonCommands.back.config)}
                    icon=${BackIcon}></polr-remotebutton>
            </div>
        `;
    }

    private _render_touchpad() {
        return html`
            <polr-touchpad
                _hass=${this._hass}
                @padaction=${this._handleTouchpadAction}></polr-touchpad>
            <div id="basicbutton-grid">
                <polr-remotebutton
                    @click=${() => this._press(buttonCommands.home.config)}
                    icon=${HomeIcon}></polr-remotebutton>
                <polr-remotebutton
                    @click=${() => this._press(buttonCommands.back.config)}
                    icon=${BackIcon}></polr-remotebutton>
            </div>
        `;
    }

    private _render_defaultpad() {
        return html`
            <div id="defaultpad-grid">
                <div></div>
                <polr-remotebutton
                    @click=${() => this._press(buttonCommands.up.config)}
                    icon=${UpIcon}></polr-remotebutton>
                <div></div>
                <polr-remotebutton
                    @click=${() => this._press(buttonCommands.left.config)}
                    icon=${LeftIcon}></polr-remotebutton>
                <polr-remotebutton
                    @click=${() => this._press(buttonCommands.center.config)}
                    icon=${CenterIcon}></polr-remotebutton>
                <polr-remotebutton
                    @click=${() => this._press(buttonCommands.right.config)}
                    icon=${RightIcon}></polr-remotebutton>
                <div></div>
                <polr-remotebutton
                    @click=${() => this._press(buttonCommands.down.config)}
                    icon=${DownIcon}></polr-remotebutton>
                <div></div>
            </div>
            <div id="basicbutton-grid">
                <polr-remotebutton
                    @click=${() => this._press(buttonCommands.home.config)}
                    icon=${HomeIcon}></polr-remotebutton>
                <polr-remotebutton
                    @click=${() => this._press(buttonCommands.back.config)}
                    icon=${BackIcon}></polr-remotebutton>
            </div>
        `;
    }

    private _handleTouchpadAction(ev) {
        switch (ev.detail?.action) {
            case "swipeup":
                this._press(buttonCommands.up.config);
                break;
            case "swipedown":
                this._press(buttonCommands.down.config);
                break;
            case "swipeleft":
                this._press(buttonCommands.left.config);
                break;
            case "swiperight":
                this._press(buttonCommands.right.config);
                break;
            case "tap":
                this._press(buttonCommands.center.config);
                break;
            default:
                break;
        }
    }

    _chooseApps() {
        if (!this._config.apps) {
            return html``;
        }

        let app_buttons = [];
        for (const app of this._config?.apps) {
            switch (app) {
                case "disneyplus":
                    app_buttons.push(this._renderApp(DisneyPlusApp));
                    break;
                case "netflix":
                    app_buttons.push(this._renderApp(NetflixApp));
                    break;
                case "prime":
                    app_buttons.push(this._renderApp(PrimeVideoApp));
                    break;
                default:
                    app_buttons.push(this._renderCustomApp(app));
            }
        }
        return html`<div id="app-grid">${app_buttons}</div>`;
    }

    _renderApp(app: TvAppInterface) {
        return html`
            <polr-remotebutton
                @click=${{ handleEvent: () => this._turn_on(app.url) }}
                icon=${app.icon}>
            </polr-remotebutton>
        `;
    }

    _renderCustomApp(app: TvAppInterface) {
        return html`
            <polr-remotebutton
                @click=${{ handleEvent: () => this._press_custom(app) }}>
                <ha-icon icon="${app.icon}"></ha-icon>
            </polr-remotebutton>
        `;
    }

    _sendCommand(action: string) {
        this._hass.callService("remote", "send_command", {
            entity_id: this._config.entity_id,
            command: action,
        });
        console.log(`${action} was called`);
    }

    _turn_on(action: string) {
        this._hass.callService("remote", "turn_on", {
            entity_id: this._config.entity_id,
            activity: action,
        });
        console.log(`${action} was called`);
    }

    _press(command: string) {
        if (!buttonCommands.hasOwnProperty(command)) {
            return;
        }

        if (this._config[command]) {
            this._callService(this._config[command]);
            return;
        }

        this._sendCommand(buttonCommands[command].command);
    }

    _press_power() {
        if (this._config["power"]) {
            this._callService(this._config["power"]);
        }
        this._hass.callService("remote", "toggle", {
            entity_id: this._config.entity_id,
        });
        console.log(`Power was called`);
    }

    _press_favorite_2() {
        console.log("favorite was pressed");
        this._callService(this._config["favorite"]);
    }

    _change_remote() {
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

    _press_custom(app) {
        console.log(app);
        if (app.hasOwnProperty("service")) {
            this._callService(app);
        } else {
            this._turn_on(app.url);
        }
    }

    _callService(s: ServiceApp) {
        let vals: any;
        vals = s.service.split(".");
        console.log(s, vals);
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
        polr-remotebutton {
        }
        polr-touchpad {
            height: 150px;
            display: block;
        }
        #main-grid {
            margin: auto;
            padding: 0 12px 12px 12px;
            display: grid;
            gap: 12px;
        }
        #touchpad-grid {
            display: grid;
            grid-template-columns: 1fr;
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

customElements.define("polr-android-tv-remote-card", PoLRATVRemoteCard);
(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
    type: "polr-android-tv-remote-card",
    name: "PoLR Android TV Remote Card",
    description: "Control your Android TV",
});
