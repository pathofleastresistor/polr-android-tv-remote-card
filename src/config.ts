/**
 * The v2 config schema, and the layer that turns a v1 config into one.
 *
 * Kept free of `hass` and of lit so it is a pure function of YAML, which is what
 * makes it exhaustively unit-testable. That matters more here than anywhere else
 * in the card: v1 shipped in 2023 and people (including the author) still have
 * working dashboards written against it. Every row of the mapping table below
 * has a test in test/config.test.mjs.
 */

export const PAD_STYLES = ["buttons", "dpad", "touchpad"] as const;
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
  | "previous";

/** An arbitrary service call — v1's `{service, data}` shape, kept intact. */
export interface ServiceAction {
  /** "domain.service" */
  service: string;
  data?: Record<string, unknown>;
  target?: Record<string, unknown>;
}

/** How an app tile launches. */
export type AppAction =
  /** remote.turn_on with `activity:` — a configured app name or a deep link. */
  | { action: "activity"; activity: string }
  /** media_player.play_media with media_content_type: app. */
  | { action: "app"; app_id: string }
  /** remote.send_command with a raw key code. */
  | { action: "key"; key: string }
  /** Anything else at all. */
  | ({ action: "service" } & ServiceAction);

export interface AppConfig {
  /** Tooltip and aria-label. Falls back to the action's target. */
  name?: string;
  /** "mdi:netflix" | "brand:netflix" | "/local/foo.png" | "https://…" */
  icon?: string;
  /** Overrides --tile-color for this tile only. */
  color?: string;
  action: AppAction;
}

export interface PolrAtvRemoteCardConfig {
  type: string;
  /** The androidtv_remote `remote` entity. Required. */
  entity: string;
  /** Paired media_player. Derived from the remote's device when omitted. */
  media_player_entity?: string;
  /** Header title. Defaults to the entity's friendly name. */
  name?: string;

  show_header?: boolean;
  show_power?: boolean;
  show_nav?: boolean;
  pad?: PadStyle;
  show_navigation_row?: boolean;
  show_transport?: boolean;
  show_volume?: boolean;
  show_text_input?: boolean;
  show_apps?: boolean;
  show_section_labels?: boolean;

  apps?: AppConfig[];
  app_columns?: number | "auto";

  hold_repeat?: boolean;
  haptics?: boolean;
  overrides?: Partial<Record<ButtonId, ServiceAction>>;

  /** v1 keys are tolerated on input; see normalizeConfig. */
  [key: string]: unknown;
}

/** A config with every optional resolved. What render() consumes. */
export interface ResolvedConfig extends PolrAtvRemoteCardConfig {
  show_header: boolean;
  show_power: boolean;
  show_nav: boolean;
  pad: PadStyle;
  show_navigation_row: boolean;
  show_transport: boolean;
  show_volume: boolean;
  show_text_input: boolean;
  show_apps: boolean;
  show_section_labels: boolean;
  show_favorite: boolean;
  apps: AppConfig[];
  app_columns: number | "auto";
  hold_repeat: boolean;
  haptics: boolean;
  overrides: Partial<Record<ButtonId, ServiceAction>>;
}

