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

import { isActionConfig, serviceAction, type ActionConfig } from "./actions";
import { describeAction, resolvePlayer } from "./atv";
import {
  BRANDS,
  BRAND_IDS,
  brandFor,
  normalizeConfig,
  stripLegacyKeys,
  type AppAction,
  type AppConfig,
  type BrandId,
  type SectionConfig,
  type TileConfig,
  type PolrAtvRemoteCardConfig,
  type ResolvedConfig,
} from "./config";
import { BRAND_LOGOS } from "./icons";
import { tileStyles } from "./kit/styles";
import { fireEvent, type HomeAssistant } from "./kit/types";

type ActionKind = "activity" | "app" | "key" | "action";

/** Which tile list a row belongs to: the app launcher, or a section index. */
type ListPath = "apps" | number;

const ACTION_KINDS: Array<{ value: ActionKind; label: string; hint: string }> = [
  { value: "activity", label: "Launch app or link", hint: "App name from the integration, or a deep link such as https://www.netflix.com/title" },
  { value: "app", label: "Open app id", hint: "Android package id, e.g. com.netflix.ninja. Needs a paired media player." },
  { value: "key", label: "Send a key", hint: "Android key code, e.g. GUIDE or MEDIA_REWIND" },
  { value: "action", label: "Call an action", hint: "" },
];

/**
 * One expandable per region of the card, in the order those regions appear.
 *
 * The previous shape put every visibility toggle in one grid and every setting
 * somewhere after it, so "Pad style" sat nowhere near "Show pad" and Volume was
 * at the bottom while its toggle was at the top. Grouping by region means each
 * section holds its own on/off switch and everything that configures it, and
 * reading the editor top to bottom matches reading the card top to bottom.
 *
 * Helper text also stays out of grids: a grid lays cells side by side, and one
 * cell growing to fit a paragraph misaligns the whole row.
 */
/** Apps settings, rendered inside the hand-rolled Apps panel. */
const APPS_SCHEMA = (config: ResolvedConfig) =>
  [
    { name: "show_apps", selector: { boolean: {} } },
    ...(config.show_apps
      ? [{ name: "app_columns", selector: { number: { min: 1, max: 8, mode: "box" } } }]
      : []),
  ] as const;

/** Everything after the Apps panel. */
const TAIL_SCHEMA = [
  {
    type: "expandable",
    name: "",
    title: "Text input",
    icon: "mdi:keyboard",
    schema: [{ name: "show_text_input", selector: { boolean: {} } }],
  },
  {
    type: "expandable",
    name: "",
    title: "Advanced",
    icon: "mdi:tune",
    schema: [
      { name: "hold_repeat", selector: { boolean: {} } },
      { name: "haptics", selector: { boolean: {} } },
      { name: "show_section_labels", selector: { boolean: {} } },
    ],
  },
] as const;

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
      type: "expandable",
      name: "",
      title: "Header",
      icon: "mdi:television",
      schema: [
        { name: "show_header", selector: { boolean: {} } },
        { name: "show_power", selector: { boolean: {} } },
        { name: "power_action", selector: { ui_action: {} } },
      ],
    },
    {
      type: "expandable",
      name: "",
      title: "Pad",
      icon: "mdi:gesture-tap-button",
      schema: [
        { name: "show_nav", selector: { boolean: {} } },
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
      ],
    },
    {
      type: "expandable",
      name: "",
      title: "Playback",
      icon: "mdi:play-pause",
      schema: [
        { name: "show_transport", selector: { boolean: {} } },
        ...(config.show_transport
          ? [
              {
                name: "transport_buttons",
                selector: {
                  select: {
                    multiple: true,
                    mode: "list",
                    options: [
                      { value: "previous", label: "Previous" },
                      { value: "rewind", label: "Rewind" },
                      { value: "play_pause", label: "Play / pause" },
                      { value: "fast_forward", label: "Fast forward" },
                      { value: "next", label: "Next" },
                    ],
                  },
                },
              },
            ]
          : []),
      ],
    },
    {
      type: "expandable",
      name: "",
      title: "Volume",
      icon: "mdi:volume-high",
      schema: [
        { name: "show_volume", selector: { boolean: {} } },
        {
          name: "volume_entity",
          selector: { entity: { filter: [{ domain: "media_player" }] } },
        },
        // HA's own interactions editor: tap, hold and double tap, with the
        // full action vocabulary. IR bridges expose one pressable entity per
        // command rather than a media_player, so this is how those get wired.
        ...(["volume_up", "volume_down", "volume_mute"] as const).map((name) => ({
          name: `${name}_action`,
          selector: { ui_action: {} },
        })),
      ],
    },
  ] as const;

