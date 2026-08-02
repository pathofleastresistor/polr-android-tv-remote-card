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
};

/** Anything after this prefix is typed into the focused field on the TV. */
export const TEXT_PREFIX = "text:";

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
  mediaTitle?: string;
  picture?: string;
  /** 0..1, or undefined when the device does not report it. */
  volume?: number;
  muted: boolean;
  /** Only meaningful for players that distinguish playing from paused. */
  playing: boolean;
  features: number;
  /** `activity_list` — the apps configured in the integration's options. */
  activities: string[];
}

/**
 * Find the media_player that belongs to the same device as the remote.
 *
 * Explicit config wins; otherwise match on device_id. Deliberately does NOT
 * fall back to guessing from the entity id — a wrong guess would silently point
 * the card at another room's TV, which is worse than the degraded path.
 */
export const resolvePlayer = (
  hass: HomeAssistant,
  config: ResolvedConfig,
): string | null => {
  if (config.media_player_entity) return config.media_player_entity;

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
    // app_name is all the real integration provides; `source` covers a player
    // from another integration pointed at by media_player_entity.
    appName:
      (playerAttrs["app_name"] as string | undefined) ??
      (playerAttrs["source"] as string | undefined) ??
      (remoteAttrs["current_activity"] as string | undefined),
    // Never set by androidtv_remote. Present only for other players.
    mediaTitle: playerAttrs["media_title"] as string | undefined,
    picture: playerAttrs["entity_picture"] as string | undefined,
    volume:
      typeof playerAttrs["volume_level"] === "number"
        ? (playerAttrs["volume_level"] as number)
        : undefined,
    muted: playerAttrs["is_volume_muted"] === true,
    playing: player?.state === "playing",
    features: (playerAttrs["supported_features"] as number | undefined) ?? 0,
    activities: Array.isArray(remoteAttrs["activity_list"])
      ? (remoteAttrs["activity_list"] as string[])
      : [],
  };
};

/** Does the paired player advertise this capability? */
export const can = (device: DeviceState, feature: number): boolean =>
  (device.features & feature) !== 0;

const callService = (
  hass: HomeAssistant,
  action: ServiceAction,
): Promise<unknown> => {
  const [domain, service] = action.service.split(".");
  if (!domain || !service) {
    return Promise.reject(
      new Error(`polr-android-tv-remote-card: invalid service "${action.service}"`),
    );
  }
  return hass.callService(domain, service, action.data ?? {}, action.target);
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
): Promise<unknown> => {
  const override = config.overrides[button];
  if (override) return callService(hass, override);

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
      if (player && can(device, FEATURE.VOLUME_STEP)) {
        return hass.callService(
          "media_player",
          button === "volume_up" ? "volume_up" : "volume_down",
          { entity_id: player },
        );
      }
      break;

    case "volume_mute":
      if (player && can(device, FEATURE.VOLUME_MUTE)) {
        return hass.callService("media_player", "volume_mute", {
          entity_id: player,
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
            "polr-android-tv-remote-card: launching by app id needs a media_player; set media_player_entity",
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

    case "service":
      return callService(hass, action);
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
  }
};
