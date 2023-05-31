import {
  LitElement,
  html,
  css,
} from "https://unpkg.com/lit-element@3.3.2/lit-element.js?module";

class PolrAndroidTvRemoteCard extends LitElement {
  static getConfigElement() {
    return document.createElement("polr-android-tv-remote-card-editor");
  }

  static getStubConfig() {
    return {};
  }

  static get properties() {
    return {
      _hass: {},
      _config: {},
    };
  }

  constructor() {
    super();
    this.active = false;
    this.currentX = 0;
    this.currentY = 0;
    this.initialX;
    this.initialY;
    this._dragItem;
  }

  setConfig(config) {
    if (!config.entity_id) {
      throw new Error("entity_id must be specified");
    }
    this._entity_id = config["entity_id"];

    this._remote = config["remote"] || "default";

    this._apps = "apps" in config;
    if (this._apps) {
      this._disneyplus = config.apps.includes("disneyplus");
      this._hbomax = config.apps.includes("hbomax");
      this._hulu = config.apps.includes("hulu");
      this._netflix = config.apps.includes("netflix");
      this._prime = config.apps.includes("prime");
      this._youtube = config.apps.includes("youtube");
    }

    this._power_action = config.power_action;
  }

  set hass(hass) {
    this._hass = hass;
  }

  firstUpdated() {
    this._touchpad = this.renderRoot.querySelector("#touchpad");
    this._dragItem = this.renderRoot.querySelector("#nub");
  }

  _dragStart(e) {
    e.preventDefault();
    if (e.type === "touchstart") {
      this.initialX = e.touches[0].clientX;
      this.initialY = e.touches[0].clientY;
    } else {
      this.initialX = e.clientX;
      this.initialY = e.clientY;
    }

    if (e.target === this._dragItem) {
      this.active = true;
    }
  }

  _dragEnd(e) {
    this._setTranslate(0, 0, this._dragItem, "0.5s");
    this.active = false;
    let x = this.currentX / this._touchpad.offsetWidth;
    let y = this.currentY / this._touchpad.offsetHeight;

    this.currentX = 0;
    this.currentY = 0;

    console.log(x, y);
    if (Math.abs(x) < 0.01 && Math.abs(y) < 0.01) {
      this._press_center();
      return;
    }
    if (Math.abs(x) >= Math.abs(y)) {
      x < 0 ? this._press_left() : this._press_right();
    } else {
      y < 0 ? this._press_up() : this._press_down();
    }
  }

  _drag(e) {
    if (this.active) {
      e.preventDefault();
      if (e.type === "touchmove") {
        this.currentX = e.touches[0].clientX - this.initialX;
        this.currentY = e.touches[0].clientY - this.initialY;
      } else {
        this.currentX = e.clientX - this.initialX;
        this.currentY = e.clientY - this.initialY;
      }
      this._setTranslate(this.currentX, this.currentY, this._dragItem, "0s");
    }
  }

  _setTranslate(xPos, yPos, el, duration) {
    el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
    el.style.transitionDuration = duration;
  }