export const DEFAULTS = {
  show_header: true,
  show_power: true,
  show_nav: true,
  pad: "buttons" as PadStyle,
  show_navigation_row: true,
  show_transport: true,
  show_volume: true,
  // Off by default: sending text needs a focused input on the TV *and*
  // `enable_ime` on the config entry, neither of which the card can detect.
  show_text_input: false,
  show_apps: true,
  show_section_labels: false,
  app_columns: "auto" as number | "auto",
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

/** v1 `remote:` -> the v2 pad plus the section layout it implied. */
const V1_PAD: Record<string, { pad: PadStyle; navigation_row: boolean }> = {
  // v1's default pad inlined power/home/back/favorite into the 3x3 grid, so a
  // separate navigation row would duplicate them.
  default: { pad: "buttons", navigation_row: false },
  touch: { pad: "touchpad", navigation_row: true },
  dpad: { pad: "dpad", navigation_row: true },
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isServiceAction = (value: unknown): value is ServiceAction =>
  isRecord(value) && typeof value["service"] === "string";

let warned = new Set<string>();

/** Warn once per message per page load; a card re-renders constantly. */
const warnOnce = (message: string): void => {
  if (warned.has(message)) return;
  warned.add(message);
  // eslint-disable-next-line no-console
  console.warn(`polr-android-tv-remote-card: ${message}`);
};

/** Test hook — the warn cache is module state. */
export const _resetWarnings = (): void => {
  warned = new Set();
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
    return entry as unknown as AppConfig;
  }

  const icon = typeof entry["icon"] === "string" ? entry["icon"] : undefined;
  const name = typeof entry["name"] === "string" ? entry["name"] : undefined;
  const color = typeof entry["color"] === "string" ? entry["color"] : undefined;

  // v1: {icon, service, data} — an arbitrary service call.
  if (isServiceAction(entry)) {
    return {
      ...(name ? { name } : {}),
      ...(icon ? { icon } : {}),
      ...(color ? { color } : {}),
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
    : (legacyPad?.pad ?? DEFAULTS.pad);

  // v1's `volume` boolean, defaulted to true when absent.
  const legacyVolume =
    typeof raw["volume"] === "boolean" ? (raw["volume"] as boolean) : undefined;

  const overrides: Partial<Record<ButtonId, ServiceAction>> = {
    ...(isRecord(raw.overrides) ? (raw.overrides as Partial<Record<ButtonId, ServiceAction>>) : {}),
  };
  for (const [v1Key, buttonId] of Object.entries(V1_OVERRIDE_KEYS)) {
    if (overrides[buttonId]) continue;
    const value = raw[v1Key];
    if (isServiceAction(value)) {
      overrides[buttonId] = {
        service: value.service,
        ...(isRecord(value.data) ? { data: value.data } : {}),
        ...(isRecord(value.target) ? { target: value.target } : {}),
      };
    } else if (value !== undefined) {
      warnOnce(`override "${v1Key}" is not a {service, data} object and was ignored`);
    }
  }

  const rawApps = Array.isArray(raw.apps) ? raw.apps : [];
  const apps = rawApps
    .map(normalizeApp)
    .filter((app): app is AppConfig => app !== null);

  const pick = <T>(value: T | undefined, fallback: T): T =>
    value === undefined ? fallback : value;

  return {
    ...raw,
    type: raw.type,
    entity,
    ...(typeof raw.media_player_entity === "string"
      ? { media_player_entity: raw.media_player_entity }
      : {}),
    ...(typeof raw.name === "string" ? { name: raw.name } : {}),

    show_header: pick(raw.show_header, DEFAULTS.show_header),
    show_power: pick(raw.show_power, DEFAULTS.show_power),
    show_nav: pick(raw.show_nav, DEFAULTS.show_nav),
    pad,
    show_navigation_row: pick(
      raw.show_navigation_row,
      legacyPad ? legacyPad.navigation_row : DEFAULTS.show_navigation_row,
    ),
    show_transport: pick(raw.show_transport, DEFAULTS.show_transport),
    show_volume: pick(raw.show_volume, legacyVolume ?? DEFAULTS.show_volume),
    show_text_input: pick(raw.show_text_input, DEFAULTS.show_text_input),
    show_apps: pick(raw.show_apps, DEFAULTS.show_apps),
    show_section_labels: pick(raw.show_section_labels, DEFAULTS.show_section_labels),

    // v1 always drew a favourite button on the default pad, and threw when it
    // had no override to call. Draw it only when it does something.
    show_favorite: overrides.favorite !== undefined,

    apps,
    app_columns: pick(raw.app_columns, DEFAULTS.app_columns),
    hold_repeat: pick(raw.hold_repeat, DEFAULTS.hold_repeat),
    haptics: pick(raw.haptics, DEFAULTS.haptics),
    overrides,
  };
};

/** Strip v1-only keys, for the editor's first write-back. */
export const stripLegacyKeys = (
  config: PolrAtvRemoteCardConfig,
): PolrAtvRemoteCardConfig => {
  const legacy = new Set(["entity_id", "remote", "volume", ...Object.keys(V1_OVERRIDE_KEYS)]);
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(config)) {
    if (!legacy.has(key)) out[key] = value;
  }
  return out as PolrAtvRemoteCardConfig;
};
