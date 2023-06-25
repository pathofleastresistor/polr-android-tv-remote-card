import { LitElement, html, css } from "lit";
import { property } from "lit/decorators.js";
import { ATVRemoteCardConfig, ServiceApp } from "./types";
import {
    DisneyPlusApp,
    NetflixApp,
    PrimeVideoApp,
    TvAppInterface,
    YouTubeApp,
} from "./utils/apps";
import { buttonCommands } from "./utils/buttonCommands";
import {
    BackIcon,
    CenterIcon,
    DownIcon,
    FavoriteIcon,
    HomeIcon,
    LeftIcon,
    PowerIcon,
    RightIcon,
    UpIcon,
    VolumeDownIcon,
    VolumeMuteIcon,
    VolumeUpIcon,
} from "./utils/icons";
import "./elements/dpad";
import "./elements/header";
import "./elements/remote-button";
import "./elements/touchpad";

class PoLRATVRemoteCard extends LitElement {
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
        var padlayout;
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
        return html`
            <ha-card>
                <polr-headercard icon=${PowerIcon}></polr-headercard>
                <div class="grid card-grid">
                    ${padlayout} ${this._renderApps()}
                    ${this._config.volume ? this._render_volume() : html``}
                </div>
            </ha-card>
        `;
    }

    _render_volume() {
        return html`
            <div class="grid volume-grid">
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

    _render_dpad() {
        return html` <polr-dpad
            @clickup=${() => this._press(buttonCommands.up.config)}
            @clickdown=${() => this._press(buttonCommands.down.config)}
            @clickleft=${() => this._press(buttonCommands.left.config)}
            @clickright=${() => this._press(buttonCommands.right.config)}
            @clickcenter=${() => this._press(buttonCommands.center.config)}>
        </polr-dpad>`;
    }

    _render_touchpad() {
        return html`
            <div id="touchpad-grid">
                <polr-touchpad
                    _hass=${this._hass}
                    @padaction=${this._handleTouchpadAction}></polr-touchpad>
                <div id="basicbutton-grid">
                    <polr-remotebutton icon=${HomeIcon}></polr-remotebutton>
                    <polr-remotebutton icon=${BackIcon}></polr-remotebutton>
                </div>
            </div>
        `;
    }

    _render_defaultpad() {
        return html`
            <div class="grid remote-grid">
                <polr-remotebutton
                    @click=${this._press_power}
                    icon=${PowerIcon}></polr-remotebutton>
                <polr-remotebutton
                    @click=${() => this._press(buttonCommands.up.config)}
                    icon=${UpIcon}></polr-remotebutton>
                <polr-remotebutton
                    @click=${() => this._press(buttonCommands.home.config)}
                    icon=${HomeIcon}></polr-remotebutton>
                <polr-remotebutton
                    @click=${() => this._press(buttonCommands.left.config)}
                    icon=${LeftIcon}></polr-remotebutton>
                <polr-remotebutton
                    @click=${() => this._press(buttonCommands.center.config)}
                    icon=${CenterIcon}></polr-remotebutton>
                <polr-remotebutton
                    @click=${() => this._press(buttonCommands.right.config)}
                    icon=${RightIcon}></polr-remotebutton>
                <polr-remotebutton
                    @click=${() => this._press(buttonCommands.back.config)}
                    icon=${BackIcon}></polr-remotebutton>
                <polr-remotebutton
                    @click=${() => this._press(buttonCommands.down.config)}
                    icon=${DownIcon}></polr-remotebutton>
                <polr-remotebutton
                    @click=${this._press_favorite_2}
                    icon=${FavoriteIcon}></polr-remotebutton>
            </div>
        `;
    }

    _handleTouchpadAction(ev) {
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

    _renderApps() {
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
                case "youtube":
                    app_buttons.push(this._renderApp(YouTubeApp));
                    break;
                default:
                    app_buttons.push(this._renderCustomApp(app));
            }
        }
        return html` <div class="grid app-grid">${app_buttons}</div> `;
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
    }

    _press_favorite_2() {
        console.log("favorite was pressed");
        this._callService(this._config["favorite"]);
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
        ha-card {
            overflow: hidden;
        }
        .grid {
            display: grid;
            align-items: center;
            justify-content: center;
            justify-items: center;
            margin: auto;
            gap: 10px;
            padding: 15px;
            margin: 20px 0px;
        }

        #touchpad-grid > #basicbutton-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            padding: 20px;
        }

        .card-grid {
            grid-template-columns: repeat(1, 1fr);
            border: none;
            background: none;

            padding: 0;
        }

        .remote-grid {
            grid-template-columns: repeat(3, 1fr);
        }

        .basic-grid {
            grid-template-columns: repeat(2, 1fr);
        }

        .app-grid {
            grid-template-columns: repeat(4, 1fr);
        }

        /** VOLUME **/
        .volume-grid {
            grid-template-columns: repeat(3, 1fr);
        }

        /** dpad **/
    `;
}

customElements.define("polr-android-tv-remote-card", PoLRATVRemoteCard);
(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
    type: "polr-android-tv-remote-card",
    name: "PoLR Android TV Remote Card",
    description: "Control your Android TV",
});