  render() {
    return html`
      <div class="card-content">
        <div class="grid card-grid">
          ${this._remote == "default" ? this._render_defaultpad() : ``}
          ${this._remote == "touch" ? this._render_touchpad() : ``}
          ${this._remote == "dpad" ? this._render_dpad() : ``}
          ${this._apps ? this._render_apps() : ``}
          <div class="grid volume-grid">
            <div @click=${this._press_volume_down} class="remote-button">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
              >
                <title>volume-minus</title>
                <path d="M3,9H7L12,4V20L7,15H3V9M14,11H22V13H14V11Z" />
              </svg>
            </div>
            <div @click=${this._press_volume_mute} class="remote-button">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
              >
                <title>volume-mute</title>
                <path
                  d="M3,9H7L12,4V20L7,15H3V9M16.59,12L14,9.41L15.41,8L18,10.59L20.59,8L22,9.41L19.41,12L22,14.59L20.59,16L18,13.41L15.41,16L14,14.59L16.59,12Z"
                />
              </svg>
            </div>
            <div @click=${this._press_volume_up} class="remote-button">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="48"
                height="48"
                viewBox="0 0 24 24"
              >
                <title>volume-plus</title>
                <path
                  d="M3,9H7L12,4V20L7,15H3V9M14,11H17V8H19V11H22V13H19V16H17V13H14V11Z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  _render_dpad() {
    return html`
      <div class="pie">
        <div class="slice">
          <div id="top" class="slice-contents" @click=${this._press_up}>
            top button
          </div>
        </div>
        <div class="slice">
          <div id="right" class="slice-contents" @click=${this._press_right}>
            click 2
          </div>
        </div>
        <div class="slice">
          <div id="down" class="slice-contents" @click=${this._press_down}>
            click 3
          </div>
        </div>
        <div class="slice">
          <div id="left" class="slice-contents" @click=${this._press_left}>
            click 4
          </div>
        </div>
        <div id="center" class="inner-pie" @click=${this._press_center}></div>
      </div>
    `;
  }

  _render_defaultpad() {
    return html`
      <div class="grid remote-grid">
        <div @click=${this._press_power} class="remote-button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
          >
            <path
              d="M16.56,5.44L15.11,6.89C16.84,7.94 18,9.83 18,12A6,6 0 0,1 12,18A6,6 0 0,1 6,12C6,9.83 7.16,7.94 8.88,6.88L7.44,5.44C5.36,6.88 4,9.28 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12C20,9.28 18.64,6.88 16.56,5.44M13,3H11V13H13"
            />
          </svg>
        </div>
        <div @click=${this._press_up} class="remote-button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
          >
            <path d="M7,15L12,10L17,15H7Z" />
          </svg>
        </div>
        <div @click=${this._press_home} class="remote-button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
          >
            <path d="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z" />
          </svg>
        </div>
        <div @click=${this._press_left} class="remote-button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
          >
            <path d="M14,7L9,12L14,17V7Z" />
          </svg>
        </div>
        <div @click=${this._press_center} class="center remote-button"></div>
        <div @click=${this._press_right} class="remote-button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
          >
            <path d="M10,17L15,12L10,7V17Z" />
          </svg>
        </div>
        <div @click=${this._press_back} class="remote-button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
          >
            <path
              d="M13.5 21H6V17H13.5C15.43 17 17 15.43 17 13.5S15.43 10 13.5 10H11V14L4 8L11 2V6H13.5C17.64 6 21 9.36 21 13.5S17.64 21 13.5 21Z"
            />
          </svg>
        </div>
        <div @click=${this._press_down} class="remote-button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
          >
            <path d="M7,10L12,15L17,10H7Z" />
          </svg>
        </div>
        <div @click=${this._press_favorite_2} class="remote-button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
          >
            <path
              d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"
            />
          </svg>
        </div>
      </div>
    `;
  }
  _render_touchpad() {
    return html`
      <div id="touchpad">
        <div
          @mousedown=${this._dragStart}
          @mousemove=${this._drag}
          @mouseup=${this._dragEnd}
          @touchstart=${this._dragStart}
          @touchmove=${this._drag}
          @touchend=${this._dragEnd}
          id="nub"
        ></div>
      </div>
    `;
  }

  _render_disneyplus() {
    if (this._disneyplus) {
      return html`
        <div @click=${this._press_disney_plus} class="remote-button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
          >
            <path
              d="M2.056 6.834C1.572 6.834 1 6.77 1 6.483c0-2.023 3.562-2.11 5.08-2.11 1.978 0 4.506.614 6.66 1.384 3.277 1.188 9.917 5.145 9.917 9.674 0 4.001-4.31 5.914-8.311 5.914a22.376 22.376 0 0 1-3.21-.33c-.066.243-.11.418-.264.924-.253.052-.511.081-.77.087l-.505-.043c-.33-.396-.44-1.033-.572-1.715-2-1.165-3.298-2.155-3.891-2.836-.506-.528-1.078-1.232-1.078-1.913 0-.351.22-.66.726-1.01 1.034-.77 2.352-1.188 4.507-1.563l.044-.9c.022-.22.242-2.573.748-3.013.813.66.901 1.341.967 2.353.022.44.044.901.11 1.385h.308c1.539 0 6.244.395 6.244 2.616 0 .528-.77 1.517-1.518 1.517a1.9 1.9 0 0 1-.966-.285c.329-.375.813-.704.945-.99-.44-.528-2.814-1.143-4.551-1.143a4.043 4.043 0 0 0-.572.022l.022 4.815c.703.44 1.561.483 2.11.483 2.42 0 7.431-.417 7.431-4.331 0-3.87-4.946-6.86-8.64-8.266a21.394 21.394 0 0 0-7.937-1.496 7.22 7.22 0 0 0-1.803.198c-.373.088-.505.176-.505.264 0 .153.747.242.836.286a.221.221 0 0 1 .11.175.26.26 0 0 1-.088.176c-.089 0-.286.022-.528.022zM9.2 14.551c-2.176.177-4.595.397-4.595 1.166 0 .594 1.012 1.32 1.627 1.781a7.052 7.052 0 0 0 2.77 1.319zm11.155-9.85c-.02.428-.042.942-.042 1.723 0 .3 0 .642.01 1.027-.042.193-.32.214-.46.278a1.148 1.148 0 0 1-.256-.192V4.83c0-.29.01-.588.01-1.038 0-.225 0-.482-.01-.792 0-.192.032-.374.15-.802a.342.342 0 0 1 .3-.224c.245.064.491.17.577.374-.257.76-.235 1.594-.279 2.353zm-.384-.085c.428.021.941.042 1.722.042.3 0 .643 0 1.027-.01.193.041.215.32.279.459-.052.094-.116.18-.193.257H20.1c-.289 0-.589-.01-1.037-.01-.225 0-.482 0-.792.01-.193.002-.375-.03-.803-.149a.346.346 0 0 1-.225-.299c.064-.246.172-.492.374-.578.76.257 1.595.235 2.355.278z"
            />
          </svg>
        </div>
      `;
    } else {
      return html``;
    }
  }

  _render_hbomax() {
    if (this._hbomax) {
      return html`
        <div @click=${this._press_hbo_max} class="remote-button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
          >
            <path
              d="M8.844 4.249h3.205a2.013 2.013 0 0 1 1.848 1.876c1.607-3.368 6.667-2.217 6.658 1.515.045 3.744-5.026 4.939-6.658 1.568a2.077 2.077 0 0 1-2.07 1.947H8.845Zm-5.395 0h1.92v2.58h1.213V4.253H8.46v6.902H6.586V8.48H5.373v2.676H3.449ZM9.872 19.83h-.576a.603.603 0 0 1-.6-.57c0-.013-.007-.023-.007-.035v-3.667a1.192 1.192 0 0 0-1.279-1.21 1.192 1.192 0 0 0-1.279 1.211v4.167a.103.103 0 0 1-.102.103h-.575a.61.61 0 0 1-.61-.611v-3.666a1.319 1.319 0 0 0-.066-.296 1.176 1.176 0 0 0-1.213-.913 1.19 1.19 0 0 0-1.183.817c-.05.131-.079.267-.087.406v4.17a.104.104 0 0 1-.104.102h-.579a.61.61 0 0 1-.61-.61V15.56a2.322 2.322 0 0 1 1.68-2.32c.285-.088.584-.133.883-.133a2.584 2.584 0 0 1 1.92.752 2.588 2.588 0 0 1 1.921-.752 2.608 2.608 0 0 1 1.872.715c.451.465.7 1.09.692 1.738v4.171a.103.103 0 0 1-.098.103zm.428-3.35a3.76 3.76 0 0 1 .568-2.102c.133-.2.29-.38.47-.539a2.958 2.958 0 0 1 2.013-.744 3.014 3.014 0 0 1 1.845.59.61.61 0 0 1 .597-.48h.574a.107.107 0 0 1 .105.103v6.427a.104.104 0 0 1-.104.103h-.573a.61.61 0 0 1-.612-.553c-2.16 1.55-5.14-.164-4.887-2.811Zm12.623 3.35h-.977a.813.813 0 0 1-.675-.357l-1.079-1.6a.356.356 0 0 0-.588 0l-1.08 1.6a.825.825 0 0 1-.245.22.803.803 0 0 1-.43.137h-.978a.075.075 0 0 1-.063-.121l1.18-1.752.744-1.1a.61.61 0 0 0 0-.682l-.05-.075-1.872-2.773a.077.077 0 0 1 .062-.121h.978a.813.813 0 0 1 .674.36l.826 1.221.254.376a.355.355 0 0 0 .59 0l1.08-1.597a.82.82 0 0 1 .673-.36h.978a.077.077 0 0 1 .06.122l-1.925 2.855a.61.61 0 0 0 0 .682l1.929 2.853a.076.076 0 0 1-.066.116zM17.068 9.403c1.567.002 2.356-1.89 1.25-3-1.103-1.11-3-.33-3.003 1.237A1.756 1.756 0 0 0 17.068 9.4zm0-3.14c1.23.003 1.843 1.493.97 2.36-.872.866-2.358.246-2.354-.983a1.38 1.38 0 0 1 1.38-1.378zm-3.719 8.1a1.77 1.77 0 0 0-1.783 1.63 3.15 3.15 0 0 0-.037.489 1.867 1.867 0 0 0 1.82 2.123 1.696 1.696 0 0 0 1.455-.764c.253-.407.381-.88.367-1.36a1.867 1.867 0 0 0-1.822-2.118zm.227-6.191a2.976 2.976 0 0 1 0-.954 1.475 1.475 0 0 1-.723.422c.29.096.544.283.722.533zm-1.486.785a.548.548 0 0 0-.5-.577h-.954v1.17h.954a.553.553 0 0 0 .5-.593zm0-2.595a.55.55 0 0 0-.5-.577h-.954V6.94h.954a.548.548 0 0 0 .5-.578z"
            />
          </svg>
        </div>
      `;
    } else {
      return html``;
    }
  }

  _render_hulu() {
    if (this._hulu) {
      return html`
        <div @click=${this._press_hulu} class="remote-button">
          <svg
            width="48px"
            height="48px"
            viewBox="0 0 24 24"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
          >
            <path
              d="m 14.248,8.7019997 h 1.59 V 15.298 h -1.59 z M 5.143,10.764 H 4.124 a 1.4,1.4 0 0 0 -0.36,0.037 C 3.673,10.826 3.615,10.843 3.59,10.851 V 8.7 H 2 v 6.6 h 1.59 v -2.66 a 0.428,0.428 0 0 1 0.124,-0.3 0.4,0.4 0 0 1 0.3,-0.13 h 0.92 a 0.446,0.446 0 0 1 0.435,0.435 V 15.3 h 1.575 v -2.871 a 1.53,1.53 0 0 0 -0.5,-1.261 2,2 0 0 0 -1.301,-0.404 z m 15.267,0 v 2.658 a 0.423,0.423 0 0 1 -0.422,0.423 h -0.932 a 0.423,0.423 0 0 1 -0.422,-0.423 v -2.658 h -1.59 v 2.783 a 1.679,1.679 0 0 0 0.49,1.3 1.874,1.874 0 0 0 1.323,0.453 H 20.41 A 1.47,1.47 0 0 0 21.571,14.816 1.842,1.842 0 0 0 22,13.547 v -2.783 z m -8.957,2.658 a 0.4,0.4 0 0 1 -0.13,0.3 0.43,0.43 0 0 1 -0.3,0.124 H 10.1 A 0.423,0.423 0 0 1 9.678,13.423 V 10.764 H 8.087 v 2.783 a 1.676,1.676 0 0 0 0.491,1.3 1.855,1.855 0 0 0 1.31,0.453 h 1.565 a 1.473,1.473 0 0 0 1.162,-0.484 1.842,1.842 0 0 0 0.429,-1.267 v -2.785 h -1.591 z"
            />
          </svg>
        </div>
      `;
    }
  }

  _render_netflix() {
    if (this._netflix) {
      return html`
        <div @click=${this._press_netflix} class="remote-button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xml:space="preserve"
            width="48"
            height="48"
            version="1.0"
            viewBox="0 0 24 24"
          >
            <path
              d="M5.94 1v10.994c0 6.045.006 10.996.014 11.004.01.01.382-.029.834-.078a73.701 73.701 0 0 1 1.383-.139 80.63 80.628 0 0 1 2.06-.133c.05 0 .052-.246.058-4.655l.01-4.645.34.964c1.406 3.979 1.77 5.004 2.166 6.117v.002l.206.581.575 1.624c.003.003.292.02.642.038a48.332 48.33 0 0 1 3.37.29c.12.014.227.024.307.03.038.002.044 0 .067 0 .023 0 .062.003.067 0h.006c.003 0 .003-.967.005-1.382l.002-.435c.007-1.783.01-4.836.007-9.181l-.01-10.979h-4.311L13.73 5.88l-.01 4.859v.003l-.398-1.13V9.61v.002l-2.04-5.765v-.013l-.177-.501c-.422-1.195-.781-2.205-.795-2.251L10.28 1H8.107Z"
            />
          </svg>
        </div>
      `;
    } else {
      return html``;
    }
  }

  _render_prime() {
    if (this._prime) {
      return html`
        <div @click=${this._press_prime_video} class="remote-button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
          >
            <path
              d="M20.182 5.404a4.05 4.05 0 0 0 .625.05 1.116 1.116 0 0 0 .342-.03.474.474 0 0 0 .404-.306.605.605 0 0 0 .015-.276.4.4 0 0 0-.243-.334.88.88 0 0 0-.281-.064.791.791 0 0 0-.833.499 1.438 1.438 0 0 0-.102.367c-.006.088-.006.088.073.094zm-1.074-.4a1.808 1.808 0 0 1 1.633-1.359 2.38 2.38 0 0 1 1.057.102c.655.224 1.009.932.794 1.59a.986.986 0 0 1-.489.588 1.986 1.986 0 0 1-.66.211 3.534 3.534 0 0 1-1.207-.016 1.221 1.221 0 0 0-.146-.023.88.88 0 0 0 .716.954 2.58 2.58 0 0 0 .995 0c.154-.033.302-.065.456-.102.154-.036.218.012.218.17v.392a.242.242 0 0 1-.18.26 3.082 3.082 0 0 1-.626.17 3.247 3.247 0 0 1-1.214-.01 1.663 1.663 0 0 1-1.36-1.272 2.935 2.935 0 0 1 .016-1.656zm.317 6.367a2.588 2.588 0 0 1 1.012.039 1.936 1.936 0 0 1 1.41 1.635v.011h-.014v.1a.078.078 0 0 0 .024.08v-.021l.007.01v.61l-.012.021v-.01c-.03.02-.02.047-.02.08V14c-.048.9-.747 1.63-1.644 1.717a2.627 2.627 0 0 1-.998-.052 1.694 1.694 0 0 1-1.246-1.114 2.825 2.825 0 0 1 0-2.005c.219-.65.8-1.11 1.482-1.175zM12 3.946c0-.043.006-.086.016-.127a.156.156 0 0 1 .147-.102h.67a.19.19 0 0 1 .184.147c.028.075.044.147.07.223.053 0 .086-.036.122-.057a2.743 2.743 0 0 1 .946-.398 1.962 1.962 0 0 1 .795 0c.25.054.47.202.615.413a.25.25 0 0 0 .03.038v.014c.132-.079.271-.164.415-.237a2.382 2.382 0 0 1 1.203-.266 1.061 1.061 0 0 1 1.095 1.027v2.964c0 .238-.03.27-.27.27h-.647a.906.906 0 0 1-.126 0 .147.147 0 0 1-.128-.122.994.994 0 0 1-.01-.175V5.101a.944.944 0 0 0-.033-.293.4.4 0 0 0-.36-.294 1.861 1.861 0 0 0-.912.176.087.087 0 0 0-.063.096v2.788a.774.774 0 0 1-.01.155c0 .07-.058.127-.128.127h-.81c-.197 0-.24-.047-.24-.243V5.1a1.24 1.24 0 0 0-.026-.276.4.4 0 0 0-.371-.318 1.874 1.874 0 0 0-.928.18.085.085 0 0 0-.059.103v2.833c0 .195-.044.236-.239.236h-.704c-.188 0-.235-.053-.235-.232zm2.71 9.92a.178.178 0 0 0-.074-.011 2 2 0 0 0 .057.324c.08.337.358.59.7.636a2.664 2.664 0 0 0 1.088-.037c.117-.026.229-.053.345-.085.154-.037.223.023.223.17v.385a.235.235 0 0 1-.19.271 3.36 3.36 0 0 1-1.141.217 2.901 2.901 0 0 1-.796-.079 1.63 1.63 0 0 1-1.215-1.136 2.946 2.946 0 0 1-.02-1.776 1.848 1.848 0 0 1 1.838-1.363c.268-.012.535.023.792.101.44.123.775.48.868.928a1.468 1.468 0 0 1 0 .587.983.983 0 0 1-.535.704 2.166 2.166 0 0 1-.891.23 4.15 4.15 0 0 1-1.055-.067zm-3.133-2.202c.027-.037.012-.075.012-.112V9.847c0-.202.037-.238.238-.238h.734c.161.006.207.044.207.208v5.586c0 .147-.049.201-.196.201h-.69a.19.19 0 0 1-.186-.146.82.82 0 0 0-.057-.185c-.048.008-.069.045-.107.067a1.714 1.714 0 0 1-1.615.276 1.526 1.526 0 0 1-.917-.812 2.495 2.495 0 0 1-.266-1.13 2.999 2.999 0 0 1 .187-1.225 1.66 1.66 0 0 1 .826-.945c.552-.263 1.2-.22 1.713.111a.294.294 0 0 0 .117.059zm-.797-3.817h-.733a.32.32 0 0 1-.075 0 .147.147 0 0 1-.147-.137V3.893c0-.127.054-.176.18-.18a19.455 19.455 0 0 1 .828 0c.122 0 .159.037.17.158v3.67a.982.982 0 0 1-.01.176.134.134 0 0 1-.128.12.456.456 0 0 1-.089 0zm-1.045-5.45a.616.616 0 0 1 .642-.586h.064a.649.649 0 0 1 .248.036.6.6 0 0 1 .411.67.587.587 0 0 1-.506.534.963.963 0 0 1-.355 0 .587.587 0 0 1-.504-.66Zm-3.092 5.2V3.983c0-.244.026-.27.27-.27h.51a.211.211 0 0 1 .238.179c.037.132.07.264.1.408a.161.161 0 0 0 .091-.065 3.514 3.514 0 0 1 .303-.27 1.41 1.41 0 0 1 .964-.293c.138 0 .186.048.197.18.01.18 0 .367 0 .546a.985.985 0 0 1-.012.22.147.147 0 0 1-.147.146 1.812 1.812 0 0 1-.22 0 2.523 2.523 0 0 0-1.027.147c-.074.026-.074.079-.074.138v2.678a.13.13 0 0 1-.128.122.992.992 0 0 1-.132 0v.01h-.69a.784.784 0 0 1-.117 0 .147.147 0 0 1-.126-.132zm.904 3.228a.604.604 0 0 1-.192 0 .998.998 0 0 1-.176-.02.6.6 0 0 1-.466-.7.587.587 0 0 1 .567-.536.473.473 0 0 1 .111 0 .638.638 0 0 1 .313.054c.208.078.35.272.361.494a.624.624 0 0 1-.518.716zm.44.855v3.764a.147.147 0 0 1-.133.159h-.88a.147.147 0 0 1-.162-.128v-.026a.567.567 0 0 1 0-.1v-3.67c0-.164.045-.21.21-.21h.751c.164.007.211.054.211.218zm-1.711.047-.317.844-1.067 2.774c-.01.032-.027.063-.037.095a.261.261 0 0 1-.265.175h-.702a.294.294 0 0 1-.318-.218c-.133-.349-.27-.704-.403-1.055-.318-.832-.641-1.666-.96-2.504a.928.928 0 0 1-.069-.207c-.016-.105.021-.158.128-.158h.901c.128 0 .185.085.218.196.058.201.117.408.18.61.217.733.43 1.479.646 2.217h.01l.096-.308.733-2.46.031-.095a.214.214 0 0 1 .213-.147h.812c.2-.003.243.054.176.245zM1.786 3.82a.377.377 0 0 1 .318-.107h.488a.21.21 0 0 1 .234.18c.01.053.02.106.037.16a.022.022 0 0 0 .02.015.429.429 0 0 0 .11-.08 1.87 1.87 0 0 1 1.586-.354c.48.115.874.454 1.061.91a2.451 2.451 0 0 1 .205.798h-.008c.051.444.011.893-.118 1.321a1.942 1.942 0 0 1-.55.88c-.34.306-.795.448-1.248.388A1.776 1.776 0 0 1 3 7.564c-.039.033-.022.074-.022.113v1.506c0 .329 0 .329-.334.329h-.572a.294.294 0 0 1-.294-.126Zm19.37 15.225a.587.587 0 0 1-.176.2 11.64 11.64 0 0 1-1.962 1.247 15.499 15.499 0 0 1-4.152 1.406 18.226 18.226 0 0 1-2.51.27v.022h-.649v-.018c-.293-.014-.578-.026-.868-.047a15.349 15.349 0 0 1-2.296-.352 15.558 15.558 0 0 1-6.885-3.59c-.185-.164-.36-.333-.54-.503a.405.405 0 0 1-.101-.146.195.195 0 0 1 .098-.256.2.2 0 0 1 .147 0 1.21 1.21 0 0 1 .138.069 20.566 20.566 0 0 0 6.164 2.546 22.087 22.087 0 0 0 2.212.398 20.441 20.441 0 0 0 3.213.146 16.97 16.97 0 0 0 1.724-.146 20.908 20.908 0 0 0 3.935-.896 18.627 18.627 0 0 0 1.973-.776.44.44 0 0 1 .318-.043.33.33 0 0 1 .24.398.578.578 0 0 1-.022.066zm1.028 1.488a3.547 3.547 0 0 1-.615.757.432.432 0 0 1-.17.107.123.123 0 0 1-.169-.124.608.608 0 0 1 .038-.162c.185-.496.366-.99.51-1.504a5.346 5.346 0 0 0 .18-.859 1.65 1.65 0 0 0 0-.318.412.412 0 0 0-.294-.388 2.068 2.068 0 0 0-.509-.095 8.356 8.356 0 0 0-1.459.064l-.641.08c-.07 0-.132 0-.17-.065a.18.18 0 0 1 .014-.19.546.546 0 0 1 .162-.148 3.67 3.67 0 0 1 1.299-.562 6.412 6.412 0 0 1 1.097-.121c.346.001.691.042 1.028.121a1.515 1.515 0 0 1 .276.102c.121.05.206.162.219.293a2.157 2.157 0 0 1 .014.455 5.856 5.856 0 0 1-.806 2.55zm-2.55-5.72a.995.995 0 0 0 .301.01.691.691 0 0 0 .505-.293 1.01 1.01 0 0 0 .147-.308l-.009.014a1.924 1.924 0 0 0 .074-.678 2.449 2.449 0 0 0 0-.293 1.64 1.64 0 0 0-.147-.6.685.685 0 0 0-.483-.376.908.908 0 0 0-.302-.01.694.694 0 0 0-.542.328 1.163 1.163 0 0 0-.147.35 2.89 2.89 0 0 0-.042.933 1.494 1.494 0 0 0 .147.525c.09.207.276.355.497.397zm-3.523-1.96a.473.473 0 0 0-.394-.64c-.026 0-.047-.01-.073-.01a.797.797 0 0 0-.775.302 1.321 1.321 0 0 0-.211.578c-.015.047.01.069.058.073a4.705 4.705 0 0 0 .642.053c.11.006.22-.003.328-.026a.465.465 0 0 0 .425-.33zm-5.981-.255a1.174 1.174 0 0 0-.106.26 2.683 2.683 0 0 0-.065.997 1.48 1.48 0 0 0 .147.536.734.734 0 0 0 .568.391 1.306 1.306 0 0 0 .832-.158.147.147 0 0 0 .086-.147v-.966h.007c0-.323-.01-.641 0-.968a.147.147 0 0 0-.096-.156 1.614 1.614 0 0 0-.817-.147.678.678 0 0 0-.556.358zM3.855 7.051a.747.747 0 0 0 .488-.188.807.807 0 0 0 .243-.425 2.654 2.654 0 0 0 .065-1.002 1.505 1.505 0 0 0-.135-.54.653.653 0 0 0-.505-.382 1.44 1.44 0 0 0-.912.137.16.16 0 0 0-.105.164v1.917a.147.147 0 0 0 .09.147 1.468 1.468 0 0 0 .771.17"
            />
          </svg>
        </div>
      `;
    } else {
      return html``;
    }
  }

  _render_youtube() {
    if (this._youtube) {
      return html`
        <div @click=${this._press_youtube} class="remote-button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xml:space="preserve"
            width="48"
            height="48"
            version="1.0"
            viewBox="0 0 24 24"
          >
            <path
              d="M18.43 4.216H5.57A4.57 4.57 0 0 0 1 8.786v6.429a4.57 4.57 0 0 0 4.57 4.569h12.86a4.57 4.57 0 0 0 4.57-4.57V8.786a4.57 4.57 0 0 0-4.57-4.569zm-3.09 8.097-6.015 2.869a.241.241 0 0 1-.346-.218V9.046c0-.18.19-.297.351-.215l6.016 3.048a.242.242 0 0 1-.005.434z"
            />
          </svg>
        </div>
      `;
    } else {
      return html``;
    }
  }

  _render_apps() {
    let app_buttons = "";

    if (
      this._disneyplus ||
      this._hbomax ||
      this._hulu ||
      this._netflix ||
      this._prime ||
      this._youtube
    ) {
      return html`
        <div class="grid app-grid">
          ${this._render_disneyplus()} ${this._render_hbomax()}
          ${this._render_hulu()} ${this._render_netflix()}
          ${this._render_prime()} ${this._render_youtube()}
        </div>
      `;
    } else {
      return ``;
    }
  }

  _send_command(action) {
    this._hass.callService("remote", "send_command", {
      entity_id: this._entity_id,
      command: action,
    });
    console.log(`${action} was called`);
  }

  _turn_on(action) {
    this._hass.callService("remote", "turn_on", {
      entity_id: this._entity_id,
      activity: action,
    });
    console.log(`${action} was called`);
  }

  _press_power() {
    this._hass.callService("remote", "toggle", {
      entity_id: this._entity_id,
    });
  }

  _press_up() {
    this._send_command("DPAD_UP");
  }

  _press_left() {
    this._send_command("DPAD_LEFT");
  }

  _press_right() {
    this._send_command("DPAD_RIGHT");
  }

  _press_down() {
    this._send_command("DPAD_DOWN");
  }

  _press_center() {
    this._send_command("DPAD_CENTER");
  }

  _press_home() {
    this._send_command("HOME");
  }

  _press_back() {
    this._send_command("BACK");
  }

  _press_volume_up() {
    this._send_command("VOLUME_UP");
  }

  _press_volume_mute() {
    this._send_command("MUTE");
  }

  _press_volume_down() {
    this._send_command("VOLUME_DOWN");
  }

  _press_disney_plus() {
    this._turn_on("https://www.disneyplus.com");
  }

  _press_hbo_max() {
    this._turn_on("https://play.hbomax.com");
  }

  _press_hulu() {
    this._turn_on("HULU");
  }

  _press_netflix() {
    this._turn_on("https://www.netflix.com/title");
  }

  _press_prime_video() {
    this._turn_on("https://app.primevideo.com");
  }

  _press_youtube() {
    this._turn_on("https://www.youtube.com");
  }

  static styles = css`
    .card-content {
      margin: auto;
      background-color: var(
        --ha-card-background,
        var(--card-background-color, #fff)
      );
      border: 1px var(--ha-card-border-color, var(--divider-color, #e0e0e0))
        solid;
      padding: 15px;
      border-radius: 25px;
    }
    .grid {
      display: grid;
      align-items: center;
      justify-content: center;
      justify-items: center;
      width: 90%;
      gap: 10px;
      padding: 15px;
    }

    .card-grid {
      grid-template-columns: repeat(1, 1fr);
      border: none;
      background: none;
      width: 100%;
      padding: 0;
    }

    .remote-grid {
      grid-template-columns: repeat(3, 1fr);
    }

    .app-grid {
      grid-template-columns: repeat(4, 1fr);
    }

    .volume-grid {
      grid-template-columns: repeat(3, 1fr);
    }

    .remote-button {
      display: flex;
      align-items: center;
      justify-content: center;
      justify-items: center;
      fill: var(--primary-text-color);
      border-radius: 25%;
      background-color: var(
        --ha-card-border-color,
        var(--divider-color, #e0e0e0)
      );
      cursor: pointer;
      width: 30px;
      height: 30px;
    }

    .remote-grid > .remote-button {
      padding: 20px;
    }

    .center {
      border-radius: 50%;
      background-color: none;
      border: 1px var(--ha-card-border-color, var(--divider-color, #e0e0e0))
        solid;
    }

    .volume-grid > .remote-button {
      padding: 15px;
    }

    .app-grid > .remote-button {
      padding: 10px;
    }

    #touchpad {
      width: 100%;
      height: 300px;
      background-color: #333;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      border-radius: 15px;
      touch-action: none;
    }

    #nub {
      width: 50px;
      height: 50px;
      background-color: rgb(255, 255, 255);
      border: 10px solid rgba(255, 255, 255, 0.5);
      border-radius: 50%;
      touch-action: none;
      user-select: none;
    }
    #nub:active {
      background-color: rgba(168, 218, 220, 1);
    }
    #nub:hover {
      cursor: pointer;
      border-width: 20px;
    }

    /** dpad **/

    .center {
      border-radius: 50%;
      background-color: none;
      border: 1px var(--ha-card-border-color, var(--divider-color, #e0e0e0))
        solid;
    }

    .pie {
      position: relative;
      margin: 1em auto;
      border: 4px var(--ha-card-border-color, var(--divider-color, #e0e0e0)) solid;
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
      border: 2px var(--ha-card-border-color, var(--divider-color, #e0e0e0)) solid;
      box-sizing: border-box;
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
    .slice:nth-child(3) .slice-contents,
      transform: skewY(-30deg);
      // background-color: #222222;
    }

    .slice:nth-child(4) .slice-contents {
      transform: skewY(-30deg);
      // background-color: #222222;
    }

    .inner-pie {
      position: absolute;
      width: 6em;
      height: 6em;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      border-radius: 50%;
      border: 4px var(--ha-card-border-color, var(--divider-color, #e0e0e0)) solid;
      background-color: #222222;
    }
  `;
}

class PolrAndroidTvRemoteCardEditor extends LitElement {
  setConfig(config) {
    this._config = config;
  }
}

customElements.define("polr-android-tv-remote-card", PolrAndroidTvRemoteCard);
customElements.define(
  "polr-android-tv-remote-card-editor",
  PolrAndroidTvRemoteCardEditor
);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "polr-android-tv-remote-card",
  name: "Polr Android Tv Remote Card",
  preview: true,
});
