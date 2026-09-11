/**
 * The v2 config schema, and the layer that turns a v1 config into one.
 *
 * Kept free of `hass` and of lit so it is a pure function of YAML, which is what
 * makes it exhaustively unit-testable. That matters more here than anywhere else
 * in the card: v1 shipped in 2023 and people (including the author) still have
 * working dashboards written against it. Every row of the mapping table below
 * has a test in test/config.test.mjs.
 */

import {
  isActionConfig,
  serviceAction,
  splitService,
  type ActionConfig,
  type ButtonActions,
} from "./actions";

const PAD_STYLES = ["buttons", "dpad", "touchpad"] as const;
export type PadStyle = (typeof PAD_STYLES)[number];

export type BrandId =
  | "disneyplus"
  | "hbomax"
  | "hulu"
  | "netflix"
  | "prime"
  | "youtube";

/** Every button the card can render, and that `overrides` can redirect. */
export type ButtonId =
  | "up"
  | "down"
  | "left"
  | "right"
  | "center"
  | "power"
  | "home"
  | "back"
  | "menu"
  | "favorite"
  | "volume_up"
  | "volume_down"
  | "volume_mute"
  | "play_pause"
  | "next"
  | "previous"
  | "rewind"
  | "fast_forward";

/** An arbitrary service call — v1's `{service, data}` shape, kept intact. */
export interface ServiceAction {
  /** "domain.service" */
  service: string;
  data?: Record<string, unknown>;
  target?: Record<string, unknown>;
}

/**
 * How to "press" an entity, by domain.
 *
 * Lets an override be written as a bare entity id. IR bridges expose one entity
 * per command rather than a media_player — the Sofabaton X1S, for example, gives
 * button.<name>_volume_up / _volume_down / _volume_mute — so pointing three
 * buttons at three entities is the normal shape, and spelling out
 * `{service: button.press, target: {entity_id: ...}}` three times is noise.
 */
const PRESS_SERVICE: Record<string, string> = {
  button: "press",
  input_button: "press",
  scene: "turn_on",
  script: "turn_on",
  automation: "trigger",
};

/** Turn a bare entity id into the service call that presses it. */
export const entityAction = (entityId: string): ServiceAction | null => {
  const parts = splitService(entityId);
  if (!parts) return null;
  const service = PRESS_SERVICE[parts[0]];
  if (!service) return null;
  return { service: `${parts[0]}.${service}`, target: { entity_id: entityId } };
};

/** How an app tile launches. */
export type AppAction =
  /** remote.turn_on with `activity:` — a configured app name or a deep link. */
  | { action: "activity"; activity: string }
  /** media_player.play_media with media_content_type: app. */
  | { action: "app"; app_id: string }
  /** remote.send_command with a raw key code. */
  | { action: "key"; key: string }
  /**
   * Anything Home Assistant can do — the same vocabulary the button overrides
   * use, so the editor can offer HA's own interactions selector rather than a
   * bare service-name box that could not express data or a target.
   */
  | ActionConfig
  /** v1's shape. Still read; the editor writes `perform-action` instead. */
  | ({ action: "service" } & ServiceAction);

/** One tile: an app in the launcher, or a button in a custom section. */
export interface TileConfig {
  /** Tooltip and aria-label. Falls back to the action's target. */
  name?: string;
  /** "mdi:netflix" | "brand:netflix" | "/local/foo.png" | "https://…" */
  icon?: string;
  /** Overrides --tile-color for this tile only. */
  color?: string;
  /**
   * Entity whose state lights the tile.
   *
   * Optional, and absent for anything the card cannot see — an IR command has
   * no entity, so its tile is simply never lit rather than shown as off.
   */
  entity?: string;
  action: AppAction;
}

/** Apps are tiles too; the alias keeps the app-facing vocabulary intact. */
export type AppConfig = TileConfig;

