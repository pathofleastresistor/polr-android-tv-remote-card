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
  hasExternalVolume,
  hasVolumeState,
  isActive,
  pressButton,
  readDevice,
  runAppAction,
  sendText,
  type DeviceState,
} from "./atv";
import {
  brandFor,
  normalizeConfig,
  type AppConfig,
  type TileConfig,
  type ButtonId,
  type BrandId,
  type LayoutBlock,
  type PolrAtvRemoteCardConfig,
  type ResolvedConfig,
} from "./config";
import { BRAND_LOGOS } from "./icons";
import { isActionable, runAction, type ActionConfig } from "./actions";
import { press, type PressOptions } from "./press";
import { remoteStyles } from "./styles";
import { tileStyles } from "./kit/styles";
import { stateColor, type HomeAssistant } from "./kit/types";

import "./nav-pad";
import "./polr-android-tv-remote-card-editor";

export const CARD_VERSION = "2.1.1-beta.9";

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

  /** Rows each kind of block occupies, in HA's ~50px units. */
  private static readonly BLOCK_ROWS = {
    navigation: 1,
    transport: 1,
    volume: 1,
    text: 1,
    apps: 2,
    section: 2,
  } as const;

  public getCardSize(): number {
    const config = this._config;
    if (!config) return 6;
    let size = config.show_header ? 2 : 0;
    for (const block of config.layout) {
      if (block.hidden) continue;
      if (block.type === "pad") size += config.pad === "buttons" ? 5 : 6;
      else if (block.type === "apps") size += config.apps.length ? 2 : 0;
      else size += PolrAndroidTvRemoteCard.BLOCK_ROWS[block.type];
    }
    return Math.max(size, 3);
  }

  /** Is this block on the card at all? */
  private _shows(type: LayoutBlock["type"]): boolean {
    return (this._config?.layout ?? []).some(
      (block) => block.type === type && !block.hidden,
    );
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
      min_rows: this._shows("pad") ? 6 : 2,
    };
  }

  private get _device(): DeviceState | undefined {
    if (!this.hass || !this._config) return undefined;
    return readDevice(this.hass, this._config);
  }

  /**
   * Run a card action, reporting failures instead of dropping them.
   *
   * Every interaction here is fire-and-forget, so without this a rejected
   * service call -- a typo'd override, an entity that has gone away -- becomes
   * an unhandled promise rejection and the console shows nothing useful.
   */
  private _run(work: Promise<unknown>): void {
    void work.catch((error: unknown) => {
      console.error("polr-android-tv-remote-card:", error);
    });
  }

  private _press(button: ButtonId): void {
    const device = this._device;
    if (!this.hass || !this._config || !device) return;
    this._run(pressButton(this.hass, this._config, device, button, this));
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
      if (this.hass) this._run(runAction(this, this.hass, action, config.entity));
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
    this._run(runAppAction(this.hass, device, app, this));
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
        ? (device.appName ?? "On")
        : "Off"
      : "Unavailable";

    // A brand logo is instantly readable at 24px; mdi:television-play is not.
    const brand = device.on && device.available ? brandFor(device.appName) : undefined;

    return html`
      <div class="tile">
        <!-- Not interactive: the icon shows what is playing, and tapping it
             opened a more-info dialog nobody wanted from a remote. -->
        <div class="tile-icon">
          ${brand
            ? html`<span class="brand-mark">${BRAND_LOGOS[brand]}</span>`
            : html`<ha-icon icon="mdi:television"></ha-icon>`}
        </div>
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

  /**
   * Volume state under the header -- only when there is no volume row.
   *
   * The row itself now carries the level and the mute state, so repeating them
   * here put one number in two places and cost a whole band of the card for a
   * single small pill. With the row switched off this is the only place left
   * that can say it, so it comes back.
   */
  private _renderChips(device: DeviceState): TemplateResult | typeof nothing {
    if (!device.on || !device.available || this._shows("volume")) return nothing;

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
    const config = this._config!;
    // Power lives in the header, but the header is optional. Rather than let
    // "show power" silently do nothing when the header is hidden, the button
    // moves here — so the setting always means what it says.
    const orphanedPower = config.show_power && !config.show_header;

    return html`
      <div class="features">
        ${orphanedPower ? this._button("power", "mdi:power", "Power") : nothing}
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
   * Volume: one control, not three.
   *
   * The level used to be stated in three places -- a percentage chip under the
   * header, a mute icon in the middle button, and a bar floating under the row
   * -- so the one thing the user cares about was scattered across three bands
   * of the card. It is now a single control: the mute toggle *is* the readout,
   * filled to the current level, flanked by the two steps that change it.
   *
   * The buttons always work -- worst case they send key codes. The *state* is
   * another matter: androidtv_remote only reports a level when the TV itself
   * handles audio. Hand the sound to a soundbar over ARC and there is no level
   * and no mute flag, so the fill and the percentage would both be invented.
   * When that is the case the control is just its icon.
   */
  private _renderVolume(device: DeviceState): TemplateResult {
    // On an off TV the level and mute flag still sitting on its own player are
    // the last thing it knew before it slept, and they say nothing about what
    // an IR bridge is driving. Only a separately addressed volume entity -- a
    // soundbar that is awake -- is reporting on the sound in the room.
    const reported = device.on || device.volumeId !== device.playerId;
    const muted = reported && device.muted === true;
    const mutedKnown = reported && device.muted !== undefined;
    const percent =
      reported && hasVolumeState(device) ? Math.round(device.volume! * 100) : undefined;

    return html`
      <div class="features">
        ${this._button("volume_down", "mdi:volume-minus", "Volume down", { repeat: true })}
        <button
          class="control-button volume-level ${muted ? "muted" : ""}"
          type="button"
          aria-label=${muted ? "Unmute" : "Mute"}
          aria-pressed=${mutedKnown ? (muted ? "true" : "false") : "undefined"}
          ${press(this._pressOptions("volume_mute"))}
        >
          <!-- Read-only by design: androidtv_remote supports VOLUME_STEP but
               not VOLUME_SET, so there is nothing to drag to. -->
          ${percent === undefined
            ? nothing
            : html`<span class="level" style="width:${percent}%"></span>`}
          <ha-icon icon=${muted ? "mdi:volume-off" : "mdi:volume-high"}></ha-icon>
          ${muted
            ? html`<span class="value">Muted</span>`
            : percent === undefined
              ? nothing
              : html`<span class="value">${percent}%</span>`}
        </button>
        ${this._button("volume_up", "mdi:volume-plus", "Volume up", { repeat: true })}
      </div>
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
            if (event.key === "Enter") this._run(this._sendText());
          }}
        />
        <button
          class="control-button accent"
          type="button"
          aria-label="Send text"
          ?disabled=${!this._text.trim() || this._sending}
          @click=${() => this._run(this._sendText())}
        >
          <ha-icon class=${this._sending ? "spin" : ""} icon="mdi:send"></ha-icon>
        </button>
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

  /**
   * One row of tiles.
   *
   * The app launcher is the built-in caller; user-defined sections are the same
   * grid with their own name. Labels gate on `show_section_labels`, so a custom
   * section is indistinguishable from a native one.
   */
  private _renderSection(
    tiles: TileConfig[],
    columns: number,
    key: string,
  ): TemplateResult | typeof nothing {
    if (!tiles.length) return nothing;
    const config = this._config!;

    return html`
      <div class="app-grid" style="--app-per-row: ${columns}">
        ${repeat(
          tiles,
          (tile, index) => `${key}:${index}:${tile.icon ?? ""}`,
          (tile) => {
            // A tile with no entity is never lit: an IR command has no state,
            // and showing it as off would be a claim the card cannot make.
            const active = this.hass ? isActive(this.hass, tile.entity) : false;
            return html`
              <button
                class="app-tile ${active ? "active" : ""}"
                type="button"
                aria-label=${tile.name ?? "Launch app"}
                title=${tile.name ?? ""}
                aria-pressed=${tile.entity ? String(active) : nothing}
                style=${tile.color ? `--app-color:${tile.color}` : ""}
                ${press({ onPress: () => this._launch(tile), haptics: config.haptics })}
              >
                ${this._renderAppIcon(tile)}
              </button>
            `;
          },
        )}
      </div>
    `;
  }

  /**
   * One block of the layout.
   *
   * Every block is drawn here and nowhere else, so the order on screen is the
   * order of the list and nothing can quietly re-sort it -- which is what the
   * old fixed template did: sections came after the remote because that is
   * where they were typed, not because anyone chose it.
   */
  private _renderBlock(
    block: LayoutBlock,
    index: number,
    device: DeviceState,
  ): TemplateResult | typeof nothing {
    const config = this._config!;

    switch (block.type) {
      case "pad":
        return html`<polr-atv-nav-pad
          .pad=${config.pad}
          .repeat=${config.hold_repeat}
          .haptics=${config.haptics}
          @atv-nav=${this._navigate}
        ></polr-atv-nav-pad>`;

      case "navigation":
        return this._renderNavigationRow();

      case "transport":
        return this._renderTransport(device);

      case "volume":
        return this._renderVolume(device);

      case "text":
        return this._renderTextInput();

      case "apps":
        return this._renderSection(config.apps, config.app_columns, "apps");

      case "section":
        return this._renderSection(
          block.buttons,
          block.columns ?? config.app_columns,
          `s${index}`,
        );
    }
  }

  /**
   * The heading above a block, if it has earned one.
   *
   * `title` draws because it is set -- that is what setting it means. The older
   * rule still holds underneath it: with section labels on, a section falls
   * back to its name and the launcher to "Apps", so a card written before
   * titles existed looks exactly as it did.
   *
   * The count belongs to lists of tiles. "Volume 1" would be counting nothing.
   */
  private _renderHeading(block: LayoutBlock): TemplateResult | typeof nothing {
    const config = this._config!;
    const tiles =
      block.type === "section"
        ? block.buttons
        : block.type === "apps"
          ? config.apps
          : undefined;

    const legacy = config.show_section_labels
      ? block.type === "section"
        ? block.name
        : block.type === "apps"
          ? "Apps"
          : undefined
      : undefined;

    const label = block.title ?? legacy;
    if (!label) return nothing;

    return html`<div class="section-head">
      ${label}<span class="grow"></span>
      ${tiles ? html`<span class="count">${tiles.length}</span>` : nothing}
    </div>`;
  }

  /**
   * The layout, minus what this device state cannot support.
   *
   * A pad, a transport row and a text field all talk to a TV that is awake, so
   * an off TV drops them -- but only them, and the rest keep their order. The
   * volume row stays when the sound is not the TV's, which is the same rule it
   * follows when the card is on.
   */
  private _renderLayout(device: DeviceState): TemplateResult {
    const config = this._config!;
    const live = device.on;

    const draws = (block: LayoutBlock): boolean => {
      if (block.hidden) return false;
      if (live) return true;
      // An off TV can still work a soundbar, and still has sections and apps.
      if (block.type === "section" || block.type === "apps") return true;
      return block.type === "volume" && hasExternalVolume(config, device);
    };

    return html`
      ${config.layout.map((block, index) => {
        if (!draws(block)) return nothing;
        const body = this._renderBlock(block, index, device);
        // An empty section draws nothing, and a heading over nothing is a
        // label for a row that is not there.
        if (body === nothing) return nothing;
        return html`${this._renderHeading(block)}${body}`;
      })}
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
      <ha-card class=${config.show_header ? "" : "headerless"} style="--tile-color:${tile}">
        ${config.show_header ? this._renderHeader(device) : nothing}
        ${config.show_header && device.playerId === null
          ? html`<div class="notice warn">
              <ha-icon icon="mdi:information-outline"></ha-icon>
              <span class="grow">
                This device has no media player, so power state, transport and
                volume level are unavailable.
              </span>
            </div>`
          : nothing}
        ${!live
          ? html`<div class="empty-state">This device is unavailable.</div>`
          : html`
              ${device.on
                ? nothing
                : html`
                    <!-- No "the TV is off" line: the header secondary already
                         says Off, and the button says Turn on. -->
                    <div class="features">
                      <button
                        class="control-button accent wide"
                        type="button"
                        ${press(this._pressOptions("power"))}
                      >
                        <ha-icon icon="mdi:power"></ha-icon><span>Turn on</span>
                      </button>
                    </div>
                  `}
              ${this._renderLayout(device)}
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

console.info(`%c ${CARD_TYPE} %c ${CARD_VERSION} `, "background:#555;color:#fff", "background:#3f51b5;color:#fff");
