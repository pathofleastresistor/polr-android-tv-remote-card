import { LitElement, html, css } from "lit";
import { property, query } from "lit/decorators.js";
import "hammerjs";

class PoLRButton extends LitElement {
    @property() _hass: any;
    @property() icon: any;
    private _mc: any;
    @query("#remotebutton") remotebutton;

    connectedCallback() {
        super.connectedCallback();
        this._mc = new Hammer(this);
        this._mc.add(new Hammer.Tap());
        this._mc.add(new Hammer.Press({ time: 0 }));
        this._mc.on("tap", (ev) => {
            this.remotebutton.classList.remove("pressed");
        });
        this._mc.on("pressup", (ev) => {
            this.remotebutton.classList.remove("pressed");
        });
        this._mc.on("press", (ev) => {
            this.remotebutton.classList.add("pressed");
        });
    }

    disconnectedCallback(): void {
        super.disconnectedCallback();
        if (this._mc) {
            this._mc.destroy();
            this._mc = undefined;
        }
    }

    render() {
        return html` <div id="remotebutton">${this.icon}</div> `;
    }

    static styles = css`
        #remotebutton {
            display: flex;
            align-items: center;
            justify-content: center;
            justify-items: center;
            fill: var(--polr-fox-remote-button-fill, rgb(255, 255, 255));
            border-radius: 8px;
            background-color: var(
                --polr-fox-remote-button-background,
                rgba(111, 111, 111, 0.2)
            );
            cursor: pointer;
            height: var(--polr-fox-remote-icon-height, 40px);
            width: var(--polr-fox-remote-icon-width, 100%);
        }

        svg {
            height: var(--polr-fox-remote-icon-size, 21px);
            width: var(--polr-fox-remote-icon-size, 21px);
        }
        .pressed {
            transform: matrix(0.95, 0, 0, 0.95, 0, 0);
        }
    `;
}
customElements.define("polr-button", PoLRButton);