/**
 * A named row of buttons.
 *
 * The app launcher is the built-in one. Everything else is user-defined, which
 * is what lets a card carry controls the remote itself has no concept of — an
 * AV receiver, a projector, a hub activity.
 */
interface SectionConfig {
  /** Shown only when `show_section_labels` is on, like the built-in sections. */
  name?: string;
  /** Buttons per row. Falls back to `app_columns`. */
  columns?: number;
  buttons: TileConfig[];
}

/**
 * The blocks a card stacks, in the order `layout` lists them.
 *
 * Ids name what the thing *is* on screen rather than the flag that used to
 * govern it: `navigation` is the back / home / menu row, `text` is the field
 * that types on the TV.
 */
const BLOCK_IDS = [
  "pad",
  "navigation",
  "transport",
  "volume",
  "text",
  "apps",
] as const;
export type BlockId = (typeof BLOCK_IDS)[number];

/**
 * One entry of `layout`: a built-in block, or a section of buttons.
 *
 * `hidden` rather than absence, because a hidden block still has a *place*.
 * Drop it from the list and turning it back on has to guess where it went --
 * the editor's eye toggle would rearrange the card behind the user's back.
 *
 * `title` draws a heading above the block, and does so because it is set:
 * a field that only takes effect once a switch two panels away is found is a
 * field that reads as broken. A section's `name` keeps its older behaviour --
 * shown only when `show_section_labels` is on -- so no card that predates this
 * suddenly sprouts headings.
 */
export type LayoutBlock =
  | { type: BlockId; hidden?: boolean; title?: string }
  | ({ type: "section"; hidden?: boolean; title?: string } & SectionConfig);

export interface PolrAtvRemoteCardConfig {
  type: string;
  /** The androidtv_remote `remote` entity. Required. */
  entity: string;
  /**
   * Entity the volume buttons drive. Point this at a soundbar or receiver when
   * the TV only passes audio through -- which is also the case where the TV
   * itself reports no volume level to display.
   */
  volume_entity?: string;
  /** Header title. Defaults to the entity's friendly name. */
  name?: string;

  show_header?: boolean;
  show_power?: boolean;
  show_nav?: boolean;
  pad?: PadStyle;
  show_transport?: boolean;
  /** Which transport buttons to draw. They always render in playback order. */
  transport_buttons?: ButtonId[];
  show_volume?: boolean;
  show_text_input?: boolean;
  show_apps?: boolean;
  show_section_labels?: boolean;

  apps?: AppConfig[];
  /**
   * Every block on the card, in the order they are drawn.
   *
   * Absent, the order is the one the card always had and the `show_*` flags
   * decide what appears in it. Present, it is the whole answer -- order and
   * visibility both -- and those flags are not consulted.
   */
  layout?: (BlockId | LayoutBlock)[];
  /**
   * User-defined rows of buttons, drawn before the app launcher.
   *
   * Superseded by `layout`, which can put them anywhere; still read when there
   * is no layout, which is every config written before there was one.
   */
  sections?: SectionConfig[];
  /** Most app buttons on one row before wrapping. */
  app_columns?: number;

  hold_repeat?: boolean;
  haptics?: boolean;
  /**
   * Redirect individual buttons. A value is any of:
   *
   *   - HA's standard interactions: {tap_action, hold_action, double_tap_action}
   *   - a bare entity id, for anything that can simply be pressed
   *   - v1's {service, data}, treated as a tap action
   */
  overrides?: Partial<Record<ButtonId, ButtonActions | ServiceAction | string>>;

  /** v1 keys are tolerated on input; see normalizeConfig. */
  [key: string]: unknown;
}

