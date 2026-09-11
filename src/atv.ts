/**
 * Everything the card knows about an Android TV: how to find it, what it is
 * doing, and how to poke it.
 *
 * Kept separate from rendering, and pure apart from the service calls, so the
 * pairing and feature-masking rules can be tested without a DOM.
 *
 * Two facts about the `androidtv_remote` integration shape all of this, and
 * both were read out of the integration source rather than assumed:
 *
 *   1. Every device has a `remote` entity AND a `media_player` entity, on the
 *      same device. Their entity ids do not necessarily match — on the author's
 *      system `remote.gym_tv` pairs with `media_player.gym_tv_2` — so they are
 *      paired by device_id, never by string manipulation.
 *   2. The media_player supports neither SELECT_SOURCE nor VOLUME_SET. There is
 *      no source list to read apps from, and volume is step-only, which is why
 *      the card renders a volume *bar* and not a slider.
 */

import { isActionable, runAction, splitService, type ActionConfig } from "./actions";
import type { AppAction, ButtonId, ResolvedConfig, ServiceAction } from "./config";
import type { HassEntity, HomeAssistant } from "./kit/types";

/** MediaPlayerEntityFeature, the bits this card cares about. */
export const FEATURE = {
  PAUSE: 1,
  VOLUME_SET: 4,
  VOLUME_MUTE: 8,
  PREVIOUS_TRACK: 16,
  NEXT_TRACK: 32,
  TURN_ON: 128,
  TURN_OFF: 256,
  PLAY_MEDIA: 512,
  VOLUME_STEP: 1024,
  STOP: 4096,
  PLAY: 16384,
} as const;

/**
 * Key codes sent via `remote.send_command`. The integration passes commands
 * through unvalidated, so these are Android keycode names minus the KEYCODE_
 * prefix, exactly as v1 sent them.
 */
export const KEYS: Record<string, string> = {
  up: "DPAD_UP",
  down: "DPAD_DOWN",
  left: "DPAD_LEFT",
  right: "DPAD_RIGHT",
  center: "DPAD_CENTER",
  home: "HOME",
  back: "BACK",
  menu: "MENU",
  power: "POWER",
  // v1 sent MUTE, not VOLUME_MUTE. Keep it.
  volume_mute: "MUTE",
  volume_up: "VOLUME_UP",
  volume_down: "VOLUME_DOWN",
  play_pause: "MEDIA_PLAY_PAUSE",
  next: "MEDIA_NEXT",
  previous: "MEDIA_PREVIOUS",
  // No media_player equivalent: its only seek service takes an absolute
  // position, which a TV cannot report. These are always key codes.
  rewind: "MEDIA_REWIND",
  fast_forward: "MEDIA_FAST_FORWARD",
};

/** Anything after this prefix is typed into the focused field on the TV. */
const TEXT_PREFIX = "text:";

export interface DeviceState {
  remoteId: string;
  /** null when no media_player could be paired. */
  playerId: string | null;
  remote?: HassEntity;
  player?: HassEntity;
  /** The remote entity exists in the state machine. */
  found: boolean;
  /** Neither entity is `unavailable`. */
  available: boolean;
  on: boolean;
  name: string;
  appName?: string;
  /** Android package id of the running app, e.g. com.netflix.ninja. */
  appId?: string;
  /** Only meaningful for players that distinguish playing from paused. */
  playing: boolean;
  features: number;

  /** Entity the volume buttons act on: `volume_entity`, else the player. */
  volumeId: string | null;
  volumeFeatures: number;
  /**
   * 0..1, or undefined when nothing reports a level.
   *
   * androidtv_remote only sets volume_level when the TV reports a non-zero
   * `max` in its volume info. A TV passing audio to a soundbar over ARC
   * typically reports max 0, so there is no level and no mute state to read —
   * the card must not invent one.
   */
  volume?: number;
  /** undefined means "nobody knows", which is different from "not muted". */
  muted?: boolean;
}

/**
 * Find the media_player that belongs to the same device as the remote.
 *
 * Matched on device_id, and deliberately never guessed from the entity id — a
 * wrong guess would silently point the card at another room's TV, which is
 * worse than the degraded path. There is no override: the integration puts both
 * entities on one device, so the pairing is not ambiguous.
 */
export const resolvePlayer = (
  hass: HomeAssistant,
  config: ResolvedConfig,
): string | null => {
  const deviceId = hass.entities?.[config.entity]?.device_id;
  if (!deviceId) return null;

  for (const entry of Object.values(hass.entities ?? {})) {
    if (entry.device_id === deviceId && entry.entity_id.startsWith("media_player.")) {
      return entry.entity_id;
    }
  }
  return null;
};

const isUnavailable = (entity: HassEntity | undefined): boolean =>
  entity === undefined || entity.state === "unavailable" || entity.state === "unknown";

