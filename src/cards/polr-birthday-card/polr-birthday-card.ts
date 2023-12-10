import { LitElement, html, css, CSSResultGroup } from "lit";
import { property } from "lit/decorators.js";
import { map } from "lit/directives/map.js";
import "../elements/header";
import { CalendarIcon } from "../../utils/icons";

export class PoLRBirthdayCard extends LitElement {
    @property() _config: any;
    @property() _hass: any;
    @property() _entity: any;
    @property() _events: Array<BirthdayEvent>;

    static getConfigElement() {
        // return document.createElement("polr-birthday-card-editor");
    }

    static getStubConfig() {
        return {
            entity_id: "calendar.birthdays",
            days: 30,
            max: 5,
        };
    }

    setConfig(config: any) {
        if (!config["entity_id"]) {
            throw new Error("entity_id must be specified");
        }

        this._config = JSON.parse(JSON.stringify(config));

        if (!config["days"]) {
            this._config["days"] = 90;
        }
        if (!config["name"]) {
            this._config["name"] = "Upcoming Birthdays";
        }
    }

    set hass(hass: any) {
        this._hass = hass;

        this.getEvents(hass)
            .then((events) =>
                !this._config["max"]
                    ? (this._events = events)
                    : (this._events = events.slice(0, this._config["max"]))
            )
            .catch((error) => console.log("error", error));
    }

    async getEvents(hass: any) {
        try {
            var startDate = new Date();
            startDate.setDate(startDate.getDate() - 7);
            var start = startDate.toISOString().slice(0, 10);

            var endDate = new Date();
            endDate.setDate(endDate.getDate() + this._config["days"]);
            var end = endDate.toISOString().slice(0, 10);

            var url = `calendars/${this._config["entity_id"]}?start=${start}&end=${end}`;
            var data = await hass.callApi("GET", url);
            var eventDates = [];
            data.forEach((item) => {
                eventDates.push(new BirthdayEvent(item));
            });

            return eventDates;
        } catch (error) {
            throw error;
        }
    }

    render() {
        return html`
            <ha-card>
                <polr-headercard
                    icon=${CalendarIcon}
                    _hass=${this._hass}
                    entity_id=${this._config["entity_id"]}
                    primaryInfo=${this._config["name"]}>
                </polr-headercard>
                <div class="content">
                    ${map(
                        this._events,
                        (i) => html`
                            <div class="card ${i.today() ? "today" : ""}">
                                <div class="date">
                                    ${i.getMonth()} ${i.getDay()}
                                </div>
                                <div class="type">${i.getType()}</div>
                                <div class="name">${i.getName()}</div>
                            </div>
                        `
                    )}
                </div>
            </ha-card>
        `;
    }

    static get styles(): CSSResultGroup {
        return css`
            :host {
                --polr-fox-icon-color-disabled: #ffffff;
            }
            ha-card {
                overflow: hidden;
            }

            .content {
                display: flex;
                flex-direction: column;
                gap: 12px;
                padding: 0 12px 12px 12px;
            }

            .card {
                display: grid;
                grid-template-columns: 50px 50px 1fr;
                gap: 2px;
                padding: 4px 12px;
                border-radius: 4px;
            }

            .today {
                background-color: #03a9f414;
            }

            .type {
                text-align: center;
            }
        `;
    }
}

customElements.define("polr-birthday-card", PoLRBirthdayCard);
(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
    type: "polr-birthday-card",
    name: "PoLR Birthday Card",
    description: "A birthday card.",
});

class BirthdayEvent {
    name: string;
    eventDate: Date;
    type: string;
    current: boolean;
    raw: any;

    constructor(data: any) {
        this.type = this.findType(data["summary"]);
        this.name = this.findName(data["summary"]);
        this.eventDate = this.findDate(data["start"]["date"]);
        this.current = this.findCurrent();

        this.raw = data;
    }

    private findDate(data: string) {
        return new Date(data + "T00:00:00");
    }

    private findCurrent() {
        var today = new Date();
        return (
            this.eventDate.getFullYear() === today.getFullYear() &&
            this.eventDate.getMonth() === today.getMonth() &&
            this.eventDate.getDate() === today.getDate()
        );
    }

    private findName(data: string) {
        if (data.includes("'")) return data.substring(0, data.indexOf("'"));
        else return "Your";
    }

    private findType(data: string) {
        if (data.includes("birthday")) {
            return "🎂";
        }

        if (data.includes("anniversary")) {
            return "💍";
        }

        return "Unknown";
    }

    getFormattedDate() {
        return this.eventDate.toISOString().split("T")[0];
    }

    getName() {
        return this.name;
    }

    getMonth() {
        return this.eventDate.toLocaleString("en-US", { month: "short" });
    }

    getDay() {
        return this.eventDate.getDate();
    }

    getType() {
        return this.type;
    }

    today() {
        return this.current;
    }
}