/** A config with every optional resolved. What render() consumes. */
export interface ResolvedConfig extends PolrAtvRemoteCardConfig {
  show_header: boolean;
  show_power: boolean;
  pad: PadStyle;
  transport_buttons: ButtonId[];
  show_section_labels: boolean;
  /*
   * show_nav / show_transport / show_volume / show_text_input / show_apps are
   * deliberately absent: they are input spellings, folded into `layout` at
   * resolution. Leaving them here as resolved values would leave a flag that
   * could disagree with the list, which is the bug this shape exists to stop.
   */
  show_favorite: boolean;
  apps: AppConfig[];
  /**
   * The card's blocks in order, every one of them, hidden or not.
   *
   * Resolution folds the `show_*` flags and `sections` into this, so render and
   * the editor read one list and nothing else: there is no second place a block
   * can come from, and no flag left that can disagree with it.
   */
  layout: LayoutBlock[];
  app_columns: number;
  hold_repeat: boolean;
  haptics: boolean;
  overrides: Partial<Record<ButtonId, ButtonActions>>;
}

export const DEFAULTS = {
  show_header: true,
  show_power: true,
  show_nav: true,
  pad: "buttons" as PadStyle,
  show_transport: true,
  transport_buttons: ["previous", "rewind", "play_pause", "fast_forward", "next"] as ButtonId[],
  show_volume: true,
  // Off by default: sending text needs a focused input on the TV *and*
  // `enable_ime` on the config entry, neither of which the card can detect.
  show_text_input: false,
  show_apps: true,
  show_section_labels: false,
  app_columns: 5,
  hold_repeat: true,
  haptics: true,
};

/**
 * The six brands v1 shipped as hand-pasted SVGs.
 *
 * `activity` values are copied verbatim from v1's `_press_*` methods — a
 * migrated config must launch exactly what it launched before. Note Hulu is the
 * odd one out: a bare app name rather than a URL, because that is what v1 sent.
 */
export const BRANDS: Record<BrandId, { label: string; activity: string }> = {
  disneyplus: { label: "Disney+", activity: "https://www.disneyplus.com" },
  hbomax: { label: "HBO Max", activity: "https://play.hbomax.com" },
  hulu: { label: "Hulu", activity: "HULU" },
  netflix: { label: "Netflix", activity: "https://www.netflix.com/title" },
  prime: { label: "Prime Video", activity: "https://app.primevideo.com" },
  youtube: { label: "YouTube", activity: "https://www.youtube.com" },
};

/** Brand ids, in the order the editor offers them. */
export const BRAND_IDS = Object.keys(BRANDS) as BrandId[];

/**
 * Names for the package ids an Android TV reports.
 *
 * `androidtv_remote` names an app only if you have named it yourself in the
 * integration's options; everything else comes through as its package id. So a
 * card that shows what the TV reports shows "com.netflix.ninja" on the header
 * of a TV that is plainly playing Netflix.
 *
 * This is the short list of what actually runs on an Android TV, not an
 * attempt at every app on the Play Store: anything missing keeps its id, which
 * is honest and still tells a determined user what to type into the
 * integration's own naming options.
 */
const APP_NAMES: Record<string, string> = {
  "com.netflix.ninja": "Netflix",
  "com.disney.disneyplus": "Disney+",
  "com.hulu.plus": "Hulu",
  "com.amazon.amazonvideo.livingroom": "Prime Video",
  "com.hbo.hbonow": "Max",
  "com.wbd.stream": "Max",
  "com.peacocktv.peacockandroid": "Peacock",
  "com.google.android.youtube.tv": "YouTube",
  "com.google.android.youtube.tvunplugged": "YouTube TV",
  "com.google.android.youtube.tvmusic": "YouTube Music",
  "com.apple.atve.androidtv.appletv": "Apple TV",
  "com.plexapp.android": "Plex",
  "com.spotify.tv.android": "Spotify",
  "tv.twitch.android.app": "Twitch",
  "com.espn.score_center": "ESPN",
  "com.cbs.ott": "Paramount+",
  "com.nba.game": "NBA",
  "com.google.android.tv.remote.service": "Home screen",
  // Both launchers Google ships, because "on the home screen" is a state
  // people look at the header to learn.
  "com.google.android.tvlauncher": "Home screen",
  "com.google.android.apps.tv.launcherx": "Home screen",
};

