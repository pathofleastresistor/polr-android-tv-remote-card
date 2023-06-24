import { LitElement, html, css } from "lit";
import { property } from "lit/decorators.js";
import { ATVRemoteCardConfig, CustomApp, ServiceApp } from "./types";
import {
    DisneyPlusApp,
    HuluApp,
    NetflixApp,
    PrimeVideoApp,
    TvAppInterface,
    YouTubeApp,
} from "./utils/apps";
import {
    BackIcon,
    CenterIcon,
    DisneyPlusIcon,
    DownIcon,
    FavoriteIcon,
    HBOMaxIcon,
    HomeIcon,
    HuluIcon,
    LeftIcon,
    NetflixIcon,
    PowerIcon,
    PrimeVideoIcon,
    RightIcon,
    UpIcon,
    VolumeDownIcon,
    VolumeMuteIcon,
    VolumeUpIcon,
    YouTubeIcon,
} from "./utils/icons";
import "./elements/dpad";
import "./elements/header";
import "./elements/remote-button";
import "./elements/touchpad";

class PoLRATVRemoteCard extends LitElement {
    @property() _config: any;
    @property() _hass: any;
    active: any = false;
    currentX: any = 0;
    currentY: any = 0;
    initialX: any = 0;
    initialY: any = 0;
    _touchpad: any;
    _dragItem: any;

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
                    ${padlayout} ${this._render_apps()}
                    ${this._config.volume ? this._render_volume() : html``}
                </div>
            </ha-card>
        `;
    }

    _render_volume() {
        return html`
            <div class="grid volume-grid">
                <polr-remotebutton
                    @click=${this._press_volume_down}
                    icon=${VolumeDownIcon}></polr-remotebutton>
                <polr-remotebutton
                    @click=${this._press_volume_mute}
                    icon=${VolumeMuteIcon}></polr-remotebutton>
                <polr-remotebutton
                    @click=${this._press_volume_up}
                    icon=${VolumeUpIcon}></polr-remotebutton>
            </div>
        `;
    }

    /** REMOTE LAYOUTS **/
    _render_dpad() {
        return html` <polr-dpad
            @clickup=${this._press_up}
            @clickdown=${this._press_down}
            @clickleft=${this._press_left}
            @clickright=${this._press_right}
            @clickcenter=${this._press_center}>
        </polr-dpad>`;
    }

    _render_touchpad() {
        return html`
            <div id="touchpad-grid">
                <polr-touchpad
                    _hass=${this._hass}
                    @padaction=${this._handleAction}></polr-touchpad>
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
                    @click=${this._press_up}
                    icon=${UpIcon}></polr-remotebutton>
                <polr-remotebutton
                    @click=${this._press_home}
                    icon=${HomeIcon}></polr-remotebutton>
                <polr-remotebutton
                    @click=${this._press_left}
                    icon=${LeftIcon}></polr-remotebutton>
                <polr-remotebutton
                    @click=${this._press_center}
                    icon=${CenterIcon}></polr-remotebutton>
                <polr-remotebutton
                    @click=${this._press_right}
                    icon=${RightIcon}></polr-remotebutton>
                <polr-remotebutton
                    @click=${this._press_back}
                    icon=${BackIcon}></polr-remotebutton>
                <polr-remotebutton
                    @click=${this._press_down}
                    icon=${DownIcon}></polr-remotebutton>
                <polr-remotebutton
                    @click=${this._press_favorite_2}
                    icon=${FavoriteIcon}></polr-remotebutton>
            </div>
        `;
    }

    _handleAction(ev) {
        switch (ev.detail?.action) {
            case "swipeup":
                this._press_up();
                break;
            case "swipedown":
                this._press_down();
                break;
            case "swipeleft":
                this._press_left();
                break;
            case "swiperight":
                this._press_right();
                break;
            case "tap":
                this._press_center();
                break;
            default:
                break;
        }
    }

    /** APP LAYOUTS **/
    _render_apps() {
        if (!this._config.apps) {
            return html``;
        }

        let app_buttons = [];

        for (const app of this._config?.apps) {
            switch (app) {
                case "disneyplus":
                    app_buttons.push(this._renderapp(DisneyPlusApp));
                    break;
                case "netflix":
                    app_buttons.push(this._renderapp(NetflixApp));
                    break;
                case "prime":
                    app_buttons.push(this._renderapp(PrimeVideoApp));
                    break;
                case "youtube":
                    app_buttons.push(this._renderapp(YouTubeApp));
                    break;
                default:
                    app_buttons.push(this._rendercustomapp(app));
            }
        }
        return html` <div class="grid app-grid">${app_buttons}</div> `;
    }

    _renderapp(app: TvAppInterface) {
        return html`
            <polr-remotebutton
                @click=${{ handleEvent: () => this._turn_on(app.url) }}
                icon=${app.icon}>
            </polr-remotebutton>
        `;
    }

    _rendercustomapp(app: CustomApp) {
        return html`
            <polr-remotebutton
                @click=${{ handleEvent: () => this._press_custom(app) }}>
                <ha-icon icon="${app.icon}"></ha-icon>
            </polr-remotebutton>
        `;
    }

    _send_command(action: string) {
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

    _press_power() {
        if (this._config["power"]) {
            this._callService(this._config["power"]);
        }
    }

    _press_up() {
        if (this._config["up"]) {
            this._callService(this._config["up"]);
        } else {
            this._send_command("DPAD_UP");
        }
    }

    _press_left() {
        if (this._config["left"]) {
            this._callService(this._config["left"]);
        } else {
            this._send_command("DPAD_LEFT");
        }
    }

    _press_right() {
        if (this._config["right"]) {
            this._callService(this._config["right"]);
        } else {
            this._send_command("DPAD_RIGHT");
        }
    }

    _press_down() {
        if (this._config["down"]) {
            this._callService(this._config["down"]);
        } else {
            this._send_command("DPAD_DOWN");
        }
    }

    _press_center() {
        if (this._config["center"]) {
            this._callService(this._config["center"]);
        } else {
            this._send_command("DPAD_CENTER");
        }
    }

    _press_home() {
        if (this._config["home"]) {
            this._callService(this._config["home"]);
        } else {
            this._send_command("HOME");
        }
    }

    _press_back() {
        if (this._config["back"]) {
            this._callService(this._config["back"]);
        } else {
            this._send_command("BACK");
        }
    }

    _press_volume_up() {
        if (this._config["volumeup"]) {
            this._callService(this._config["volumeup"]);
        } else {
            this._send_command("VOLUME_UP");
        }
    }

    _press_volume_mute() {
        if (this._config["volumemute"]) {
            this._callService(this._config["volumemute"]);
        } else {
            this._send_command("MUTE");
        }
    }

    _press_volume_down() {
        if (this._config["volumedown"]) {
            this._callService(this._config["volumedown"]);
        } else {
            this._send_command("VOLUME_DOWN");
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
