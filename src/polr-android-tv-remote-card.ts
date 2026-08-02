/**
 * polr-android-tv-remote-card
 *
 * A remote for the Android TV Remote integration that also *reads* the TV:
 * v1 only ever wrote, so it could not tell you whether the set was on, what was
 * playing, or whether it was muted.
 */

import { LitElement, html, nothing, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";

import {
  FEATURE,
  can,
  hasVolumeState,
  pressButton,
  readDevice,
  runAppAction,
  sendText,
  type DeviceState,
} from "./atv";
import {
  normalizeConfig,
  type AppConfig,
  type ButtonId,
  type BrandId,
  type PolrAtvRemoteCardConfig,
  type ResolvedConfig,
} from "./config";
import { BRAND_LOGOS, brandFor } from "./icons";
import { isActionable, runAction, type ActionConfig } from "./actions";
import { press, type PressOptions } from "./press";
import { remoteStyles } from "./styles";
import { tileStyles } from "./kit/styles";
import { showMoreInfo, stateColor, type HomeAssistant } from "./kit/types";

import "./nav-pad";
import "./polr-android-tv-remote-card-editor";

export const CARD_VERSION = "2.0.0-beta.1";

const CARD_TYPE = "polr-android-tv-remote-card";

@customElement(CARD_TYPE)
export class PolrAndroidTvRemoteCard extends LitElement {
  static override styles = [tileStyles, remoteStyles];

  @property({ attribute: false }) public hass?: HomeAssistant;

  @state() private _config?: ResolvedConfig;
  @state() private _text = "";
  @state() private _sending = false;

  public static getConfigElement(): HTMLElement {
    return document.createElement(`${CARD_TYPE}-editor`);
  }

  /**
   * Pick a real remote off the user's system.
   *
   * v1 used the old zero-argument signature and hardcoded `remote.atvremote`,
   * so adding the card from the picker produced a card pointing at an entity
   * that almost certainly did not exist.
   */
  public static getStubConfig(hass?: HomeAssistant): Partial<PolrAtvRemoteCardConfig> {
    const entity =
      Object.keys(hass?.states ?? {}).find((id) => id.startsWith("remote.")) ??
      "remote.android_tv";
    return { entity, pad: "buttons" };
  }

  public setConfig(config: PolrAtvRemoteCardConfig): void {
    this._config = normalizeConfig(config);
  }

  public getCardSize(): number {
    const config = this._config;
    if (!config) return 6;
    let size = config.show_header ? 2 : 0;
    if (config.show_nav) size += config.pad === "buttons" ? 5 : 6;
    size += 1; // back / home / menu
    if (config.show_transport) size += 1;
    if (config.show_volume) size += 1;
    if (config.show_text_input) size += 1;
    if (config.show_apps && config.apps.length) size += 2;
    return Math.max(size, 3);
  }

  /**
   * Sections view sizing.
   *
   * `rows: "auto"` rather than a count, because this card's height genuinely
   * depends on its width: the touchpad and the button pad are sized by
   * aspect-ratio, so any fixed number of rows is wrong at every width but one.
   * Reporting a count over-allocated the grid slot and left a band of empty
   * space under the card. HA's own graph card does the same thing.
   *
   * min_rows still applies if a user turns auto height off in the layout editor.
   */
  public getGridOptions(): Record<string, number | string> {
    return {
      columns: 12,
      min_columns: 6,
      rows: "auto",
      min_rows: this._config?.show_nav ? 6 : 2,
    };
  }

  private get _device(): DeviceState | undefined {
    if (!this.hass || !this._config) return undefined;
    return readDevice(this.hass, this._config);
  }

  private _press(button: ButtonId): void {
    const device = this._device;
    if (!this.hass || !this._config || !device) return;
    void pressButton(this.hass, this._config, device, button, this);
  }

  /**
   * Press options for a button, folding in any configured interactions.
   *
   * Hold and double-tap handlers are wired only when configured: a double-tap
   * handler forces every tap to wait out the double-tap window, and a hold
   * handler replaces hold-to-repeat, so neither should exist by default.
   */
  private _pressOptions(
    button: ButtonId,
    options: { repeat?: boolean } = {},
  ): PressOptions {
    const config = this._config!;
    const actions = config.overrides[button];
    const hold = actions?.hold_action;
    const doubleTap = actions?.double_tap_action;

    const run = (action: ActionConfig) => () => {
      if (this.hass) void runAction(this, this.hass, action, config.entity);
    };

    return {
      onPress: () => this._press(button),
      ...(isActionable(hold) ? { onHold: run(hold as ActionConfig) } : {}),
      ...(isActionable(doubleTap) ? { onDoubleTap: run(doubleTap as ActionConfig) } : {}),
      repeat: options.repeat && config.hold_repeat,
      haptics: config.haptics,
    };
  }

  private _navigate(event: CustomEvent<{ direction: string }>): void {
    this._press(event.detail.direction as ButtonId);
  }

  private _launch(app: AppConfig): void {
    const device = this._device;
    if (!this.hass || !device) return;
    void runAppAction(this.hass, device, app.action).catch((error: Error) => {
      // eslint-disable-next-line no-console
      console.error(error);
    });
  }

  private async _sendText(): Promise<void> {
    const device = this._device;
    const text = this._text.trim();
    if (!this.hass || !device || !text) return;
    this._sending = true;
    try {
      await sendText(this.hass, device, text);
      this._text = "";
    } finally {
      this._sending = false;
    }
  }

  /* ------------------------------------------------------------- header -- */

  private _renderHeader(device: DeviceState): TemplateResult {
    const config = this._config!;
    const secondary = device.available
      ? device.on
        ? [device.appName, device.mediaTitle].filter(Boolean).join(" · ") || "On"
        : "Off"
      : "Unavailable";

    // A brand logo is instantly readable at 24px; mdi:television-play is not.
    const brand = device.on && device.available ? brandFor(device.appName) : undefined;

    return html`
      <div class="tile">
        ${device.picture
          ? html`<img class="now-playing-art" src=${device.picture} alt="" />`
          : html`
              <button
                class="tile-icon interactive"
                type="button"
                aria-label="More information"
                @click=${() => showMoreInfo(this, device.playerId ?? device.remoteId)}
              >
                ${brand
                  ? BRAND_LOGOS[brand]
                  : html`<ha-icon icon="mdi:television"></ha-icon>`}
              </button>
            `}
        <div class="tile-info">
          <div class="primary"><span>${device.name}</span></div>
          <div class="secondary" aria-live="polite"><span>${secondary}</span></div>
        </div>
        ${config.show_power
          ? html`
              <button
                class="icon-button"
                type="button"
                aria-label=${device.on ? "Turn off" : "Turn on"}
                ${press(this._pressOptions("power"))}
              >
                <ha-icon icon="mdi:power"></ha-icon>
              </button>
            `
          : nothing}
      </div>
      ${this._renderChips(device)}
    `;
  }

  private _renderChips(device: DeviceState): TemplateResult | typeof nothing {
    if (!device.on || !device.available) return nothing;

    // Nothing here is invented: each chip needs state the device actually
    // reports. A TV feeding a soundbar reports neither, and shows no chips.
    const chips: TemplateResult[] = [];
    if (device.muted === true) {
      chips.push(html`<span class="chip warn"><ha-icon icon="mdi:volume-off"></ha-icon>Muted</span>`);
    } else if (hasVolumeState(device)) {
      chips.push(html`<span class="chip accent">${Math.round(device.volume! * 100)}%</span>`);
    }
    if (!chips.length) return nothing;

    return html`<div class="tile" style="padding-top:0;min-height:0">
      <div class="chips">${chips}</div>
    </div>`;
  }

  /* -------------------------------------------------------------- rows -- */

  private _button(
    button: ButtonId,
    icon: string,
    label: string,
    options: { repeat?: boolean } = {},
  ): TemplateResult {
    return html`
      <button
        class="control-button"
        type="button"
        aria-label=${label}
        title=${label}
        ${press(this._pressOptions(button, options))}
      >
        <ha-icon icon=${icon}></ha-icon>
      </button>
    `;
  }

  private _renderNavigationRow(): TemplateResult {
    return html`
      <div class="features">
        ${this._button("back", "mdi:arrow-u-left-top", "Back")}
        ${this._button("home", "mdi:home", "Home")}
        ${this._button("menu", "mdi:menu", "Menu")}
        ${this._config!.show_favorite
          ? this._button("favorite", "mdi:star", "Favourite")
          : nothing}
      </div>
    `;
  }

  /**
   * Transport row, masked by what the player actually advertises.
   *
   * Buttons are shown when there is no paired player at all, because the key
   * codes work regardless — it is only the *player* route that needs the bit.
   */
  private _renderTransport(device: DeviceState): TemplateResult {
    // Skip previous/next need the player to advertise them. Rewind, fast
    // forward and play/pause are key codes, so they always work.
    const unpaired = device.playerId === null;
    const showPrev = unpaired || can(device, FEATURE.PREVIOUS_TRACK);
    const showNext = unpaired || can(device, FEATURE.NEXT_TRACK);

    const wanted = new Set(this._config!.transport_buttons);
    const buttons: Array<TemplateResult | typeof nothing> = [
      wanted.has("previous") && showPrev
        ? this._button("previous", "mdi:skip-previous", "Previous")
        : nothing,
      wanted.has("rewind")
        ? this._button("rewind", "mdi:rewind", "Rewind", { repeat: true })
        : nothing,
      wanted.has("play_pause")
        ? this._button(
            "play_pause",
            device.playing ? "mdi:pause" : "mdi:play",
            device.playing ? "Pause" : "Play",
          )
        : nothing,
      wanted.has("fast_forward")
        ? this._button("fast_forward", "mdi:fast-forward", "Fast forward", { repeat: true })
        : nothing,
      wanted.has("next") && showNext ? this._button("next", "mdi:skip-next", "Next") : nothing,
    ];

    return html`<div class="features">${buttons}</div>`;
  }

  /**
   * Volume.
   *
   * The buttons always work -- worst case they send key codes. The *state* is
   * another matter: androidtv_remote only reports a level when the TV itself
   * handles audio. Hand the sound to a soundbar over ARC and there is no level
   * and no mute flag, so the bar, the percentage chip and the muted icon would
   * all be invented. When that is the case the row is just three buttons.
   */
  private _renderVolume(device: DeviceState): TemplateResult {
    const known = hasVolumeState(device);
    const muted = device.muted === true;

    return html`
      <div class="features">
        ${this._button("volume_down", "mdi:volume-minus", "Volume down", { repeat: true })}
        <button
          class="control-button"
          type="button"
          aria-label=${muted ? "Unmute" : "Mute"}
          aria-pressed=${device.muted === undefined ? "undefined" : muted ? "true" : "false"}
          ${press(this._pressOptions("volume_mute"))}
        >
          <ha-icon icon=${muted ? "mdi:volume-off" : "mdi:volume-high"}></ha-icon>
        </button>
        ${this._button("volume_up", "mdi:volume-plus", "Volume up", { repeat: true })}
      </div>
      ${known
        ? html`
            <div class="volume-bar ${muted ? "muted" : ""}">
              <span style="width:${Math.round(device.volume! * 100)}%"></span>
            </div>
          `
        : nothing}
    `;
  }

  private _renderTextInput(): TemplateResult {
    return html`
      <div class="text-row">
        <input
          type="text"
          .value=${this._text}
          placeholder="Type on the TV…"
          aria-label="Text to send to the TV"
          @input=${(event: Event) => {
            this._text = (event.target as HTMLInputElement).value;
          }}
          @keydown=${(event: KeyboardEvent) => {
            if (event.key === "Enter") void this._sendText();
          }}
        />
        <button
          class="control-button accent"
          type="button"
          aria-label="Send text"
          ?disabled=${!this._text.trim() || this._sending}
          @click=${() => void this._sendText()}
        >
          <ha-icon class=${this._sending ? "spin" : ""} icon="mdi:send"></ha-icon>
        </button>
      </div>
      <div class="hint">
        Text only lands while a search or input field is focused on the TV, and
        needs “Enable IME” on the Android TV Remote config entry.
      </div>
    `;
  }

  /* -------------------------------------------------------------- apps -- */

  private _renderAppIcon(app: AppConfig): TemplateResult {
    const icon = app.icon ?? "mdi:application";
    if (icon.startsWith("brand:")) {
      const logo = BRAND_LOGOS[icon.slice(6) as BrandId];
      if (logo) return html`${logo}`;
    }
    if (icon.startsWith("/") || icon.startsWith("http")) {
      return html`<img src=${icon} alt="" />`;
    }
    return html`<ha-icon icon=${icon}></ha-icon>`;
  }

  private _renderApps(): TemplateResult | typeof nothing {
    const config = this._config!;
    if (!config.apps.length) return nothing;

    return html`
      ${config.show_section_labels
        ? html`<div class="section-head">
            Apps<span class="grow"></span><span class="count">${config.apps.length}</span>
          </div>`
        : nothing}
      <div class="app-grid" style="--app-per-row: ${config.app_columns}">
        ${repeat(
          config.apps,
          (app, index) => `${index}:${app.icon ?? ""}`,
          (app) => html`
            <button
              class="app-tile"
              type="button"
              aria-label=${app.name ?? "Launch app"}
              title=${app.name ?? ""}
              style=${app.color ? `--app-color:${app.color}` : ""}
              ${press({ onPress: () => this._launch(app), haptics: config.haptics })}
            >
              ${this._renderAppIcon(app)}
            </button>
          `,
        )}
      </div>
    `;
  }

  /* ------------------------------------------------------------ render -- */

  protected override render(): TemplateResult | typeof nothing {
    if (!this.hass || !this._config) return nothing;
    const config = this._config;
    const device = this._device!;

    if (!device.found) {
      return html`
        <ha-card>
          <div class="notice error">
            <ha-icon icon="mdi:alert-circle"></ha-icon>
            <span class="grow">Entity ${config.entity} not found.</span>
          </div>
        </ha-card>
      `;
    }

    // Drives every tint in the card, the way hui-tile-card does.
    const tile = stateColor("media_player", device.on ? "on" : "off");
    const live = device.available;

    return html`
      <ha-card style="--tile-color:${tile}">
        ${config.show_header ? this._renderHeader(device) : nothing}
        ${config.show_header && device.playerId === null
          ? html`<div class="notice warn">
              <ha-icon icon="mdi:information-outline"></ha-icon>
              <span class="grow">
                No paired media player, so state, transport and volume level are
                unavailable. Set media_player_entity to fix it.
              </span>
            </div>`
          : nothing}
        ${!live
          ? html`<div class="empty-state">This device is unavailable.</div>`
          : !device.on
            ? html`
                <!-- No "the TV is off" line: the header secondary already says
                     Off, and the button says Turn on. -->
                <div class="features">
                  <button
                    class="control-button accent wide"
                    type="button"
                    ${press(this._pressOptions("power"))}
                  >
                    <ha-icon icon="mdi:power"></ha-icon><span>Turn on</span>
                  </button>
                </div>
                ${config.show_apps ? this._renderApps() : nothing}
              `
            : html`
                ${config.show_nav
                  ? html`<polr-atv-nav-pad
                      .pad=${config.pad}
                      .repeat=${config.hold_repeat}
                      .haptics=${config.haptics}
                      @atv-nav=${this._navigate}
                    ></polr-atv-nav-pad>`
                  : nothing}
                ${this._renderNavigationRow()}
                ${config.show_transport ? this._renderTransport(device) : nothing}
                ${config.show_volume ? this._renderVolume(device) : nothing}
                ${config.show_text_input ? this._renderTextInput() : nothing}
                ${config.show_apps ? this._renderApps() : nothing}
              `}
      </ha-card>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [CARD_TYPE]: PolrAndroidTvRemoteCard;
  }
}

window.customCards = window.customCards ?? [];
window.customCards.push({
  type: CARD_TYPE,
  name: "PoLR Android TV Remote",
  description: "A remote for the Android TV Remote integration, with live state and an app launcher.",
  preview: true,
  documentationURL: "https://github.com/pathofleastresistor/polr-android-tv-remote-card",
});

// eslint-disable-next-line no-console
console.info(`%c ${CARD_TYPE} %c ${CARD_VERSION} `, "background:#555;color:#fff", "background:#3f51b5;color:#fff");