/** Shaped like a package id: dotted, unspaced, no capitals of its own. */
const isPackageId = (value: string): boolean => /^[a-z][\w]*(\.[\w]+)+$/.test(value);

/**
 * A name worth putting on the header for whatever the TV says is running.
 *
 * A package id is translated where the card knows it and left alone where it
 * does not -- a guess derived from the id itself ("Android" for
 * com.google.android.tv) would read as a name and be wrong, which is worse than
 * the id. Anything that is already a name is returned untouched.
 */
export const appLabel = (activity: string | undefined): string | undefined => {
  if (!activity || !isPackageId(activity)) return activity;
  const known = APP_NAMES[activity];
  if (known) return known;
  // The six bundled brands already match package ids -- it is how the header
  // finds a logo for one -- so the label agrees with the logo beside it.
  const brand = brandFor(activity);
  return brand ? BRANDS[brand].label : activity;
};

/**
 * Match an app name reported by the TV to one of the bundled brands.
 *
 * Deliberately loose: `app_name` is whatever the TV feels like calling the app
 * ("Disney+", "Prime Video"), so it is normalised to letters before comparing.
 * Returns undefined when nothing matches, which is the common case.
 *
 * Lives here rather than beside the logos because it is pure string matching --
 * keeping it out of the lit module means it can be tested without a DOM.
 */
export const brandFor = (name: string | undefined): BrandId | undefined => {
  if (!name) return undefined;
  const key = name.toLowerCase().replace(/[^a-z]/g, "");
  if (!key) return undefined;
  return BRAND_IDS.find((id) => key.includes(id) || id.includes(key));
};

/** v1 override key -> v2 ButtonId. Only three actually change name. */
const V1_OVERRIDE_KEYS: Record<string, ButtonId> = {
  up: "up",
  down: "down",
  left: "left",
  right: "right",
  center: "center",
  power: "power",
  home: "home",
  back: "back",
  favorite: "favorite",
  volumeup: "volume_up",
  volumedown: "volume_down",
  volumemute: "volume_mute",
};

/**
 * Keys from the unreleased `general-improvements` branch.
 *
 * That branch never shipped to HACS, but it was built and run locally -- the
 * author's own three dashboards are configured with these, not with v1's keys.
 * Anyone else who built from it is in the same position, so they migrate too.
 */
const BRANCH_KEYS: Record<string, keyof PolrAtvRemoteCardConfig> = {
  showRemote: "show_nav",
  showApps: "show_apps",
  showVolume: "show_volume",
  showMedia: "show_transport",
  showURLSearch: "show_text_input",
};

