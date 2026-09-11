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
  type BlockId,
  type BrandId,
  type LayoutBlock,
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

/**
 * What each built-in block is called in the layout list, and where its settings
 * live now that its on/off switch does not sit beside them.
 */
const BLOCKS: Record<BlockId, { label: string; icon: string; settings?: string }> = {
  pad: { label: "Remote pad", icon: "mdi:gesture-tap-button", settings: "Pad" },
  navigation: { label: "Back / home / menu", icon: "mdi:arrow-u-left-top" },
  transport: { label: "Playback", icon: "mdi:play-pause", settings: "Playback" },
  volume: { label: "Volume", icon: "mdi:volume-high", settings: "Volume" },
  text: { label: "Text input", icon: "mdi:keyboard" },
  apps: { label: "App launcher", icon: "mdi:apps", settings: "Apps" },
};

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
const APPS_SCHEMA = [
  { name: "app_columns", selector: { number: { min: 1, max: 8, mode: "box" } } },
] as const;

/** Everything after the Apps panel. */
const TAIL_SCHEMA = [
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

const SCHEMA = () =>
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
      ],
    },
    {
      type: "expandable",
      name: "",
      title: "Playback",
      icon: "mdi:play-pause",
      schema: [
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
      ],
    },
    {
      type: "expandable",
      name: "",
      title: "Volume",
      icon: "mdi:volume-high",
      schema: [
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
  transport_buttons: "Buttons",
  app_columns: "Buttons per row",
  hold_repeat: "Hold to repeat",
  haptics: "Haptic feedback",
  show_section_labels: "Section labels",
};

const HELPERS: Record<string, string> = {
  show_power:
    "In the header, or in the back / home / menu row when the header is hidden — that row then has to be in the layout for it to have anywhere to go.",
  volume_entity:
    "Point this at a soundbar or receiver that exposes a media player. A TV passing audio through reports no volume level, so the card shows no level bar for it.",
  power_action:
    "Leave empty to toggle the TV itself. Set it when something else does the switching — an IR or RF blaster, or a script that also powers a receiver.",
  volume_up_action:
    "Leave empty to control the TV or the media player above. Set it for IR bridges and the like, which expose one pressable entity per command instead of a media player.",
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

  /**
   * Which block's own editor is expanded, as a layout index.
   *
   * Separate from `_editing`, which tracks the open *tile* form: opening a
   * button inside a section must not collapse the section around it.
   */
  @state() private _openSection: number | null = null;

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
    if (path === "apps") return this._config!.apps;
    const block = this._config!.layout[path];
    return block?.type === "section" ? block.buttons : [];
  }

  private _setTiles(path: ListPath, tiles: TileConfig[]): void {
    if (path === "apps") {
      this._emit({ ...this._config!, apps: tiles });
      return;
    }
    this._setLayout(
      this._config!.layout.map((block, i) =>
        i === path && block.type === "section" ? { ...block, buttons: tiles } : block,
      ),
    );
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

  /* ------------------------------------------------------------ layout -- */

  /**
   * Write the layout, and with it the keys it replaces.
   *
   * `sections` and the five `show_*` flags say the same things a layout says,
   * and a config carrying both is a config where two places disagree the moment
   * either is edited. Writing a layout therefore retires them from the stored
   * YAML; the card still reads them, so a hand-written config that never meets
   * this editor is untouched.
   */
  private _setLayout(layout: LayoutBlock[]): void {
    const next = { ...this._config!, layout } as Record<string, unknown>;
    for (const key of [
      "sections",
      "show_nav",
      "show_transport",
      "show_volume",
      "show_text_input",
      "show_apps",
    ]) {
      delete next[key];
    }
    this._emit(next as unknown as PolrAtvRemoteCardConfig);
  }

  private _moveBlock(index: number, delta: number): void {
    const layout = [...this._config!.layout];
    const target = index + delta;
    if (target < 0 || target >= layout.length) return;
    [layout[index], layout[target]] = [layout[target]!, layout[index]!];
    this._setLayout(layout);

    // Both open-state trackers address blocks by position, so a move that does
    // not carry them leaves a section's editor attached to whatever swapped
    // into its slot -- the buttons of one section under the name of another.
    const follow = (at: number | null): number | null =>
      at === index ? target : at === target ? index : at;
    this._openSection = follow(this._openSection);
    if (typeof this._editing?.path === "number") {
      this._editing = { ...this._editing, path: follow(this._editing.path)! };
    }
  }

  private _toggleBlock(index: number): void {
    this._setLayout(
      this._config!.layout.map((block, i) => {
        if (i !== index) return block;
        const { hidden: _was, ...rest } = block;
        return block.hidden ? rest : { ...rest, hidden: true };
      }),
    );
  }

  private _addSection(): void {
    const layout = this._config!.layout;
    this._setLayout([
      ...layout,
      { type: "section" as const, name: "New section", buttons: [] },
    ]);
    // Open it: a new section is empty, and a row that does nothing when added
    // is the bug "Add section" shipped with once already.
    this._openSection = layout.length;
    this._editing = null;
  }

  /** A heading above the block, or none when the field is emptied. */
  private _setTitle(index: number, title: string): void {
    this._setLayout(
      this._config!.layout.map((block, i) => {
        if (i !== index) return block;
        const { title: _old, ...rest } = block;
        return title ? { ...rest, title } : rest;
      }),
    );
  }

  private _renameSection(index: number, name: string): void {
    this._setLayout(
      this._config!.layout.map((block, i) =>
        i === index && block.type === "section" ? { ...block, name } : block,
      ),
    );
  }

  private _removeSection(index: number): void {
    this._setLayout(this._config!.layout.filter((_, i) => i !== index));
    this._openSection = null;
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
          <div class="secondary"><span>${describeAction(app.action, app.entity)}</span></div>
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

                  <!--
                    HA's interactions editor has no entity field for "more
                    info" -- in HA's own cards the dialog is always the card's
                    entity, and there was nothing to choose. Here the card's
                    entity is a remote, so without this the one dialog the
                    button could open was the one it was not about.
                  -->
                  ${haAction?.action === "more-info"
                    ? html`
                        <ha-entity-picker
                          .hass=${this.hass}
                          .value=${haAction.entity ?? ""}
                          label="Dialog to open"
                          allow-custom-entity
                          @value-changed=${(event: CustomEvent) =>
                            this._updateTile(path, index, {
                              action: {
                                action: "more-info",
                                ...((event.detail?.value as string)
                                  ? { entity: event.detail.value as string }
                                  : {}),
                              },
                            })}
                        ></ha-entity-picker>
                        <div class="hint">
                          ${app.entity
                            ? html`Leave empty to open ${app.entity}, the entity
                              this button lights up for.`
                            : html`Leave empty and it opens the card's remote,
                              which is rarely what a button is about.`}
                        </div>
                      `
                    : nothing}
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

  /* ------------------------------------------------------------ layout -- */

  /**
   * The card's blocks, in order, every one of them.
   *
   * Hidden blocks are listed too, struck through. A list of only what is on
   * cannot offer to turn anything back on, and a block dropped from the list
   * loses the place it should return to.
   */
  private _renderLayoutList(): TemplateResult {
    const layout = this._config!.layout;

    return html`<ul class="list">
      ${layout.flatMap((block, index): Array<TemplateResult | typeof nothing> => {
        const open = this._openSection === index;
        return [
          this._renderLayoutRow(block, index, layout.length, open),
          this._renderBlockBody(block, index),
        ];
      })}
    </ul>`;
  }

  private _renderLayoutRow(
    block: LayoutBlock,
    index: number,
    total: number,
    open: boolean,
  ): TemplateResult {
    const section = block.type === "section" ? block : undefined;
    const meta = block.type === "section" ? undefined : BLOCKS[block.type];
    const count = section?.buttons.length ?? 0;

    // Only when it says something: a row repeating its own title in smaller
    // type is what squeezed the titles into an ellipsis in the first place.
    const secondary = block.hidden
      ? "Hidden"
      : section
        ? `${count} ${count === 1 ? "button" : "buttons"}`
        : "";

    return html`
      <li class="row ${block.hidden ? "inactive" : ""}">
        <div class="tile-icon">
          <ha-icon icon=${section ? "mdi:view-grid-outline" : meta!.icon}></ha-icon>
        </div>
        <div class="tile-info">
          <div class="primary">
            <span>
              ${block.title || (section ? section.name || "Untitled section" : meta!.label)}
            </span>
          </div>
          ${secondary ? html`<div class="secondary"><span>${secondary}</span></div>` : nothing}
        </div>
        <button
          class="icon-button"
          title="Move up"
          .disabled=${index === 0}
          @click=${() => this._moveBlock(index, -1)}
        >
          <ha-icon icon="mdi:arrow-up"></ha-icon>
        </button>
        <button
          class="icon-button"
          title="Move down"
          .disabled=${index === total - 1}
          @click=${() => this._moveBlock(index, 1)}
        >
          <ha-icon icon="mdi:arrow-down"></ha-icon>
        </button>
        <button
          class="icon-button"
          title=${block.hidden ? "Show" : "Hide"}
          aria-pressed=${block.hidden ? "true" : "false"}
          @click=${() => this._toggleBlock(index)}
        >
          <ha-icon icon=${block.hidden ? "mdi:eye-off" : "mdi:eye"}></ha-icon>
        </button>
        <button
          class="icon-button"
          title=${open ? "Done" : "Edit"}
          @click=${() => {
            this._openSection = open ? null : index;
            if (!open) this._editing = null;
          }}
        >
          <ha-icon icon=${open ? "mdi:check" : "mdi:pencil"}></ha-icon>
        </button>
      </li>
    `;
  }

  /**
   * A block's own editor: a title for any of them, and for a section its name,
   * its buttons, and the way to be rid of it.
   */
  private _renderBlockBody(
    block: LayoutBlock,
    index: number,
  ): TemplateResult | typeof nothing {
    if (this._openSection !== index) return nothing;
    const section = block.type === "section" ? block : undefined;

    return html`
      <li class="form-host">
        <div class="form">
          <div class="fields">
            <!--
              A plain input, like every other field in this editor. ha-textfield
              is not a component this frontend defines, so it rendered as an
              inert unknown element and could not be typed in at all.
            -->
            <label class="field">
              <span>Title</span>
              <input
                type="text"
                .value=${block.title ?? ""}
                @change=${(event: Event) =>
                  this._setTitle(index, (event.target as HTMLInputElement).value.trim())}
              />
            </label>
            <div class="hint">A heading above this block. Empty for none.</div>

            ${section
              ? html`
                  <label class="field">
                    <span>Section name</span>
                    <input
                      type="text"
                      .value=${section.name ?? ""}
                      @change=${(event: Event) =>
                        this._renameSection(index, (event.target as HTMLInputElement).value)}
                    />
                  </label>
                  <div class="hint">
                    Names this row in the editor. It is also the heading when
                    “Section labels” is on under Advanced and no title is set.
                  </div>
                `
              : nothing}
          </div>

          ${section
            ? html`
                ${this._renderTileList(index, section.buttons, "No buttons yet.")}

                <div class="form-actions">
                  <button
                    class="control-button destructive"
                    @click=${() => this._removeSection(index)}
                  >
                    <ha-icon icon="mdi:delete"></ha-icon><span>Remove</span>
                  </button>
                  <button
                    class="control-button"
                    @click=${() =>
                      this._addTile(index, {
                        name: "New button",
                        icon: "mdi:power",
                        action: { action: "service", service: "" },
                      })}
                  >
                    <ha-icon icon="mdi:plus"></ha-icon><span>Add button</span>
                  </button>
                </div>
              `
            : nothing}
        </div>
      </li>
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
        .schema=${SCHEMA()}
        .computeLabel=${this._computeLabel}
        .computeHelper=${this._computeHelper}
        @value-changed=${this._formChanged}
      ></ha-form>

      <ha-expansion-panel outlined>
        <ha-icon slot="leading-icon" icon="mdi:view-dashboard-outline"></ha-icon>
        <div slot="header" role="heading" aria-level="3">Layout</div>

        <div class="content">
          <div class="hint">
            Everything on the card, in the order it is drawn, under the header.
            Move a row to move the block; hide one and it keeps its place for
            when you bring it back. Open a row to give the block a heading.
          </div>

          ${this._renderLayoutList()}

          <div class="form-actions add-section">
            <button class="control-button wide" @click=${() => this._addSection()}>
              <ha-icon icon="mdi:plus"></ha-icon><span>Add section</span>
            </button>
          </div>
        </div>
      </ha-expansion-panel>

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
          .schema=${APPS_SCHEMA}
          .computeLabel=${this._computeLabel}
          .computeHelper=${this._computeHelper}
          @value-changed=${this._formChanged}
        ></ha-form>


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
      /*
       * The parts stop insetting themselves; the panel and the block do it.
       *
       * Deliberately not the inline edit form: it is a surface of its own, like
       * a section block, so it keeps its 12px all the way round and only gives
       * up the outer margin -- which li.form-host .form has already zeroed.
       * Stripping its padding along with everyone else's put every field hard
       * against the tinted edge.
       */
      ha-expansion-panel .content .section-head,
      ha-expansion-panel .content ul.list,
      ha-expansion-panel .content .chips,
      ha-expansion-panel .content .hint,
      ha-expansion-panel .content .empty-state {
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
      ha-expansion-panel .content .empty-state {
        margin-bottom: 0;
        padding-bottom: 0;
      }
      ha-expansion-panel .content .form {
        margin: 0;
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
      /*
       * A row's name wraps rather than eliding. The kit ellipsises because a
       * card row is one line of a tile; here the name is the row's whole point,
       * and "Back / home / …" beside a generic icon told you nothing.
       */
      ul.list li.row .primary span {
        white-space: normal;
        overflow-wrap: anywhere;
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
