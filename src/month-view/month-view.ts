import { B5rDateRange } from '../models/date-range';
import { B5rEvent, B5rInternalEvent } from '../models/event';
import { getDaysBetween } from '../utils/date';
import { isDateRangeOverlap } from '../utils/date-range';
import { cloneEvents, sortEvents } from '../utils/event';
import { LOCALE_EN } from '../utils/locales';

export class B5rMonthView {
    events: B5rEvent[] = [];
    refRoot: HTMLElement = null;
    eventElement = null;
    refAllDayEvents: HTMLElement[] = [];
    refAllDayArea: HTMLElement = null;
    refDayColumns: HTMLElement[] = [];

    #locale: string = LOCALE_EN;
    #fullDatesOfMonth: Date[] = [];
    #currentDate: Date = new Date();
    #internalEvents: B5rEvent[] = [];
    #monthEvents: B5rEvent[] = [];
    #visibleDates: Date[] = [];

    constructor(
        refRoot: HTMLElement,
        options = {
            currentDate: new Date(),
            locale: LOCALE_EN,
        }
    ) {
        this.refRoot = refRoot;
        this.#currentDate = options.currentDate;
        this.#setFullDatesOfMonth(options.currentDate);
        this.#locale = options.locale;
        this.refRoot.append(this.createTemplate());
    }

    set locale(locale: string) {
        this.#locale = locale;
        this.updateView();
    }

    get locale(): string {
        return this.#locale;
    }

    get fullDatesOfMonth(): Date[] {
        return this.#fullDatesOfMonth;
    }

    get dateRangesDisplayed(): B5rDateRange {
        return {
            start: this.#fullDatesOfMonth[0],
            end: this.#fullDatesOfMonth[this.#fullDatesOfMonth.length - 1],
        };
    }