/** v1 `remote:` -> the v2 pad. */
const V1_PAD: Record<string, PadStyle> = {
  default: "buttons",
  touch: "touchpad",
  dpad: "dpad",
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isServiceAction = (value: unknown): value is ServiceAction =>
  isRecord(value) && typeof value["service"] === "string";

/**
 * Normalise any accepted override shape to HA interactions.
 *
 * Everything converges on {tap_action, hold_action, double_tap_action} so the
 * runtime has exactly one shape to handle, and the editor's ui_action selectors
 * have something to bind to whichever spelling was written.
 */
const toButtonActions = (value: unknown, label: string): ButtonActions | undefined => {
  // Shorthand: a bare entity id.
  if (typeof value === "string") {
    const action = entityAction(value);
    if (action) {
      return { tap_action: serviceAction(action.service, undefined, action.target) };
    }
    warnOnce(
      `override "${label}" points at ${value}, which cannot simply be pressed. ` +
        `Use an action config instead.`,
    );
    return undefined;
  }

  if (!isRecord(value)) {
    if (value !== undefined) {
      warnOnce(`override "${label}" is not an entity id or an action config`);
    }
    return undefined;
  }

  // Already interactions.
  if (
    isActionConfig(value["tap_action"]) ||
    isActionConfig(value["hold_action"]) ||
    isActionConfig(value["double_tap_action"])
  ) {
    const actions: ButtonActions = {};
    for (const key of ["tap_action", "hold_action", "double_tap_action"] as const) {
      const action = value[key];
      if (isActionConfig(action)) actions[key] = action as ActionConfig;
    }
    return actions;
  }

  // v1's {service, data, target}.
  if (isServiceAction(value)) {
    return {
      tap_action: serviceAction(
        value.service,
        isRecord(value.data) ? value.data : undefined,
        isRecord(value.target) ? value.target : undefined,
      ),
    };
  }

  warnOnce(`override "${label}" is not an entity id or an action config`);
  return undefined;
};

let warned = new Set<string>();

/** Warn once per message per page load; a card re-renders constantly. */
const warnOnce = (message: string): void => {
  if (warned.has(message)) return;
  warned.add(message);
  console.warn(`polr-android-tv-remote-card: ${message}`);
};

/** Test hook — the warn cache is module state. */
export const _resetWarnings = (): void => {
  warned = new Set();
};

/**
 * Normalise one section.
 *
 * Sections keep their shape even when empty. Emptiness is a *rendering*
 * decision, not a config one: dropping empty sections here deleted every
 * section the editor created, because "Add section" emits one with no buttons
 * yet and HA immediately hands the config back through setConfig -- so the
 * button appeared to do nothing at all. Malformed entries are still dropped.
 */
const normalizeSection = (entry: unknown): SectionConfig | null => {
  if (!isRecord(entry)) {
    warnOnce(`section is not an object and was skipped: ${JSON.stringify(entry)}`);
    return null;
  }
  const buttons = (Array.isArray(entry["buttons"]) ? entry["buttons"] : [])
    .map(normalizeApp)
    .filter((button): button is TileConfig => button !== null);
  return {
    ...(typeof entry["name"] === "string" ? { name: entry["name"] } : {}),
    ...(typeof entry["columns"] === "number" && entry["columns"] > 0
      ? { columns: entry["columns"] }
      : {}),
    buttons,
  };
};

const isBlockId = (value: unknown): value is BlockId =>
  typeof value === "string" && (BLOCK_IDS as readonly string[]).includes(value);

/** Normalise one entry of `layout`: an id, a `{type}`, or a section. */
const normalizeBlock = (entry: unknown): LayoutBlock | null => {
  if (isBlockId(entry)) return { type: entry };

  if (!isRecord(entry)) {
    warnOnce(`layout entry is not a block and was skipped: ${JSON.stringify(entry)}`);
    return null;
  }

  const hidden = entry["hidden"] === true ? { hidden: true as const } : {};
  const title =
    typeof entry["title"] === "string" && entry["title"]
      ? { title: entry["title"] }
      : {};
  const type = entry["type"];

  if (isBlockId(type)) return { type, ...hidden, ...title };

  // A section says so, or simply carries buttons -- which is what the `sections`
  // shape has always looked like, so one can be pasted straight into a layout.
  if (type === "section" || Array.isArray(entry["buttons"])) {
    const section = normalizeSection(entry);
    return section ? { type: "section", ...hidden, ...title, ...section } : null;
  }

  warnOnce(`unknown layout block ${JSON.stringify(entry)} was skipped`);
  return null;
};

/**
 * The card's blocks, in order, with every built-in accounted for.
 *
 * Two shapes come in and one goes out. Without a `layout` the order is the one
 * the card has always drawn and the `show_*` flags say what is hidden; with
 * one, the list is the order and anything it leaves out is hidden. Either way
 * every built-in block ends up in the result exactly once, because the editor
 * needs a row to toggle for the blocks that are currently off -- a list that
 * only holds what is visible cannot offer to bring anything back.
 */
const buildLayout = (
  raw: Record<string, unknown>,
  sections: SectionConfig[],
  visible: Record<BlockId, boolean>,
): LayoutBlock[] => {
  const blocks: LayoutBlock[] = Array.isArray(raw["layout"])
    ? raw["layout"]
        .map(normalizeBlock)
        .filter((block): block is LayoutBlock => block !== null)
    : [
        { type: "pad", ...(visible.pad ? {} : { hidden: true as const }) },
        { type: "navigation", ...(visible.navigation ? {} : { hidden: true as const }) },
        { type: "transport", ...(visible.transport ? {} : { hidden: true as const }) },
        { type: "volume", ...(visible.volume ? {} : { hidden: true as const }) },
        { type: "text", ...(visible.text ? {} : { hidden: true as const }) },
        ...sections.map((section): LayoutBlock => ({ type: "section", ...section })),
        { type: "apps", ...(visible.apps ? {} : { hidden: true as const }) },
      ];

  // A built-in the layout never mentions is hidden, and lands at the end so it
  // has somewhere to be turned back on from.
  const named = new Set(blocks.map((block) => block.type));
  const missing = BLOCK_IDS.filter((id) => !named.has(id)).map(
    (type): LayoutBlock => ({ type, hidden: true }),
  );

  // One of each: a layout naming a block twice would draw it twice, and the
  // editor's arrows would then swap rows that look identical.
  const seen = new Set<string>();
  return [...blocks, ...missing].filter((block) => {
    if (block.type === "section") return true;
    if (seen.has(block.type)) {
      warnOnce(`layout lists ${block.type} more than once; only the first is drawn`);
      return false;
    }
    seen.add(block.type);
    return true;
  });
};

/** Normalise one entry of `apps`, in either v1 or v2 shape. */
const normalizeApp = (entry: unknown): AppConfig | null => {
  // v1: a bare brand id.
  if (typeof entry === "string") {
    const brand = BRANDS[entry as BrandId];
    if (brand) {
      return {
        name: brand.label,
        icon: `brand:${entry}`,
        action: { action: "activity", activity: brand.activity },
      };
    }
    // v1 fell through to _render_custom() here and threw on app.icon. Treat an
    // unknown string as an activity rather than crashing the whole card.
    warnOnce(
      `unknown app "${entry}" — treating it as an activity. Use an object with an icon and action instead.`,
    );
    return {
      name: entry,
      icon: "mdi:application",
      action: { action: "activity", activity: entry },
    };
  }

  if (!isRecord(entry)) return null;

  // v2: already has an action object.
  if (isRecord(entry["action"])) {
    return entry as unknown as TileConfig;
  }

  const icon = typeof entry["icon"] === "string" ? entry["icon"] : undefined;
  const name = typeof entry["name"] === "string" ? entry["name"] : undefined;
  const color = typeof entry["color"] === "string" ? entry["color"] : undefined;
  const entity = typeof entry["entity"] === "string" ? entry["entity"] : undefined;

  // v1: {icon, service, data} — an arbitrary service call.
  if (isServiceAction(entry)) {
    return {
      ...(name ? { name } : {}),
      ...(icon ? { icon } : {}),
      ...(color ? { color } : {}),
      ...(entity ? { entity } : {}),
      action: {
        action: "service",
        service: entry.service,
        ...(isRecord(entry["data"]) ? { data: entry["data"] } : {}),
        ...(isRecord(entry["target"]) ? { target: entry["target"] } : {}),
      },
    };
  }

  // v1: {icon, url} — remote.turn_on with the url as the activity.
  if (typeof entry["url"] === "string") {
    return {
      ...(name ? { name } : {}),
      ...(icon ? { icon } : {}),
      ...(color ? { color } : {}),
      ...(entity ? { entity } : {}),
      action: { action: "activity", activity: entry["url"] },
    };
  }

  warnOnce(`app entry has no action, url or service and was skipped: ${JSON.stringify(entry)}`);
  return null;
};

/**
 * Turn any accepted config — v1 or v2 — into a fully-defaulted v2 config.
 *
 * Never mutates its input and never writes back to Lovelace: the card is
 * re-fed the original YAML on every edit, so a card that rewrote its own config
 * would fight the editor. The editor calls this too, and emits v2 on first
 * change, which is what actually migrates stored YAML — and only if the user
 * opens it.
 */
export const normalizeConfig = (raw: PolrAtvRemoteCardConfig): ResolvedConfig => {
  if (!isRecord(raw)) {
    throw new Error("polr-android-tv-remote-card: invalid configuration");
  }

  // v1 called this entity_id. HA's convention for a single-entity card is
  // `entity`, and every selector and editor assumes it.
  const entity =
    typeof raw.entity === "string"
      ? raw.entity
      : typeof raw["entity_id"] === "string"
        ? (raw["entity_id"] as string)
        : undefined;

  if (!entity) {
    throw new Error("polr-android-tv-remote-card: 'entity' is required");
  }

  // v1 shape: `remote: default|touch|dpad`.
  const legacyPad =
    typeof raw["remote"] === "string" ? V1_PAD[raw["remote"] as string] : undefined;
  if (typeof raw["remote"] === "string" && !legacyPad) {
    warnOnce(`unknown remote style "${raw["remote"]}" — falling back to ${DEFAULTS.pad}`);
  }

  const pad: PadStyle = PAD_STYLES.includes(raw.pad as PadStyle)
    ? (raw.pad as PadStyle)
    : (legacyPad ?? DEFAULTS.pad);

  // v1's `volume` boolean, defaulted to true when absent.
  const legacyVolume =
    typeof raw["volume"] === "boolean" ? (raw["volume"] as boolean) : undefined;

  const overrides: Partial<Record<ButtonId, ButtonActions>> = {};
  if (isRecord(raw.overrides)) {
    for (const [buttonId, value] of Object.entries(raw.overrides)) {
      const actions = toButtonActions(value, buttonId);
      if (actions) overrides[buttonId as ButtonId] = actions;
    }
  }
  for (const [v1Key, buttonId] of Object.entries(V1_OVERRIDE_KEYS)) {
    if (overrides[buttonId]) continue;
    const actions = toButtonActions(raw[v1Key], v1Key);
    if (actions) overrides[buttonId] = actions;
  }

  // Branch-era booleans, applied only where the v2 key is absent.
  const branch: Partial<Record<keyof PolrAtvRemoteCardConfig, boolean>> = {};
  for (const [branchKey, v2Key] of Object.entries(BRANCH_KEYS)) {
    if (typeof raw[branchKey] === "boolean") {
      branch[v2Key] = raw[branchKey] as boolean;
    }
  }
  // showBasic drove the back/home row, which is now unconditional. Nothing to
  // map it to, and nothing lost: the row is always drawn.

  const rawTransport = Array.isArray(raw.transport_buttons)
    ? raw.transport_buttons
    : Array.isArray(raw["media_controls"])
      ? (raw["media_controls"] as unknown[])
      : undefined;
  const transportButtons = rawTransport
    ? (rawTransport.filter(
        (button): button is ButtonId =>
          typeof button === "string" &&
          DEFAULTS.transport_buttons.includes(button as ButtonId),
      ))
    : DEFAULTS.transport_buttons;

  /**
   * Sections keep their shape even when empty.
   *
   * Emptiness is a *rendering* decision, not a config one. Dropping empty
   * sections here deleted every section the editor created, because "Add
   * section" emits one with no buttons yet and HA immediately hands the config
   * back through setConfig — so the button appeared to do nothing at all.
   *
   * Malformed entries are still dropped: a section that is not an object, and
   * individual buttons that fail to normalise. The card skips drawing a section
   * with no buttons, so nothing renders as an empty labelled row.
   */
  const sections = (Array.isArray(raw.sections) ? raw.sections : [])
    .map(normalizeSection)
    .filter((section): section is SectionConfig => section !== null);

  const rawApps = Array.isArray(raw.apps) ? raw.apps : [];
  const apps = rawApps
    .map(normalizeApp)
    .filter((app): app is AppConfig => app !== null);

  const pick = <T>(value: T | undefined, fallback: T): T =>
    value === undefined ? fallback : value;

  /*
   * The five visibility flags do not come out the other side.
   *
   * They are an input spelling and `layout` is what the card reads; handing
   * them back resolved would put one fact in two places. The editor spreads
   * this object into what it stores, so a flag surviving here is a flag written
   * back into YAML beside the layout that supersedes it.
   */
  const resolved = {
    ...raw,
    type: raw.type,
    entity,
    ...(typeof raw.volume_entity === "string"
      ? { volume_entity: raw.volume_entity }
      : {}),
    ...(typeof raw.name === "string" ? { name: raw.name } : {}),

    show_header: pick(raw.show_header, DEFAULTS.show_header),
    show_power: pick(raw.show_power, DEFAULTS.show_power),
    pad,
    transport_buttons: transportButtons,
    show_section_labels: pick(raw.show_section_labels, DEFAULTS.show_section_labels),


    // v1 always drew a favourite button on the default pad, and threw when it
    // had no override to call. Draw it only when it does something.
    show_favorite: overrides.favorite !== undefined,

    apps,
    layout: buildLayout(raw, sections, {
      pad: pick(raw.show_nav, branch.show_nav ?? DEFAULTS.show_nav),
      // The back / home / menu row has never had a flag: it was always drawn.
      // A layout can now hide it, which is the only way it ever goes away.
      navigation: true,
      transport: pick(
        raw.show_transport,
        branch.show_transport ?? DEFAULTS.show_transport,
      ),
      volume: pick(
        raw.show_volume,
        branch.show_volume ?? legacyVolume ?? DEFAULTS.show_volume,
      ),
      text: pick(raw.show_text_input, branch.show_text_input ?? DEFAULTS.show_text_input),
      apps: pick(raw.show_apps, branch.show_apps ?? DEFAULTS.show_apps),
    }),
    // "auto" was the v2-beta spelling, before the tiles became fixed-width.
    app_columns:
      typeof raw.app_columns === "number" && raw.app_columns > 0
        ? raw.app_columns
        : DEFAULTS.app_columns,
    hold_repeat: pick(raw.hold_repeat, DEFAULTS.hold_repeat),
    haptics: pick(raw.haptics, DEFAULTS.haptics),
    overrides,
  } as ResolvedConfig;

  for (const flag of FOLDED_FLAGS) delete (resolved as Record<string, unknown>)[flag];
  return resolved;
};

/** Input spellings that `layout` replaces, dropped once it is built. */
const FOLDED_FLAGS = [
  "show_nav",
  "show_transport",
  "show_volume",
  "show_text_input",
  "show_apps",
  "sections",
] as const;

/**
 * Strip keys that must never reach stored YAML: v1 spellings the editor has
 * just migrated, and `show_favorite`, which is derived from
 * `overrides.favorite` and would go stale the moment that override changed.
 */
export const stripLegacyKeys = (
  config: PolrAtvRemoteCardConfig,
): PolrAtvRemoteCardConfig => {
  const legacy = new Set([
    "entity_id",
    "remote",
    "volume",
    "show_favorite",
    // Removed in v2: back/home/menu is always there.
    "show_navigation_row",
    // Removed: the player is always the one on the remote's own device.
    "media_player_entity",
    "showBasic",
    "media_controls",
    ...Object.keys(BRANCH_KEYS),
    ...Object.keys(V1_OVERRIDE_KEYS),
  ]);
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(config)) {
    if (!legacy.has(key)) out[key] = value;
  }
  return out as PolrAtvRemoteCardConfig;
};
