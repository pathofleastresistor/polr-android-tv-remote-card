/**
 * The visual editor.
 *
 * v1's `getConfigElement()` returned `polr-android-tv-remote-card-editor` — an
 * element nothing ever defined — so the UI editor rendered blank and every
 * option was YAML-only. This is the first time the card has actually had one.
 *
 * Scalar options go through `ha-form`, so selectors, theming and translations
 * come from HA. The app list is hand-rolled: ha-form cannot express a
 * repeatable, ordered list of heterogeneous actions.
 *
 * Opening this editor is also what migrates a v1 config — `setConfig` runs it
 * through `normalizeConfig`, and the first change emits v2. A user who never
 * opens it keeps their v1 YAML, which keeps working.
 */

import { LitElement, css, html, nothing, type TemplateResult } from "lit";
import { customElement, property, state } from "lit/decorators.js";

import { describeAction, resolvePlayer } from "./atv";
import {
  BRANDS,
  normalizeConfig,
  stripLegacyKeys,
  type AppAction,
  type AppConfig,
  type BrandId,
  type PolrAtvRemoteCardConfig,
  type ResolvedConfig,
} from "./config";
import { BRAND_IDS, BRAND_LABELS, BRAND_LOGOS } from "./icons";
import { tileStyles } from "./kit/styles";
import { fireEvent, type HomeAssistant } from "./kit/types";

type ActionKind = AppAction["action"];

const ACTION_KINDS: Array<{ value: ActionKind; label: string; hint: string }> = [
  { value: "activity", label: "Launch app or link", hint: "App name from the integration, or a deep link such as https://www.netflix.com/title" },
  { value: "app", label: "Open app id", hint: "Android package id, e.g. com.netflix.ninja. Needs a paired media player." },
  { value: "key", label: "Send a key", hint: "Android key code, e.g. GUIDE or MEDIA_REWIND" },
  { value: "service", label: "Call an action", hint: "domain.service, e.g. script.movie_night" },
];

const SCHEMA = (config: ResolvedConfig) =>
  [
    {
      name: "entity",
      required: true,
      selector: {
        entity: {
          // Narrow to the integration this card is built for, but still allow
          // any remote — plenty of people point it at something else.
          filter: [
            { integration: "androidtv_remote", domain: "remote" },
            { domain: "remote" },
          ],
        },
      },
    },
    { name: "name", selector: { text: {} } },
    {
      type: "grid",
      name: "",
      schema: [
        { name: "show_header", selector: { boolean: {} } },
        { name: "show_power", selector: { boolean: {} } },
        { name: "show_nav", selector: { boolean: {} } },
        { name: "show_transport", selector: { boolean: {} } },
        { name: "show_volume", selector: { boolean: {} } },
        { name: "show_apps", selector: { boolean: {} } },
        { name: "show_text_input", selector: { boolean: {} } },
      ],
    },
    ...(config.show_nav
      ? [
          {
            name: "pad",
            selector: {
              select: {
                mode: "dropdown",
                options: [
                  { value: "buttons", label: "Buttons" },
                  { value: "dpad", label: "D-pad" },
                  { value: "touchpad", label: "Touchpad" },
                ],
              },
            },
          },
        ]
      : []),
    {
      type: "expandable",
      name: "",
      title: "Advanced",
      schema: [
        {
          name: "media_player_entity",
          selector: { entity: { filter: [{ domain: "media_player" }] } },
        },
        {
          name: "volume_entity",
          selector: { entity: { filter: [{ domain: "media_player" }] } },
        },
        { name: "hold_repeat", selector: { boolean: {} } },
        { name: "haptics", selector: { boolean: {} } },
        { name: "show_section_labels", selector: { boolean: {} } },
      ],
    },
  ] as const;

const LABELS: Record<string, string> = {
  entity: "Remote entity",
  media_player_entity: "Paired media player (auto-detected)",
  volume_entity: "Volume controls",
  name: "Title",
  pad: "Pad style",
  show_header: "Show header",
  show_power: "Show power",
  show_nav: "Show pad",
  show_transport: "Transport controls",
  show_volume: "Volume controls",
  show_apps: "App launcher",
  show_text_input: "Text input",
  hold_repeat: "Hold to repeat",
  haptics: "Haptic feedback",
  show_section_labels: "Section labels",
};

