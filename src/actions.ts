/**
 * Home Assistant's standard action config, as used by tile card features.
 *
 * Implemented here rather than imported: `handleAction` lives in the frontend
 * bundle and is not reachable from a custom card. The shapes and names follow
 * HA exactly, so the `ui_action` selector in the editor produces config this
 * understands, and anything written by hand behaves the way it does elsewhere.
 */

import { fireEvent, showMoreInfo, type HomeAssistant } from "./kit/types";

export type ActionConfig =
  | { action: "none" }
  | { action: "toggle" }
  | { action: "more-info"; entity?: string }
  | { action: "navigate"; navigation_path: string }
  | { action: "url"; url_path: string }
  | {
      action: "perform-action";
      perform_action: string;
      data?: Record<string, unknown>;
      target?: Record<string, unknown>;
    }
  /** Pre-2024.8 spelling of perform-action; still common in the wild. */
  | {
      action: "call-service";
      service: string;
      service_data?: Record<string, unknown>;
      data?: Record<string, unknown>;
      target?: Record<string, unknown>;
    };

/** The three interactions a control can carry. */
export interface ButtonActions {
  tap_action?: ActionConfig;
  hold_action?: ActionConfig;
  double_tap_action?: ActionConfig;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

export const isActionConfig = (value: unknown): value is ActionConfig =>
  isRecord(value) && typeof value["action"] === "string";

/** Does this config do anything? Used to decide whether to wire a handler. */
export const isActionable = (action: ActionConfig | undefined): boolean =>
  action !== undefined && action.action !== "none";

/** Build the action a `{service, data, target}` override means. */
export const serviceAction = (
  service: string,
  data?: Record<string, unknown>,
  target?: Record<string, unknown>,
): ActionConfig => ({
  action: "perform-action",
  perform_action: service,
  ...(data ? { data } : {}),
  ...(target ? { target } : {}),
});

/**
 * Perform one action.
 *
 * `fallbackEntity` stands in where the config omits one, matching HA: a bare
 * `more-info` or `toggle` acts on the card's own entity.
 */
export const runAction = (
  node: HTMLElement,
  hass: HomeAssistant,
  action: ActionConfig,
  fallbackEntity?: string,
): Promise<unknown> => {
  switch (action.action) {
    case "none":
      return Promise.resolve();

    case "more-info": {
      const entity = action.entity ?? fallbackEntity;
      if (entity) showMoreInfo(node, entity);
      return Promise.resolve();
    }

    case "toggle": {
      const entity = fallbackEntity;
      if (!entity) return Promise.resolve();
      return hass.callService("homeassistant", "toggle", { entity_id: entity });
    }

    case "navigate":
      history.pushState(null, "", action.navigation_path);
      // What HA's own navigate() does: the router listens on window, not on the
      // element, so this cannot go through fireEvent.
      window.dispatchEvent(
        new CustomEvent("location-changed", { detail: { replace: false } }),
      );
      return Promise.resolve();

    case "url":
      window.open(action.url_path, "_blank", "noreferrer");
      return Promise.resolve();

    case "perform-action":
    case "call-service": {
      const name =
        action.action === "perform-action" ? action.perform_action : action.service;
      const [domain, service] = (name ?? "").split(".");
      if (!domain || !service) {
        return Promise.reject(
          new Error(`polr-android-tv-remote-card: invalid action "${name}"`),
        );
      }
      const data =
        action.action === "perform-action"
          ? action.data
          : (action.data ?? action.service_data);
      return hass.callService(domain, service, data ?? {}, action.target);
    }
  }
};

/** Announce an interaction the way HA's own controls do. */
export const fireHaptic = (node: HTMLElement, kind = "light"): void =>
  fireEvent(node, "haptic", kind);