/** One ui_action field, so a tile action gets the editor an override gets. */
const TILE_ACTION_SCHEMA = [
  { name: "action", selector: { ui_action: {} } },
] as const;

const LABELS: Record<string, string> = {
  entity: "Remote entity",
  volume_entity: "Volume on another media player",
  power_action: "Power",
  volume_up_action: "Volume up",
  volume_down_action: "Volume down",
  volume_mute_action: "Mute",
  name: "Title",
  pad: "Pad style",
  show_header: "Show header",
  show_power: "Show power",
  show_nav: "Show pad",
  show_transport: "Transport controls",
  show_volume: "Volume controls",
  show_apps: "App launcher",
  transport_buttons: "Buttons",
  app_columns: "Buttons per row",
  show_text_input: "Text input",
  hold_repeat: "Hold to repeat",
  haptics: "Haptic feedback",
  show_section_labels: "Section labels",
};

const HELPERS: Record<string, string> = {
  show_power:
    "In the header, or in the back / home / menu row when the header is hidden.",
  volume_entity:
    "Point this at a soundbar or receiver that exposes a media player. A TV passing audio through reports no volume level, so the card shows no level bar for it.",
  power_action:
    "Leave empty to toggle the TV itself. Set it when something else does the switching — an IR or RF blaster, or a script that also powers a receiver.",
  volume_up_action:
    "Leave empty to control the TV or the media player above. Set it for IR bridges and the like, which expose one pressable entity per command instead of a media player.",
  // Kept short: ha-form runs a boolean's helper up against its toggle, and a
  // long one wraps into it. The full caveats are in the README.
  show_text_input: "Needs a focused search field on the TV, and Enable IME.",
};