const HELPERS: Record<string, string> = {
  media_player_entity:
    "Only needed if the card cannot find the player itself, or to point it at a different player on the same TV.",
  volume_entity:
    "Point this at a soundbar or receiver if that is what actually changes the volume. A TV passing audio through reports no volume level, so the card shows no level bar for it.",
  show_text_input:
    "Sends typed text to the TV. Only lands while a search field is focused, and needs “Enable IME” on the integration.",
};

@customElement("polr-android-tv-remote-card-editor")
export class PolrAndroidTvRemoteCardEditor extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;

  @state() private _config?: ResolvedConfig;
  /** Index of the app whose inline form is open, or null. */
  @state() private _editing: number | null = null;

  public setConfig(config: PolrAtvRemoteCardConfig): void {
    this._config = normalizeConfig(config);
  }

  private _computeLabel = (schema: { name: string }): string =>
    LABELS[schema.name] ?? schema.name;

  private _computeHelper = (schema: { name: string }): string | undefined =>
    HELPERS[schema.name];

  /** Emit a full v2 config. This is what upgrades stored v1 YAML. */
  private _emit(config: PolrAtvRemoteCardConfig): void {
    fireEvent(this, "config-changed", { config: stripLegacyKeys(config) });
  }

  private _formChanged(event: CustomEvent): void {
    event.stopPropagation();
    // ha-form only knows the scalars; apps are managed below.
    this._emit({ ...this._config!, ...event.detail.value, apps: this._config!.apps });
  }

  private _setApps(apps: AppConfig[]): void {
    this._emit({ ...this._config!, apps });
  }

  private _addApp(app: AppConfig): void {
    const apps = [...this._config!.apps, app];
    this._setApps(apps);
    this._editing = apps.length - 1;
  }

  private _updateApp(index: number, patch: Partial<AppConfig>): void {
    const apps = this._config!.apps.map((app, i) =>
      i === index ? { ...app, ...patch } : app,
    );
    this._setApps(apps);
  }

  private _removeApp(index: number): void {
    this._setApps(this._config!.apps.filter((_, i) => i !== index));
    this._editing = null;
  }

  private _moveApp(index: number, delta: number): void {
    const apps = [...this._config!.apps];
    const target = index + delta;
    if (target < 0 || target >= apps.length) return;
    [apps[index], apps[target]] = [apps[target]!, apps[index]!];
    this._setApps(apps);
    if (this._editing === index) this._editing = target;
  }

  /** Change the action kind, carrying the old value across where it makes sense. */
  private _setActionKind(index: number, kind: ActionKind): void {
    const current = this._config!.apps[index]!.action;
    const value = actionValue(current);
    this._updateApp(index, { action: buildAction(kind, value) });
  }

  private _setActionValue(index: number, value: string): void {
    const current = this._config!.apps[index]!.action;
    this._updateApp(index, { action: buildAction(current.action, value) });
  }

  private _renderIcon(app: AppConfig): TemplateResult {
    const icon = app.icon ?? "mdi:application";
    if (icon.startsWith("brand:")) {
      const logo = BRAND_LOGOS[icon.slice(6) as BrandId];
      if (logo) return html`<span class="brand">${logo}</span>`;
    }
    if (icon.startsWith("/") || icon.startsWith("http")) {
      return html`<img class="brand" src=${icon} alt="" />`;
    }
    return html`<ha-icon .icon=${icon}></ha-icon>`;
  }

  /**
   * One list row.
   *
   * The inline edit form is a *sibling* `<li>`, appended by the caller rather
   * than returned from here. A single template emitting two `<li>` elements
   * gets mis-parsed — the second ends up nested inside the first, and the form
   * renders half-width, floating out of the row.
   */
  private _renderAppRow(app: AppConfig, index: number, total: number): TemplateResult {
    const open = this._editing === index;

    return html`
      <li class="row">
        <div class="tile-icon">${this._renderIcon(app)}</div>
        <div class="tile-info">
          <div class="primary"><span>${app.name ?? "Untitled app"}</span></div>
          <div class="secondary"><span>${describeAction(app.action)}</span></div>
        </div>
        <button
          class="icon-button"
          title="Move up"
          .disabled=${index === 0}
          @click=${() => this._moveApp(index, -1)}
        >
          <ha-icon icon="mdi:arrow-up"></ha-icon>
        </button>
        <button
          class="icon-button"
          title="Move down"
          .disabled=${index === total - 1}
          @click=${() => this._moveApp(index, 1)}
        >
          <ha-icon icon="mdi:arrow-down"></ha-icon>
        </button>
        <button
          class="icon-button"
          title=${open ? "Done" : "Edit"}
          @click=${() => {
            this._editing = open ? null : index;
          }}
        >
          <ha-icon icon=${open ? "mdi:check" : "mdi:pencil"}></ha-icon>
        </button>
        <button class="icon-button danger" title="Remove" @click=${() => this._removeApp(index)}>
          <ha-icon icon="mdi:close"></ha-icon>
        </button>
      </li>
    `;
  }

  private _renderAppForm(app: AppConfig, index: number): TemplateResult {
    const kind = app.action.action;
    const meta = ACTION_KINDS.find((entry) => entry.value === kind)!;

    return html`
      <li class="form-host">
        <div class="form">
          <div class="fields">
            <label class="field">
              <span>Name</span>
              <input
                type="text"
                .value=${app.name ?? ""}
                @change=${(event: Event) =>
                  this._updateApp(index, {
                    name: (event.target as HTMLInputElement).value || undefined,
                  })}
              />
            </label>

            <label class="field">
              <span>Icon</span>
              <input
                type="text"
                placeholder="mdi:netflix, brand:netflix, or an image URL"
                .value=${app.icon ?? ""}
                @change=${(event: Event) =>
                  this._updateApp(index, {
                    icon: (event.target as HTMLInputElement).value || undefined,
                  })}
              />
            </label>

            <div class="chips">
              ${BRAND_IDS.map(
                (id) => html`
                  <button
                    class="chip ${app.icon === `brand:${id}` ? "accent" : ""}"
                    title=${`Use the ${BRAND_LABELS[id]} logo`}
                    @click=${() => this._updateApp(index, { icon: `brand:${id}` })}
                  >
                    ${BRAND_LABELS[id]}
                  </button>
                `,
              )}
            </div>

            <label class="field">
              <span>Does what</span>
              <select
                .value=${kind}
                @change=${(event: Event) =>
                  this._setActionKind(index, (event.target as HTMLSelectElement).value as ActionKind)}
              >
                ${ACTION_KINDS.map(
                  (entry) => html`
                    <option value=${entry.value} ?selected=${entry.value === kind}>
                      ${entry.label}
                    </option>
                  `,
                )}
              </select>
            </label>

            <label class="field wide">
              <span>${meta.label}</span>
              <input
                type="text"
                .value=${actionValue(app.action)}
                @change=${(event: Event) =>
                  this._setActionValue(index, (event.target as HTMLInputElement).value)}
              />
            </label>
            <div class="hint">${meta.hint}</div>

            ${kind === "service"
              ? html`<div class="hint">
                  Extra service data can only be set in YAML — switch to the code editor.
                </div>`
              : nothing}
          </div>
        </div>
      </li>
    `;
  }

  /**
   * The app running on the TV right now.
   *
   * Nothing in the integration can enumerate what is installed on the TV, and
   * the card does not pretend otherwise. `app_id` reports whatever is on
   * screen, though — so opening an app and clicking here captures its real
   * package id, which is otherwise tedious to find.
   */
  private _renderCurrentApp(): TemplateResult | typeof nothing {
    const config = this._config!;
    const playerId = resolvePlayer(this.hass!, config);
    const player = playerId ? this.hass!.states?.[playerId] : undefined;
    const appId = player?.attributes?.["app_id"] as string | undefined;
    const appName = player?.attributes?.["app_name"] as string | undefined;
    if (!appId) return nothing;

    const already = config.apps.some(
      (app) => app.action.action === "app" && app.action.app_id === appId,
    );

    return html`
      <div class="section-head"><span class="grow">Playing right now</span></div>
      ${already
        ? html`<div class="hint">${appName ?? appId} is already in the list.</div>`
        : html`
            <div class="chips">
              <button
                class="chip accent"
                @click=${() =>
                  this._addApp({
                    name: appName ?? appId,
                    icon: guessIcon(appName ?? appId),
                    action: { action: "app", app_id: appId },
                  })}
              >
                <ha-icon icon="mdi:plus"></ha-icon>${appName ?? appId}
              </button>
            </div>
            <div class="hint">
              Open an app on the TV and it appears here, which is the easiest way
              to capture its package id (${appId}).
            </div>
          `}
    `;
  }

  protected override render(): TemplateResult | typeof nothing {
    if (!this.hass || !this._config) return nothing;
    const config = this._config;
    const apps = config.apps;

    return html`
      <ha-form
        .hass=${this.hass}
        .data=${config}
        .schema=${SCHEMA(config)}
        .computeLabel=${this._computeLabel}
        .computeHelper=${this._computeHelper}
        @value-changed=${this._formChanged}
      ></ha-form>

      ${config.show_apps
        ? html`
            <div class="section-head">
              <span class="grow">Apps</span>
              <span class="count">${apps.length}</span>
            </div>

            ${apps.length
              ? html`<ul class="list">
                  ${apps.flatMap((app, index) =>
                    this._editing === index
                      ? [
                          this._renderAppRow(app, index, apps.length),
                          this._renderAppForm(app, index),
                        ]
                      : [this._renderAppRow(app, index, apps.length)],
                  )}
                </ul>`
              : html`<div class="empty-state">No apps yet — add one below.</div>`}

            <div class="section-head"><span class="grow">Add a known app</span></div>
            <div class="chips">
              ${BRAND_IDS.map(
                (id) => html`
                  <button
                    class="chip"
                    @click=${() =>
                      this._addApp({
                        name: BRANDS[id].label,
                        icon: `brand:${id}`,
                        action: { action: "activity", activity: BRANDS[id].activity },
                      })}
                  >
                    <ha-icon icon="mdi:plus"></ha-icon>${BRAND_LABELS[id]}
                  </button>
                `,
              )}
            </div>

            ${this._renderCurrentApp()}

            <div class="form-actions">
              <button
                class="control-button wide"
                @click=${() =>
                  this._addApp({
                    name: "New app",
                    icon: "mdi:application",
                    action: { action: "activity", activity: "" },
                  })}
              >
                <ha-icon icon="mdi:plus"></ha-icon><span>Custom app</span>
              </button>
            </div>
          `
        : nothing}
    `;
  }

  static override styles = [
    tileStyles,
    css`
      :host {
        display: block;
      }
      ha-form {
        display: block;
        margin-bottom: var(--ha-space-2, 8px);
      }
      ul.list {
        padding: 0;
      }
      /* The kit sizes icon buttons for a card; an editor row is tighter. */
      .icon-button {
        width: 36px;
        height: 36px;
        --mdc-icon-size: 20px;
      }
      .chip {
        cursor: pointer;
        border: none;
        height: 26px;
        font-family: inherit;
      }
      .brand {
        display: block;
        width: 22px;
        height: 22px;
      }
      .brand svg {
        width: 100%;
        height: 100%;
        fill: currentColor;
      }
      .field select,
      .field input {
        width: 100%;
        box-sizing: border-box;
        height: 36px;
        padding: 0 var(--ha-space-2, 8px);
        border: none;
        border-radius: var(--radius-md);
        background-color: rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.08);
        color: var(--primary-text-color);
        font: inherit;
        font-size: var(--ha-font-size-m, 14px);
      }
      .chips {
        padding: 0 var(--ha-space-3, 12px) var(--ha-space-2, 8px);
      }
      .hint {
        padding: 0 var(--ha-space-3, 12px) var(--ha-space-2, 8px);
      }
      /* The kit lays .fields out as a two-column grid, which is right for pairs
         of short inputs but shreds a chip row or a paragraph of help text. */
      .fields > .chips,
      .fields > .hint,
      .fields > .field.wide {
        grid-column: 1 / -1;
        padding: 0;
      }
    `,
  ];
}

/** The single free-text value behind whichever action kind is selected. */
const actionValue = (action: AppAction): string => {
  switch (action.action) {
    case "activity":
      return action.activity;
    case "app":
      return action.app_id;
    case "key":
      return action.key;
    case "service":
      return action.service;
  }
};

const buildAction = (kind: ActionKind, value: string): AppAction => {
  switch (kind) {
    case "activity":
      return { action: "activity", activity: value };
    case "app":
      return { action: "app", app_id: value };
    case "key":
      return { action: "key", key: value };
    case "service":
      return { action: "service", service: value };
  }
};

/** Best-effort icon for an app name reported by the TV. */
const guessIcon = (activity: string): string => {
  const key = activity.toLowerCase().replace(/[^a-z]/g, "");
  const brand = BRAND_IDS.find((id) => key.includes(id) || id.includes(key));
  return brand ? `brand:${brand}` : "mdi:application";
};

declare global {
  interface HTMLElementTagNameMap {
    "polr-android-tv-remote-card-editor": PolrAndroidTvRemoteCardEditor;
  }
}
