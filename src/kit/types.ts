/**
 * Minimal Home Assistant frontend typings for custom cards.
 *
 * Hand-rolled rather than depending on `custom-card-helpers`, which lags behind
 * HA releases and drags in a second copy of lit.
 */

export interface HassEntity {
  entity_id: string;
  state: string;
  last_changed: string;
  last_updated: string;
  attributes: Record<string, any>;
}

/** Entity registry entry as exposed to the frontend. */
export interface HassEntityRegistryEntry {
  entity_id: string;
  /** Integration that provides the entity, e.g. "zwave_js". */
  platform: string;
  device_id?: string;
  area_id?: string;
}

/** Device registry entry as exposed to the frontend. */
export interface HassDeviceRegistryEntry {
  id: string;
  name?: string | null;
  name_by_user?: string | null;
  /** Integration-supplied maker; SimpleFIN puts the institution here. */
  manufacturer?: string | null;
  model?: string | null;
  area_id?: string | null;
}

export interface HassUser {
  id: string;
  name: string;
  is_admin: boolean;
  is_owner: boolean;
}

export interface ServiceCallResponse {
  context: { id: string };
  response?: unknown;
}

export interface HomeAssistant {
  states: Record<string, HassEntity>;
  entities: Record<string, HassEntityRegistryEntry>;
  devices: Record<string, HassDeviceRegistryEntry>;
  user?: HassUser;
  themes: unknown;
  language: string;
  locale: { language: string };
  localize: (key: string, ...args: any[]) => string;
  callService: (
    domain: string,
    service: string,
    data?: Record<string, unknown>,
    target?: Record<string, unknown>,
    notifyOnError?: boolean,
    returnResponse?: boolean,
  ) => Promise<ServiceCallResponse>;
  /** Raw websocket call — how cards reach APIs with no service, e.g. history. */
  callWS: <T>(msg: Record<string, unknown> & { type: string }) => Promise<T>;
}

export interface LovelaceCardConfig {
  type: string;
  [key: string]: unknown;
}

export interface LovelaceCard extends HTMLElement {
  hass?: HomeAssistant;
  setConfig(config: any): void;
  getCardSize(): number;
}

export interface LovelaceCardEditor extends HTMLElement {
  hass?: HomeAssistant;
  setConfig(config: any): void;
}

/** Dispatch a composed event, the way HA's own `fireEvent` helper does. */
export const fireEvent = <T>(
  node: HTMLElement,
  type: string,
  detail?: T,
): void => {
  node.dispatchEvent(
    new CustomEvent(type, { detail, bubbles: true, composed: true }),
  );
};

/** Open HA's more-info dialog for an entity. */
export const showMoreInfo = (node: HTMLElement, entityId: string): void =>
  fireEvent(node, "hass-more-info", { entityId });

/**
 * hui-tile-card drives its whole appearance from --tile-color. Domain state
 * colours follow HA's `--state-<domain>-<state>-color` theme variables.
 */
export const stateColor = (
  domain: string,
  state: string,
  fallback = "var(--state-inactive-color, #9e9e9e)",
): string => {
  if (state === "unavailable" || state === "unknown") {
    return "var(--state-unavailable-color, var(--disabled-color))";
  }
  return `var(--state-${domain}-${state}-color, var(--state-icon-color, ${fallback}))`;
};

/** Relative "2 minutes ago" using the viewer's locale. */
export const relativeTime = (iso: string | undefined, language = "en"): string => {
  if (!iso) return "";
  let value = (Date.parse(iso) - Date.now()) / 1000;
  const units: Array<[Intl.RelativeTimeFormatUnit, number]> = [
    ["second", 60],
    ["minute", 60],
    ["hour", 24],
    ["day", 7],
    ["week", 4.35],
    ["month", 12],
    ["year", Infinity],
  ];
  for (const [unit, size] of units) {
    if (Math.abs(value) < size) {
      return new Intl.RelativeTimeFormat(language, { numeric: "auto" }).format(
        Math.round(value),
        unit,
      );
    }
    value /= size;
  }
  return "";
};

declare global {
  interface Window {
    customCards?: Array<{
      type: string;
      name: string;
      description: string;
      preview?: boolean;
      documentationURL?: string;
    }>;
  }
}
