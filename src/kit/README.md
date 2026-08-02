# card-kit

Shared building blocks for custom Lovelace cards in this workspace: Home
Assistant's **tile card design language**, transcribed from the frontend source
so cards look native rather than approximately native.

The kit is **copied** into each card (`src/kit/`), not linked. Card repos are
independent and must build standalone for HACS, so a path dependency on
`../../shared` would break them. `ha-dev new-card` copies it in; `ha-dev
sync-kit <project>` re-copies after the kit changes.

## Files

| File        | Contents                                                                 |
| ----------- | ------------------------------------------------------------------------ |
| `styles.ts` | `tileStyles` — the full stylesheet (tile row, buttons, list, form, chips) |
| `types.ts`  | HA frontend typings, `fireEvent`, `showMoreInfo`, `stateColor`, `relativeTime` |

## Where the numbers come from

Transcribed from `home-assistant/frontend@dev`:

| Source                                   | What it fixes                                                     |
| ---------------------------------------- | ----------------------------------------------------------------- |
| `src/components/tile/ha-tile-container.ts` | Content row: `min-height: 56px`, `padding: 0 10px`, `gap: 10px`  |
| `src/components/tile/ha-tile-icon.ts`      | 36px pill, colour at 0.2 opacity (0.35 hover), `--mdc-icon-size: 24px`, `scale(1.2)` on press |
| `src/components/tile/ha-tile-info.ts`      | Primary 14px/500/1.6/0.1px · Secondary 12px/400/1.2/0.4px        |
| `src/components/ha-control-button.ts`      | 40px tall, radius `md`, background 0.2 opacity, 8px padding      |
| `src/components/ha-control-button-group.ts`| 12px spacing between buttons                                     |
| `src/panels/lovelace/cards/hui-tile-card.ts` | `--tile-color` drives everything; `lock.jammed` pulses 1s       |
| `src/resources/theme/core.globals.ts`      | `--ha-space-N` = N×4px; radii sm 4 / md 8 / lg 12 / pill 9999    |
| `src/resources/theme/typography.globals.ts`| Font sizes xs 10 / s 12 / m 14 / l 16; weights 400 / 500 / 700   |

All transitions are **180ms ease-in-out**, matching the frontend.

### Two deliberate choices

- **HA's own components are not imported.** `ha-tile-icon`, `ha-control-button`
  and friends are lazily loaded by the frontend; a custom card that imports them
  can render blank depending on what the user has visited. Only `ha-card` and
  `ha-icon` are reliably defined, so the kit re-implements the rest with the same
  metrics. Every token is referenced with a literal fallback for the same reason.
- **Secondary text uses `--secondary-text-color`.** `ha-tile-info` defaults it to
  `--primary-text-color`; the dimmer value reads better in dense lists and is the
  conventional HA look.

## Using it

```ts
import { LitElement, html } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { tileStyles } from "./kit/styles";
import { showMoreInfo, stateColor, type HomeAssistant } from "./kit/types";

@customElement("my-card")
export class MyCard extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;
  @state() private _config?: { entity: string };

  static override styles = tileStyles;

  protected override render() {
    const stateObj = this.hass!.states[this._config!.entity];
    return html`
      <ha-card style=${`--tile-color: ${stateColor("light", stateObj.state)}`}>
        <div class="tile">
          <div class="tile-icon interactive" role="button" tabindex="0"
               @click=${() => showMoreInfo(this, this._config!.entity)}>
            <ha-icon icon="mdi:lightbulb"></ha-icon>
          </div>
          <div class="tile-info">
            <div class="primary"><span>${stateObj.attributes.friendly_name}</span></div>
            <div class="secondary"><span>${stateObj.state}</span></div>
          </div>
        </div>
        <div class="features">
          <button class="control-button">Toggle</button>
        </div>
      </ha-card>
    `;
  }
}
```

Set `--tile-color` on the `ha-card` and the icon, badges, focus rings and accent
buttons all follow it — exactly how `hui-tile-card` works.

## Class reference

**Layout**

| Class        | Use                                                        |
| ------------ | ---------------------------------------------------------- |
| `.tile`      | 56px content row: icon + info + trailing action            |
| `.tile-icon` | 36px circular icon; add `.interactive` for hover/press, `.pulse` to flash |
| `.tile-info` | Text column; children `.primary` / `.secondary`, each wrapping its text in a `<span>` for ellipsis |
| `.features`  | Horizontal control-button row with card-edge padding       |
| `.section-head` | Uppercase group label; `.count`, `.grow` helpers         |
| `ul.list` / `li.row` | Tile-height rows; `.row.empty` dashed, `.row.inactive` struck through |
| `.slot-badge`| Numeric badge styled like a tile icon                      |

**Controls**

| Class            | Use                                          |
| ---------------- | -------------------------------------------- |
| `.control-button`| 40px button; `.accent`, `.destructive`, `.wide` |
| `.icon-button`   | 40px square icon button; `.danger`           |
| `.spin`          | Rotating icon for in-flight actions          |

**Content**

| Class          | Use                                            |
| -------------- | ---------------------------------------------- |
| `.chips`/`.chip` | Metadata pills; `.accent`, `.warn`           |
| `.form`        | Inline editing panel; `.fields`, `.field`, `.check`, `.form-actions`, `.hint` |
| `.notice`      | `.error` / `.warn` banners with `.grow` body   |
| `.empty-state` | Centred placeholder text                       |
| `.skeleton`    | Shimmering 56px loading row                    |

The last element in the card gets bottom spacing automatically.