@customElement("polr-android-tv-remote-card-editor")
export class PolrAndroidTvRemoteCardEditor extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;

  @state() private _config?: ResolvedConfig;
  /**
   * Which inline edit form is open.
   *
   * Carries the list as well as the index: apps and every custom section share
   * this machinery, and an index alone would let two lists fight over which row
   * is expanded.
   */
  @state() private _editing: { path: ListPath; index: number } | null = null;

  public setConfig(config: PolrAtvRemoteCardConfig): void {
    this._config = normalizeConfig(config);
  }

  /**
   * Buttons the editor offers an interactions selector for.
   *
   * Every button supports overrides in YAML; these are the ones people
   * actually redirect, because something other than the TV does the job —
   * a blaster for power, a soundbar or IR bridge for volume.
   */
  private static readonly ACTION_BUTTONS = [
    "power",
    "volume_up",
    "volume_down",
    "volume_mute",
  ] as const;

  /**
   * ha-form data, with the editable tap actions flattened.
   *
   * ha-form has no vocabulary for a nested map, so `overrides.power` is
   * surfaced as `power_action` and folded back in `_formChanged`. Hold and
   * double-tap actions are preserved untouched; the selector only edits the tap.
   */
  private get _formData(): Record<string, unknown> {
    const data: Record<string, unknown> = { ...this._config! };
    for (const button of PolrAndroidTvRemoteCardEditor.ACTION_BUTTONS) {
      data[`${button}_action`] = this._config!.overrides[button]?.tap_action;
    }
    return data;
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
    const value = { ...event.detail.value } as Record<string, unknown>;

    const overrides: Record<string, unknown> = { ...this._config!.overrides };
    for (const button of PolrAndroidTvRemoteCardEditor.ACTION_BUTTONS) {
      const key = `${button}_action`;
      // Three forms share this handler; only act on keys the emitting one had.
      if (!(key in value)) continue;
      const action = value[key];
      delete value[key];

      // Keep any hold or double-tap the user configured; only the tap is edited
      // here, and clearing it should not discard the rest.
      const existing = { ...(this._config!.overrides[button] ?? {}) };
      if (isActionConfig(action) && action.action !== "none") {
        overrides[button] = { ...existing, tap_action: action };
      } else {
        delete existing.tap_action;
        if (Object.keys(existing).length) overrides[button] = existing;
        else delete overrides[button];
      }
    }

    // ha-form only knows the scalars; apps are managed below.
    this._emit({
      ...this._config!,
      ...value,
      overrides: overrides as PolrAtvRemoteCardConfig["overrides"],
      apps: this._config!.apps,
    });
  }

  /* --------------------------------------------------------- tile lists -- */
  /*
   * Apps and every custom section are the same list of tiles, so the list
   * machinery is addressed by path rather than duplicated per list. `"apps"` is
   * the built-in launcher; a number is an index into `sections`.
   */

  private _tiles(path: ListPath): TileConfig[] {
    return path === "apps"
      ? this._config!.apps
      : (this._config!.sections[path]?.buttons ?? []);
  }

  private _setTiles(path: ListPath, tiles: TileConfig[]): void {
    if (path === "apps") {
      this._emit({ ...this._config!, apps: tiles });
      return;
    }
    const sections = this._config!.sections.map((section, i) =>
      i === path ? { ...section, buttons: tiles } : section,
    );
    this._emit({ ...this._config!, sections });
  }

  private _addTile(path: ListPath, tile: TileConfig): void {
    const tiles = [...this._tiles(path), tile];
    this._setTiles(path, tiles);
    this._editing = { path, index: tiles.length - 1 };
  }

  private _updateTile(path: ListPath, index: number, patch: Partial<TileConfig>): void {
    this._setTiles(
      path,
      this._tiles(path).map((tile, i) => (i === index ? { ...tile, ...patch } : tile)),
    );
  }

  private _removeTile(path: ListPath, index: number): void {
    this._setTiles(
      path,
      this._tiles(path).filter((_, i) => i !== index),
    );
    this._editing = null;
  }

  private _moveTile(path: ListPath, index: number, delta: number): void {
    const tiles = [...this._tiles(path)];
    const target = index + delta;
    if (target < 0 || target >= tiles.length) return;
    [tiles[index], tiles[target]] = [tiles[target]!, tiles[index]!];
    this._setTiles(path, tiles);
    if (this._isEditing(path, index)) this._editing = { path, index: target };
  }

  private _isEditing(path: ListPath, index: number): boolean {
    return this._editing?.path === path && this._editing.index === index;
  }

  /** Change the action kind, carrying the old value across where it makes sense. */
  private _setActionKind(path: ListPath, index: number, kind: ActionKind): void {
    const current = this._tiles(path)[index]!.action;
    this._updateTile(path, index, {
      action: buildAction(kind, actionValue(current)),
    });
  }

  private _setActionValue(path: ListPath, index: number, value: string): void {
    const current = this._tiles(path)[index]!.action;
    this._updateTile(path, index, { action: buildAction(actionKind(current), value) });
  }

  /* ---------------------------------------------------------- sections -- */

  private _setSections(sections: SectionConfig[]): void {
    this._emit({ ...this._config!, sections });
  }

  private _addSection(): void {
    this._setSections([
      ...this._config!.sections,
      { name: "New section", buttons: [] },
    ]);
  }

  private _renameSection(index: number, name: string): void {
    this._setSections(
      this._config!.sections.map((section, i) =>
        i === index ? { ...section, name } : section,
      ),
    );
  }

  private _removeSection(index: number): void {
    this._setSections(this._config!.sections.filter((_, i) => i !== index));
    this._editing = null;
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
  /**
   * A tile list, with the open row's form appended after it.
   *
   * The form is a *sibling* `<li>`, which is why rows and forms are flattened
   * here rather than returned together — see _renderAppRow.
   */
  private _renderTileList(
    path: ListPath,
    tiles: TileConfig[],
    empty: string,
  ): TemplateResult {
    if (!tiles.length) return html`<div class="empty-state">${empty}</div>`;
    return html`<ul class="list">
      ${tiles.flatMap((tile, index) =>
        this._isEditing(path, index)
          ? [
              this._renderAppRow(path, tile, index, tiles.length),
              this._renderAppForm(path, tile, index),
            ]
          : [this._renderAppRow(path, tile, index, tiles.length)],
      )}
    </ul>`;
  }

  private _renderAppRow(
    path: ListPath,
    app: TileConfig,
    index: number,
    total: number,
  ): TemplateResult {
    const open = this._isEditing(path, index);

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
          @click=${() => this._moveTile(path, index, -1)}
        >
          <ha-icon icon="mdi:arrow-up"></ha-icon>
        </button>
        <button
          class="icon-button"
          title="Move down"
          .disabled=${index === total - 1}
          @click=${() => this._moveTile(path, index, 1)}
        >
          <ha-icon icon="mdi:arrow-down"></ha-icon>
        </button>
        <button
          class="icon-button"
          title=${open ? "Done" : "Edit"}
          @click=${() => {
            this._editing = open ? null : { path, index };
          }}
        >
          <ha-icon icon=${open ? "mdi:check" : "mdi:pencil"}></ha-icon>
        </button>
        <button class="icon-button danger" title="Remove" @click=${() => this._removeTile(path, index)}>
          <ha-icon icon="mdi:close"></ha-icon>
        </button>
      </li>
    `;
  }

  private _renderAppForm(path: ListPath, app: TileConfig, index: number): TemplateResult {
    const kind = actionKind(app.action);
    const meta = ACTION_KINDS.find((entry) => entry.value === kind)!;
    const haAction = asHaAction(app.action);

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
                  this._updateTile(path, index, {
                    name: (event.target as HTMLInputElement).value || undefined,
                  })}
              />
            </label>

            <!--
              HA's own picker, so icons are searchable and previewed the way
              they are everywhere else. It emits value-changed with the icon in
              event.detail.value, matching how HA's helper dialogs consume it.
            -->
            <ha-icon-picker
              .hass=${this.hass}
              .value=${app.icon ?? ""}
              label="Icon"
              @value-changed=${(event: CustomEvent) => {
                const next = event.detail?.value as string | undefined;
                // The picker only knows mdi icons. If it reports empty while
                // this tile holds a brand logo or an image path, that is the
                // picker normalising a value it does not recognise, not the
                // user clearing the field — so keep what we have. Clearing a
                // brand logo is done with the chips or by typing a new icon.
                if (!next && app.icon && !app.icon.startsWith("mdi:")) return;
                this._updateTile(path, index, { icon: next || undefined });
              }}
            ></ha-icon-picker>

            ${path !== "apps"
              ? html`
                  <ha-entity-picker
                    .hass=${this.hass}
                    .value=${app.entity ?? ""}
                    label="Lights up when this entity is on"
                    allow-custom-entity
                    @value-changed=${(event: CustomEvent) =>
                      this._updateTile(path, index, {
                        entity: (event.detail?.value as string) || undefined,
                      })}
                  ></ha-entity-picker>
                `
              : nothing}

            <!-- Streaming logos are app suggestions; a section button is a
                 projector or a receiver, so they are only offered for apps. -->
            ${path === "apps"
              ? html`
                  <div class="chips">
                    ${BRAND_IDS.map(
                      (id) => html`
                        <button
                          class="chip ${app.icon === `brand:${id}` ? "accent" : ""}"
                          title=${`Use the ${BRANDS[id].label} logo`}
                          @click=${() =>
                            this._updateTile(path, index, { icon: `brand:${id}` })}
                        >
                          ${BRANDS[id].label}
                        </button>
                      `,
                    )}
                  </div>
                `
              : nothing}

            <label class="field">
              <span>Does what</span>
              <select
                .value=${kind}
                @change=${(event: Event) =>
                  this._setActionKind(path, index, (event.target as HTMLSelectElement).value as ActionKind)}
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

            ${kind === "action"
              ? html`
                  <!--
                    HA's own interactions editor, the same control the button
                    overrides use. It carries a service picker, a target and
                    data, which the old free-text box could not — hence the
                    note telling people to go and edit YAML instead.
                  -->
                  <ha-form
                    .hass=${this.hass}
                    .data=${{ action: haAction }}
                    .schema=${TILE_ACTION_SCHEMA}
                    .computeLabel=${() => "Action"}
                    @value-changed=${(event: CustomEvent) => {
                      event.stopPropagation();
                      const next = event.detail?.value?.action;
                      if (isActionConfig(next)) {
                        this._updateTile(path, index, { action: next as AppAction });
                      }
                    }}
                  ></ha-form>
                `
              : html`
                  <label class="field wide">
                    <span>${meta.label}</span>
                    <input
                      type="text"
                      .value=${actionValue(app.action)}
                      @change=${(event: Event) =>
                        this._setActionValue(path, index, (event.target as HTMLInputElement).value)}
                    />
                  </label>
                  <div class="hint">${meta.hint}</div>
                `}
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
                  this._addTile("apps", {
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
        .data=${this._formData}
        .schema=${SCHEMA(config)}
        .computeLabel=${this._computeLabel}
        .computeHelper=${this._computeHelper}
        @value-changed=${this._formChanged}
      ></ha-form>

      <!--
        Apps get a hand-rolled panel rather than an ha-form expandable: the
        list, its ordering and the inline action editor cannot be expressed as
        a schema, and leaving them outside meant the settings that govern the
        list sat in a different section from the list itself.
      -->
      <ha-expansion-panel outlined>
        <ha-icon slot="leading-icon" icon="mdi:apps"></ha-icon>
        <div slot="header" role="heading" aria-level="3">Apps</div>

        <div class="content">
        <ha-form
          .hass=${this.hass}
          .data=${this._formData}
          .schema=${APPS_SCHEMA(config)}
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

              ${this._renderTileList("apps", apps, "No apps yet — add one below.")}

              <div class="section-head"><span class="grow">Add a known app</span></div>
              <div class="chips">
                ${BRAND_IDS.map(
                  (id) => html`
                    <button
                      class="chip"
                      @click=${() =>
                        this._addTile("apps", {
                          name: BRANDS[id].label,
                          icon: `brand:${id}`,
                          action: { action: "activity", activity: BRANDS[id].activity },
                        })}
                    >
                      <ha-icon icon="mdi:plus"></ha-icon>${BRANDS[id].label}
                    </button>
                  `,
                )}
              </div>

              ${this._renderCurrentApp()}

              <div class="form-actions">
                <button
                  class="control-button wide"
                  @click=${() =>
                    this._addTile("apps", {
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
        </div>
      </ha-expansion-panel>

      <ha-expansion-panel outlined>
        <ha-icon slot="leading-icon" icon="mdi:view-dashboard-outline"></ha-icon>
        <div slot="header" role="heading" aria-level="3">Sections</div>

        <div class="content">
          <div class="hint">
            Extra rows of buttons, drawn above the app launcher. Names show only
            when “Section labels” is on, under Advanced.
          </div>

          ${config.sections.map(
            (section, i) => html`
              <div class="section-block">
              <div class="section-head">
                <!--
                  A plain input, like every other field in this editor.
                  ha-textfield is not a component this frontend defines, so it
                  rendered as an inert unknown element and the name could not be
                  typed at all.
                -->
                <label class="field grow">
                  <span>Section name</span>
                  <input
                    type="text"
                    .value=${section.name ?? ""}
                    @change=${(event: Event) =>
                      this._renameSection(i, (event.target as HTMLInputElement).value)}
                  />
                </label>
                <button
                  class="icon-button"
                  title="Remove section"
                  @click=${() => this._removeSection(i)}
                >
                  <ha-icon icon="mdi:close"></ha-icon>
                </button>
              </div>

              ${this._renderTileList(i, section.buttons, "No buttons yet.")}

              <div class="form-actions">
                <button
                  class="control-button wide"
                  @click=${() =>
                    this._addTile(i, {
                      name: "New button",
                      icon: "mdi:power",
                      action: { action: "service", service: "" },
                    })}
                >
                  <ha-icon icon="mdi:plus"></ha-icon><span>Add button</span>
                </button>
              </div>
              </div>
            `,
          )}

          <div class="form-actions add-section">
            <button class="control-button wide" @click=${() => this._addSection()}>
              <ha-icon icon="mdi:plus"></ha-icon><span>Add section</span>
            </button>
          </div>
        </div>
      </ha-expansion-panel>

      <ha-form
        .hass=${this.hass}
        .data=${this._formData}
        .schema=${TAIL_SCHEMA}
        .computeLabel=${this._computeLabel}
        .computeHelper=${this._computeHelper}
        @value-changed=${this._formChanged}
      ></ha-form>
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
      }
      ul.list {
        padding: 0;
      }
      /*
       * Copied from HA's own ha-form-expandable so the Apps panel is
       * indistinguishable from the ones ha-form renders: the icon goes in the
       * leading-icon slot rather than inside the header (which is what was
       * indenting the label differently), the content gets its own 12px
       * padding, and the 24px gap matches ha-form's spacing between rows —
       * this panel sits between two ha-forms and would otherwise sit tighter
       * than its neighbours.
       */
      ha-expansion-panel {
        display: block;
        /*
         * The gap on BOTH sides, not just below. ha-form gives its rows
         * margin-bottom: 24px but explicitly skips the last one, so the space
         * above this panel is whatever it supplies itself — previously nothing,
         * plus an 8px margin of my own on ha-form, which is exactly why this
         * one section sat tighter than the rest.
         */
        margin: 24px 0;
        border-radius: var(--ha-border-radius-md);
        --ha-card-border-radius: var(--ha-border-radius-md);
        --expansion-panel-content-padding: 0;
      }
      ha-expansion-panel > ha-icon[slot="leading-icon"] {
        color: var(--secondary-text-color);
      }
      ha-icon-picker,
      ha-entity-picker {
        display: block;
      }

      /* ------------------------------------------------------- rhythm -- */
      /*
       * One vertical rhythm for the whole editor.
       *
       * Every part of these panels comes from the card kit, where an element
       * pads itself because it sits straight on a card. Stacked inside a panel
       * that already pads its content, those paddings disagreed: a section head
       * inset 12px, the list under it 8px, a form 8px again -- so a section's
       * name, the rows beneath it and the button below them each started at a
       * different x. Vertically it was worse, because nothing owned the gaps at
       * all: a name field sat flush against its first row, and the last row
       * flush against "Add button".
       *
       * The rule is now: the panel owns the inset, the stack owns the gaps, and
       * the parts own neither. One 4 / 8 / 16 scale -- rows within a list, parts
       * within a section, blocks within the panel.
       */
      ha-expansion-panel .content {
        display: flex;
        flex-direction: column;
        gap: var(--ha-space-4, 16px);
        padding: var(--ha-space-3, 12px);
      }
      ha-expansion-panel .content ha-form {
        display: block;
        margin-bottom: 0;
      }
      /* The parts stop insetting themselves; the panel and the block do it. */
      ha-expansion-panel .content .section-head,
      ha-expansion-panel .content ul.list,
      ha-expansion-panel .content .chips,
      ha-expansion-panel .content .hint,
      ha-expansion-panel .content .empty-state,
      ha-expansion-panel .content .form {
        margin-left: 0;
        margin-right: 0;
        padding-left: 0;
        padding-right: 0;
      }
      /* The kit gives whatever ends a card its breathing room; here the panel
         padding already is that room, and the two stacked to 24px. */
      ha-expansion-panel .content .chips,
      ha-expansion-panel .content .hint,
      ha-expansion-panel .content ul.list,
      ha-expansion-panel .content .empty-state,
      ha-expansion-panel .content .form {
        margin-bottom: 0;
        padding-bottom: 0;
      }
      /*
       * A heading belongs to what follows it, so it sits nearer that than the
       * block above -- otherwise "Apps" floated equidistant between its own
       * list and the settings above, attached to neither. Direct children only:
       * inside a section block the gap is already 8px.
       */
      ha-expansion-panel .content > .section-head + * {
        margin-top: calc(-1 * var(--ha-space-2, 8px));
      }
      /*
       * A section owns its name, its buttons and its "Add button" control, so
       * they are grouped on a tinted surface. Without it "Add button" and "Add
       * section" sat flush against each other and read as one pair of controls
       * at the same level, which they are not.
       */
      .section-block {
        display: flex;
        flex-direction: column;
        gap: var(--ha-space-2, 8px);
        padding: var(--ha-space-3, 12px);
        border-radius: var(--radius-md);
        background-color: rgba(var(--rgb-primary-text-color, 0, 0, 0), 0.04);
      }
      /*
       * This head holds the name field rather than a label, so its button lines
       * up with the input and not with the caption above it, and it drops the
       * 40px floor that would otherwise pad a two-line control.
       */
      .section-block .section-head {
        align-items: flex-end;
        min-height: 0;
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
      /*
       * One control per row. The kit lays .fields out as a responsive
       * multi-column grid, which suits pairs of short inputs — but these are a
       * name, an icon picker, an entity picker and an action, and pairing them
       * up inside the narrow editor panel made the form read as a cramped
       * table with truncated values.
       */
      .fields {
        grid-template-columns: 1fr;
      }
      .fields > .chips,
      .fields > .hint {
        padding: 0;
      }
    `,
  ];
}