/** Read everything the card renders from, in one pass. */
export const readDevice = (
  hass: HomeAssistant,
  config: ResolvedConfig,
): DeviceState => {
  const remote = hass.states?.[config.entity];
  const playerId = resolvePlayer(hass, config);
  const player = playerId ? hass.states?.[playerId] : undefined;

  const playerAttrs = player?.attributes ?? {};
  const remoteAttrs = remote?.attributes ?? {};

  // Volume often lives somewhere else entirely: a soundbar or receiver on ARC,
  // which is also the case where the TV itself reports no volume info at all.
  const volumeId = config.volume_entity ?? playerId;
  const volumeEntity =
    config.volume_entity && config.volume_entity !== playerId
      ? hass.states?.[config.volume_entity]
      : player;
  const volumeAttrs = volumeEntity?.attributes ?? {};

  // The remote entity is the source of truth for power: it is the one the card
  // always has. The player is only consulted when it exists and is live.
  const on = player && !isUnavailable(player)
    ? player.state !== "off"
    : remote?.state === "on";

  return {
    remoteId: config.entity,
    playerId,
    remote,
    player,
    found: remote !== undefined,
    available: !isUnavailable(remote) && (player === undefined || !isUnavailable(player)),
    on,
    name:
      config.name ??
      (remoteAttrs["friendly_name"] as string | undefined) ??
      config.entity,
    // app_name is all the integration provides. It never sets media_title or
    // entity_picture, so there is no now-playing text or artwork to read.
    appName:
      (playerAttrs["app_name"] as string | undefined) ??
      (remoteAttrs["current_activity"] as string | undefined),
    appId: playerAttrs["app_id"] as string | undefined,
    playing: player?.state === "playing",
    features: (playerAttrs["supported_features"] as number | undefined) ?? 0,

    volumeId,
    volumeFeatures: (volumeAttrs["supported_features"] as number | undefined) ?? 0,
    volume:
      typeof volumeAttrs["volume_level"] === "number"
        ? (volumeAttrs["volume_level"] as number)
        : undefined,
    muted:
      typeof volumeAttrs["is_volume_muted"] === "boolean"
        ? (volumeAttrs["is_volume_muted"] as boolean)
        : undefined,
  };
};

/**
 * States that mean "this thing is not on".
 *
 * Everything else counts as on, which is what lets a tile track any domain
 * without being taught about it. Compared case-insensitively, and that matters:
 * a `select`'s state is the literal option name, so a Sofabaton activity sitting
 * on "Off" has to read as off while "Google TV" reads as on.
 */
const INACTIVE_STATES = new Set([
  "off",
  "unavailable",
  "unknown",
  "idle",
  "standby",
  "none",
]);

/**
 * Is the entity behind a tile currently on?
 *
 * False for a missing entity id, so a tile with nothing to track is never lit
 * rather than being shown as off — an IR command has no entity, and claiming to
 * know its state would be a lie.
 */
export const isActive = (hass: HomeAssistant, entity: string | undefined): boolean => {
  if (!entity) return false;
  const state = hass.states?.[entity]?.state;
  if (state === undefined) return false;
  return !INACTIVE_STATES.has(state.toLowerCase());
};

/** Does the paired player advertise this capability? */
export const can = (device: DeviceState, feature: number): boolean =>
  (device.features & feature) !== 0;

/** Same, for whatever entity the volume buttons act on. */
export const canVolume = (device: DeviceState, feature: number): boolean =>
  (device.volumeFeatures & feature) !== 0;

/**
 * Is there a real volume level to display?
 *
 * False for a TV that hands audio to a soundbar: it reports no level and no
 * mute state, so a bar or a percentage chip would be fiction. The buttons still
 * work — they send key codes — you just cannot see where the volume is.
 */
export const hasVolumeState = (device: DeviceState): boolean =>
  device.volume !== undefined;

/** The three buttons the volume row draws. */
const VOLUME_BUTTONS: ButtonId[] = ["volume_up", "volume_down", "volume_mute"];

/**
 * Does volume reach the speakers by some route other than the TV?
 *
 * It matters because a TV that is off still has a soundbar next to it: music
 * from a Chromecast, a turntable through the receiver, anything at all. When
 * volume is the TV's own, the keys go to a sleeping set and the row is dead
 * weight; when it is not, the row is the only way to turn the music down.
 *
 * Two configurations say so and the card can see both: `volume_entity` pointing
 * somewhere other than the paired player, and an override on any of the three
 * buttons, which is how an IR bridge is wired. The override test matches what
 * pressButton actually does — a tap_action it would run, not merely a key in
 * the map — so a button that only carries a hold_action does not count.
 */
export const hasExternalVolume = (
  config: ResolvedConfig,
  device: DeviceState,
): boolean =>
  (config.volume_entity !== undefined && config.volume_entity !== device.playerId) ||
  VOLUME_BUTTONS.some((button) => isActionable(config.overrides[button]?.tap_action));

const callService = (
  hass: HomeAssistant,
  action: ServiceAction,
): Promise<unknown> => {
  const parts = splitService(action.service);
  if (!parts) {
    return Promise.reject(
      new Error(`polr-android-tv-remote-card: invalid service "${action.service}"`),
    );
  }
  return hass.callService(parts[0], parts[1], action.data ?? {}, action.target);
};

/** Send a raw key code to the remote entity. */
export const sendKey = (
  hass: HomeAssistant,
  device: DeviceState,
  command: string,
): Promise<unknown> =>
  hass.callService("remote", "send_command", {
    entity_id: device.remoteId,
    command,
  });

