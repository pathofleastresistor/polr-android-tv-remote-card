import { LitElement, html, css } from "lit";
import { property, query } from "lit/decorators.js";

class PoLRDpad extends LitElement {
    @property() _mc: any;
    @property() _hass: any;
    @property() up: any;

    render() {
        return html`
            <div class="dpad">
                <div class="slice">
                    <div id="top" class="slice-contents" @click=${this._top}>
                        top button
                    </div>
                </div>
                <div class="slice">
                    <div
                        id="right"
                        class="slice-contents"
                        @click=${this._right}>
                        click 2
                    </div>
                </div>
                <div class="slice">
                    <div id="down" class="slice-contents" @click=${this._down}>
                        click 3
                    </div>
                </div>
                <div class="slice">
                    <div id="left" class="slice-contents" @click=${this._left}>
                        click 4
                    </div>
                </div>
                <div
                    id="center"
                    class="inner-dpad"
                    @click=${this._center}></div>
            </div>
        `;
    }

    _top(ev) {
        this.dispatchEvent(new CustomEvent("clickup"));
    }
    _right(ev) {
        this.dispatchEvent(new CustomEvent("clickright"));
    }
    _left(ev) {
        this.dispatchEvent(new CustomEvent("clickleft"));
    }
    _down(ev) {
        this.dispatchEvent(new CustomEvent("clickdown"));
    }
    _center(ev) {
        this.dispatchEvent(new CustomEvent("clickcenter"));
    }

    static styles = css`
        .dpad {
            position: relative;
            margin: 0 auto;
            border: 2px
                var(--ha-card-border-color, var(--divider-color, #e0e0e0)) solid;
            padding: 0;
            width: 15em;
            height: 15em;
            border-radius: 50%;
            overflow: hidden;
        }

        .slice {
            overflow: hidden;
            position: absolute;
            top: 0;
            right: 0;
            width: 50%;
            height: 50%;
            transform-origin: 0% 100%;
            border: 2px
                var(--ha-card-border-color, var(--divider-color, #e0e0e0)) solid;
            box-sizing: border-box;
            cursor: pointer;
        }

        .slice-contents {
            position: absolute;
            left: -100%;
            width: 200%;
            height: 200%;
            border-radius: 50%;
        }

        .slice:nth-child(1) {
            transform: rotate(-45deg) scale(1.2);
        }
        .slice:nth-child(2) {
            transform: rotate(45deg) scale(1.2);
        }
        .slice:nth-child(3) {
            transform: rotate(135deg) scale(1.2);
        }
        .slice:nth-child(4) {
            transform: rotate(225deg) scale(1.2);
        }

        .slice:nth-child(1) .slice-contents,
        .slice:nth-child(2) .slice-contents,
        .slice:nth-child(3) .slice-contents {
            transform: skewY(-30deg);
            // background-color: #222222;
        }

        .slice:nth-child(4) .slice-contents {
            transform: skewY(-30deg);
        }

        .inner-dpad {
            position: absolute;
            width: 6em;
            height: 6em;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            border-radius: 50%;
            border: 4px
                var(--ha-card-border-color, var(--divider-color, #e0e0e0)) solid;
            background-color: #222222;
            cursor: pointer;
        }
    `;
}
customElements.define("polr-dpad", PoLRDpad);