    set monthEvents(events: B5rEvent[]) {
        this.events = events;
        this.#monthEvents = events.sort(
            (a, b) => a.dateRange.start.getTime() - b.dateRange.start.getTime()
        );
    }

    get monthEvents(): B5rEvent[] {
        return this.#monthEvents;
    }

    get title(): string {
        const dateArray = [];
        dateArray.push(
            this.dateRangesDisplayed.start.toLocaleString(this.locale, {
                day: 'numeric',
                month: 'short',
            })
        );
        dateArray.push(
            this.dateRangesDisplayed.end.toLocaleString(this.locale, {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
            })
        );
        return dateArray.join(' – ');
    }

    get dayOfWeek(): string[] {
        return this.#fullDatesOfMonth.map((d) =>
            d.toLocaleString(this.locale, { weekday: 'short', day: 'numeric' })
        );
    }

    get datesOfWeek(): string[] {
        return this.#fullDatesOfMonth.map((d) =>
            d.toLocaleString(this.locale, {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
            })
        );
    }

    updateView(): void {
        this.updateEvents(this.events);
        this.#updateDisplay();
    }

    setEvents(events: B5rEvent[] = []): Promise<void> {
        return new Promise<void>((resolve) => {
            // this.deleteAllEvents();
            if (events !== this.#events) {
                this.#events = events;
            }
            this.#createAllEvents();
            resolve();
        });
    }

    today(): Date {
        this.#currentDate = new Date();
        this.#setFullDatesOfMonth(this.#currentDate);

        this.updateView();
        return this.#currentDate;
    }

    next(): Date[] {
        this.#currentDate = new Date(
            this.#currentDate.getFullYear(),
            this.#currentDate.getMonth() + 1,
            1,
            0,
            0,
            0,
            0
        );
        this.#setFullDatesOfMonth(this.#currentDate);

        this.updateView();
        return this.fullDatesOfMonth;
    }

    previous(): Date[] {
        this.#currentDate = new Date(
            this.#currentDate.getFullYear(),
            this.#currentDate.getMonth(),
            0,
            0,
            0,
            0,
            0
        );
        this.#setFullDatesOfMonth(this.#currentDate);

        this.updateView();
        return this.fullDatesOfMonth;
    }

    createTemplate(): HTMLElement {
        this.refRoot = document.createElement('ul') as HTMLElement;

        this.refRoot.setAttribute(
            'style',
            `
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            list-style: none;
            padding: 0;
            margin: 0;
        `
        );

        this.#setVisibleDatesTemplate();

        return this.refRoot;
    }

    updateEvents(events: B5rEvent[] = []): void {
        this.deleteAllEvent();
        this.monthEvents = events;
        this.#createAllEvents();
    }

    deleteAllEvent() {
        if (this.eventElement) {
            const eventsElement = Array.prototype.slice.call(
                this.eventElement
            ) as HTMLElement[];
            eventsElement.forEach((element, index) => {
                const eventId = this.monthEvents.filter(
                    (e) => e.allDay !== true
                )[index].id;
                element.removeEventListener(
                    'click',
                    this.#dispatchEventClick.bind(this, eventId)
                );
                element.remove();
            });
        }

        if (this.refAllDayEvents) {
            const eventsElement = Array.prototype.slice.call(
                this.refAllDayEvents
            ) as HTMLElement[];
            eventsElement.forEach((element, index) => {
                const eventId = this.monthEvents.filter(
                    (e) => e.allDay === true
                )[index].id;
                element.removeEventListener(
                    'click',
                    this.#dispatchEventClick.bind(this, eventId)
                );
                element.remove();
            });
        }
    }

    set #events(events: B5rEvent[]) {
        this.events = cloneEvents(events);

        this.#internalEvents = sortEvents(events);
    }

    get #events(): B5rInternalEvent[] {
        return this.#internalEvents;
    }

    #setFullDatesOfMonth(currentDate: Date): void {
        this.#fullDatesOfMonth = [];
        this.#fullDatesOfMonth = this.#getDateInMonth(currentDate);

        const visibleDates: Date[] = [];
        const firstDateOfWeek = this.fullDatesOfMonth[0];
        const firstDayOfWeek = firstDateOfWeek.getDay();

        if (firstDayOfWeek > 0) {
            const currentDate = new Date(firstDateOfWeek);

            for (let i = firstDayOfWeek - 1; i >= 0; i--) {
                currentDate.setDate(currentDate.getDate() - 1);
                visibleDates.push(new Date(currentDate));
            }
            visibleDates.reverse();
        }
        visibleDates.push(...this.#fullDatesOfMonth);

        const lastDateOfWeek =
            this.fullDatesOfMonth[this.fullDatesOfMonth.length - 1];
        const lastDayOfWeek = lastDateOfWeek.getDay();

        if (lastDayOfWeek < 6) {
            const currentDate = new Date(lastDateOfWeek);

            for (let i = 0; i < 6 - lastDayOfWeek; i++) {
                currentDate.setDate(currentDate.getDate() + 1);
                visibleDates.push(new Date(currentDate));
            }
        }

        this.#visibleDates = visibleDates;
    }

    #updateDisplay(): void {
        this.#setVisibleDatesTemplate();
        // const customEventDisplayUpdate = new CustomEvent(CALENDRIER_DISPLAY_UPDATE, { bubbles: true });
        // this.refRoot.dispatchEvent(customEventDisplayUpdate);
    }

    #createEvent(
        event: B5rInternalEvent,
        columnElement: HTMLElement,
        indexColumnElement: number
    ): void {
        // const currentColumnDate = this.datesOfWeek[
        //     indexColumnElement
        // ].replaceAll('-', '');
        // const currentEventDate = event.dateRange.start
        //     .toLocaleString(this.locale, {
        //         year: 'numeric',
        //         month: '2-digit',
        //         day: '2-digit',
        //     })
        //     .replaceAll('-', '');
        // if (currentEventDate !== currentColumnDate || event.allDay === true) {
        //     return;
        // }
        // const newEventElement = document.createElement('button');
        // const eventStartTime =
        //     event.dateRange.start.getHours() +
        //     event.dateRange.start.getMinutes() / 60;
        // const eventHeuresFin =
        //     event.dateRange.end.getHours() +
        //     event.dateRange.end.getMinutes() / 60;
        // newEventElement.className = 'event';
        // newEventElement.type = 'button';
        // newEventElement.style.setProperty(
        //     '--event-start-time',
        //     eventStartTime.toString()
        // );
        // newEventElement.style.setProperty(
        //     '--event-end-time',
        //     eventHeuresFin.toString()
        // );
        // if (event._overlapped) {
        //     newEventElement.style.setProperty(
        //         '--number-overlapped-events',
        //         event._overlapped.eventIds.length.toString()
        //     );
        //     newEventElement.style.setProperty(
        //         '--index-overlapped-events',
        //         event._overlapped.index.toString()
        //     );
        // }
        // newEventElement.innerHTML = `<span class="event-data">${event.title}</span>`;
        // newEventElement.addEventListener(
        //     'click',
        //     this.#dispatchEventClick.bind(this, event.id)
        // );
        // columnElement.append(newEventElement);
    }

    #createAllDayEvent(event: B5rEvent): void {
        if (!isDateRangeOverlap(this.dateRangesDisplayed, event.dateRange)) {
            return;
        }
        const newAllDayEvent = document.createElement('button');
        const indexStart =
            event.dateRange.start < this.dateRangesDisplayed.start
                ? 0
                : getDaysBetween(
                      this.dateRangesDisplayed.start,
                      event.dateRange.start
                  );
        const indexEnd =
            event.dateRange.end > this.dateRangesDisplayed.end
                ? this.fullDatesOfMonth.length
                : getDaysBetween(
                      this.dateRangesDisplayed.start,
                      event.dateRange.end
                  ) + 1;

        newAllDayEvent.className = 'all-day-event';
        newAllDayEvent.innerHTML = event.title;
        newAllDayEvent.style.setProperty(
            '--index-start',
            indexStart.toString()
        );
        newAllDayEvent.style.setProperty('--index-end', indexEnd.toString());

        newAllDayEvent.addEventListener(
            'click',
            this.#dispatchEventClick.bind(this, event.id)
        );

        this.refAllDayArea.append(newAllDayEvent);
    }

    #dispatchEventClick(eventId, e): void {
        // const customEventClick = new CustomEvent(EVENT_ON_CLICK, { bubbles: true, detail: { eventId } });
        // e.target.dispatchEvent(customEventClick);
    }

    #createAllEvents(): void {
        if (this.refDayColumns.length === 0) {
            return;
        }

        this.refDayColumns.forEach((element, index) => {
            this.#monthEvents.forEach((event) => {
                if (event.allDay && event.allDay === true && index === 0) {
                    this.#createAllDayEvent(event);
                } else {
                    this.#createEvent(event, element, index);
                }
            });
        });
        this.refAllDayEvents = Array.from(
            this.refRoot.querySelectorAll('.all-day-event')
        );
        this.eventElement = Array.from(this.refRoot.querySelectorAll('.event'));
    }

    #getDateInMonth(date: Date): Date[] {
        const year = date.getFullYear();
        const month = date.getMonth();
        const currentDate: Date = new Date(year, month, 1);
        const dates: Date[] = [];

        while (currentDate.getMonth() === month) {
            dates.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return dates;
    }

    #setVisibleDatesTemplate(): void {
        this.refRoot.innerHTML = '';

        this.#visibleDates.forEach((vd) => {
            const refLi = document.createElement('li');
            refLi.setAttribute('style', `display: flex; min-height: 70px;`);
            refLi.innerText = vd.getDate().toString();
            this.refRoot.append(refLi);
        });
    }
}