/**
 * Type text on the TV.
 *
 * androidtvremote2 routes any command starting with "text:" to send_text(). It
 * lands only when a text field is focused on the TV and the config entry has
 * `enable_ime` — the card can detect neither, and the protocol gives no
 * acknowledgement, so this deliberately fails silently.
 */
export const sendText = (
  hass: HomeAssistant,
  device: DeviceState,
  text: string,
): Promise<unknown> => sendKey(hass, device, `${TEXT_PREFIX}${text}`);

/**
 * Press a button.
 *
 * An override always wins. Otherwise prefer the media_player when one is paired
 * and advertises the capability, because its optimistic state round-trips into
 * the card; fall back to a key code, which always works.
 */
export const pressButton = (
  hass: HomeAssistant,
  config: ResolvedConfig,
  device: DeviceState,
  button: ButtonId,
  node?: HTMLElement,
): Promise<unknown> => {
  const tap = config.overrides[button]?.tap_action;
  if (isActionable(tap)) {
    return runAction(node, hass, tap as ActionConfig, device.remoteId);
  }
  // An explicit `action: none` means the button is deliberately inert.
  if (tap && tap.action === "none") return Promise.resolve();

  const player = device.playerId;

  switch (button) {
    case "power":
      // v1 did nothing here without an override. Toggling is the obvious intent.
      if (player && can(device, device.on ? FEATURE.TURN_OFF : FEATURE.TURN_ON)) {
        return hass.callService(
          "media_player",
          device.on ? "turn_off" : "turn_on",
          { entity_id: player },
        );
      }
      return hass.callService("remote", device.on ? "turn_off" : "turn_on", {
        entity_id: device.remoteId,
      });

    case "play_pause":
      if (player && can(device, FEATURE.PAUSE)) {
        return hass.callService("media_player", "media_play_pause", {
          entity_id: player,
        });
      }
      break;

    case "next":
      if (player && can(device, FEATURE.NEXT_TRACK)) {
        return hass.callService("media_player", "media_next_track", {
          entity_id: player,
        });
      }
      break;

    case "previous":
      if (player && can(device, FEATURE.PREVIOUS_TRACK)) {
        return hass.callService("media_player", "media_previous_track", {
          entity_id: player,
        });
      }
      break;

    case "volume_up":
    case "volume_down":
      if (device.volumeId && canVolume(device, FEATURE.VOLUME_STEP)) {
        return hass.callService(
          "media_player",
          button === "volume_up" ? "volume_up" : "volume_down",
          { entity_id: device.volumeId },
        );
      }
      break;

    case "volume_mute":
      // media_player.volume_mute is absolute, not a toggle, so it can only be
      // used when the current mute state is actually known. A TV routing audio
      // to a soundbar reports none, and guessing "not muted" would mean every
      // press mutes and none ever unmutes. Fall through to the MUTE key, which
      // really is a toggle.
      if (device.volumeId && device.muted !== undefined && canVolume(device, FEATURE.VOLUME_MUTE)) {
        return hass.callService("media_player", "volume_mute", {
          entity_id: device.volumeId,
          is_volume_muted: !device.muted,
        });
      }
      break;

    default:
      break;
  }

  const key = KEYS[button];
  if (!key) return Promise.resolve();
  return sendKey(hass, device, key);
};

/** Launch an app tile. */
export const runAppAction = (
  hass: HomeAssistant,
  device: DeviceState,
  action: AppAction,
  node?: HTMLElement,
): Promise<unknown> => {
  switch (action.action) {
    case "activity":
      return hass.callService("remote", "turn_on", {
        entity_id: device.remoteId,
        activity: action.activity,
      });

    case "app":
      if (!device.playerId) {
        return Promise.reject(
          new Error(
            "polr-android-tv-remote-card: launching by app id needs the device's media_player, which was not found",
          ),
        );
      }
      return hass.callService("media_player", "play_media", {
        entity_id: device.playerId,
        media_content_type: "app",
        media_content_id: action.app_id,
      });

    case "key":
      return sendKey(hass, device, action.key);

    // v1's shape.
    case "service":
      return callService(hass, action);

    // Everything else is a Home Assistant action, run exactly as an override
    // would run it.
    default:
      return runAction(node, hass, action as ActionConfig, device.remoteId);
  }
};

/** A one-line human description of an action, for the editor's app list. */
export const describeAction = (action: AppAction): string => {
  switch (action.action) {
    case "activity":
      return `Launch ${action.activity}`;
    case "app":
      return `Open app ${action.app_id}`;
    case "key":
      return `Send ${action.key}`;
    case "service":
      return `Call ${action.service}`;
    case "perform-action":
      return `Call ${action.perform_action}`;
    case "call-service":
      return `Call ${action.service}`;
    case "navigate":
      return `Go to ${action.navigation_path}`;
    case "url":
      return `Open ${action.url_path}`;
    case "toggle":
      return "Toggle the TV";
    case "more-info":
      return "Show more info";
    case "none":
      return "Do nothing";
  }
};