/**
 * Which control to show for a tile's action.
 *
 * The first three are card shorthands with a single value each, so they get a
 * text box. Everything else is a Home Assistant action and gets HA's own
 * interactions selector — the same one the button overrides use.
 */
const actionKind = (action: AppAction): ActionKind =>
  action.action === "activity" || action.action === "app" || action.action === "key"
    ? action.action
    : "action";

/** The single free-text value behind a shorthand kind. */
const actionValue = (action: AppAction): string => {
  switch (action.action) {
    case "activity":
      return action.activity;
    case "app":
      return action.app_id;
    case "key":
      return action.key;
    default:
      return "";
  }
};

/** A tile's action as HA's selector wants it: v1's shape is translated. */
const asHaAction = (action: AppAction): ActionConfig | undefined => {
  if (action.action === "service") {
    return serviceAction(action.service, action.data, action.target);
  }
  return actionKind(action) === "action" ? (action as ActionConfig) : undefined;
};

const buildAction = (kind: ActionKind, value: string): AppAction => {
  switch (kind) {
    case "activity":
      return { action: "activity", activity: value };
    case "app":
      return { action: "app", app_id: value };
    case "key":
      return { action: "key", key: value };
    case "action":
      return { action: "perform-action", perform_action: value };
  }
};

/** Best-effort icon for an app name reported by the TV. */
const guessIcon = (activity: string): string => {
  const brand = brandFor(activity);
  return brand ? `brand:${brand}` : "mdi:application";
};

declare global {
  interface HTMLElementTagNameMap {
    "polr-android-tv-remote-card-editor": PolrAndroidTvRemoteCardEditor;
  }
}
