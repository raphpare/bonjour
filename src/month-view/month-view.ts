import { B5rEvent } from '../models/event';
import { isTodayDate } from '../utils/date';
import { cloneEvents } from '../utils/event';
import { LOCALE_EN } from '../utils/locales';
import { injectStyleTag } from '../utils/stylesheets';
import {
    B5R_MONTH_VIEW_STYLE_ID,
    DAY_BUTTON_CLASS,
    DAY_BUTTON_TODAY_CLASS,
    DAY_CLASS,
    DEFAULT_OPTIONS,
    EVENT_BUTTON_CLASS,
    EVENT_CLASS,
    HEADER_CLASS,
    HIDDEN_CLASS,
    LIST_EVENTS_CLASS,
    ROOT_CLASS,
} from './month-view.utils';
import cssText from './month-view.css';
import {
    B5rDayClickCallback,
    B5rMonthCallbacks,
    B5rMonthOptions,
} from './month-view.def';
import { CalendarView } from '../models/calendar-view';
import { B5rEventClickCallback, B5rUpdateCallback } from '../models/callbacks';
import { newDate } from '../utils/date/date.utils';
import { B5rDateRange } from '../models/date-range';

export class B5rMonthView implements CalendarView {
    refRoot: HTMLElement = null;
    refHeader: HTMLElement = null;
    refBody: HTMLElement = null;
    refEvents: HTMLElement[] = [];
    timeZone?: string;

    #locale: string = LOCALE_EN;
    #datesOfMonthDisplayed: Date[] = [];
    #currentDate: Date = new Date();
    #eventsClone: B5rEvent[] = [];
    #internalEvents: B5rEvent[] = [];
    #visibleDates: Date[] = [];
    #callbacks: B5rMonthCallbacks = {
        updateCallbacks: [],
        eventClickCallbacks: [],
        dayClickCallbacks: [],
    };

    constructor(element: HTMLElement, options?: B5rMonthOptions) {
        injectStyleTag(B5R_MONTH_VIEW_STYLE_ID, cssText);

        options = {
            ...DEFAULT_OPTIONS,
            ...options,
        };

        this.refRoot = element;
        this.currentDate =
            options.currentDate || newDate({ timeZone: options.timeZone });

        this.#locale = options.locale;
        this.timeZone = options.timeZone;

        this.#createTemplate();
    }

    set currentDate(currentDate: Date) {
        this.#currentDate = currentDate;
        this.#setDatesOfMonthDisplayed(currentDate);
        this.updateView();
    }

    get currentDate(): Date {
        return this.#currentDate;
    }

    set locale(locale: string) {
        this.#locale = locale;
        this.updateView();
    }

    get locale(): string {
        return this.#locale;
    }

    get events(): B5rEvent[] {
        return this.#eventsClone;
    }

    get datesDisplayed(): Date[] {
        return this.#visibleDates;
    }

    get dateRangesDisplayed(): B5rDateRange {
        const dateFin = this.datesDisplayed[this.datesDisplayed.length - 1];
        return {
            start: this.datesDisplayed[0],
            end: new Date(
                dateFin.getFullYear(),
                dateFin.getMonth(),
                dateFin.getDate(),
                23,
                59,
                59
            ),
        };
    }

    get datesOfMonthDisplayed(): Date[] {
        return this.#datesOfMonthDisplayed;
    }

    setEvents(events: B5rEvent[] = []): Promise<void> {
        return new Promise<void>((resolve) => {
            this.deleteAllEvents();
            if (events !== this.#events) {
                this.#events = events;
            }
            this.#createBodyTemplate();
            resolve();
        });
    }

    today(): Promise<Date> {
        this.currentDate = newDate({ timeZone: this.timeZone });
        return Promise.resolve(this.currentDate);
    }

    next(): Promise<Date[]> {
        this.currentDate = new Date(
            this.#currentDate.getFullYear(),
            this.#currentDate.getMonth() + 1,
            1,
            0,
            0,
            0,
            0
        );
        return Promise.resolve(this.datesOfMonthDisplayed);
    }

    previous(): Promise<Date[]> {
        this.currentDate = new Date(
            this.#currentDate.getFullYear(),
            this.#currentDate.getMonth(),
            0,
            0,
            0,
            0,
            0
        );
        return Promise.resolve(this.datesOfMonthDisplayed);
    }

    updateView(): void {
        this.#createBodyTemplate();
    }

    deleteAllEvents(): void {
        if (!this.refEvents) return;

        let indexEvent = this.refEvents.length;
        while (indexEvent--) {
            const refEvent = this.refEvents[indexEvent];

            // TODO : remove event listener
            refEvent.remove();
        }

        this.#events = [];
    }

    destroy(): void {
        this.deleteAllEvents();
        this.refRoot.innerHTML = '';
        this.refRoot.classList.remove(ROOT_CLASS);
    }

    onUpdate(callback: B5rUpdateCallback): void {
        this.#callbacks.updateCallbacks.push(callback);
    }

    onEventClick(callback: B5rEventClickCallback): void {
        this.#callbacks.eventClickCallbacks.push(callback);
    }

    onDayClick(callback: B5rDayClickCallback): void {
        this.#callbacks.dayClickCallbacks.push(callback);
    }

    set #events(events: B5rEvent[]) {
        this.#eventsClone = cloneEvents(events);
        this.#internalEvents = events.sort(
            (a, b) => a.dateRange.start.getTime() - b.dateRange.start.getTime()
        );
    }

    get #events(): B5rEvent[] {
        return this.#internalEvents;
    }

    get #weekdays(): string[] {
        return [...this.#visibleDates].splice(0, 7).map((d) =>
            d.toLocaleString(this.locale, {
                weekday: 'short',
            })
        );
    }

    #createTemplate(): HTMLElement {
        if (!this.refRoot) {
            this.refRoot = document.createElement('div');
        }
        this.refRoot.className = ROOT_CLASS;
        this.refEvents = [];

        if (!this.refHeader) {
            this.#createHeaderTemplate();
        }
        this.#createBodyTemplate();

        return this.refRoot;
    }

    #createHeaderTemplate(): HTMLElement {
        if (this.refHeader) {
            this.refHeader.remove();
        }

        this.refHeader = document.createElement('ul');
        this.refHeader.className = HEADER_CLASS;
        this.refHeader.setAttribute('aria-hidden', 'true');

        // TODO
        this.#weekdays.forEach((text) => {
            const refHeaderTitle = document.createElement('li');
            refHeaderTitle.innerText = text;

            this.refHeader.append(refHeaderTitle);
        });

        this.refRoot.prepend(this.refHeader);
        return this.refHeader;
    }

    #createBodyTemplate(): HTMLElement {
        if (this.refBody) {
            this.refBody.remove();
            document
                .querySelectorAll(`.${DAY_BUTTON_CLASS}`)
                .forEach((element) => {
                    element.removeEventListener(
                        'click',
                        this.#onDayClick.bind(
                            this,
                            new Date(element.getAttribute('data-date'))
                        )
                    );
                });
        }

        this.refBody = document.createElement('ul');
        this.refBody.className = HEADER_CLASS;

        this.#visibleDates.forEach((vd) => {
            const refDay = document.createElement('li');
            refDay.className = DAY_CLASS;

            this.#createDayButton(refDay, vd);

            this.#createEventsForDay(refDay, vd);

            this.refBody.append(refDay);
        });

        this.refRoot.append(this.refBody);

        return this.refBody;
    }

    #createDayButton(refDay: HTMLElement, date: Date): void {
        const refButton = document.createElement('button');
        refButton.innerText = date.getDate().toString();

        refButton.className = DAY_BUTTON_CLASS;
        refButton.setAttribute('data-date', date.toISOString());
        refButton.setAttribute(
            'aria-label',
            date.toLocaleString(this.#locale, { day: 'numeric', month: 'long' })
        );

        refButton.addEventListener('click', this.#onDayClick.bind(this, date));

        if (isTodayDate(date, this.timeZone)) {
            refButton.classList.add(DAY_BUTTON_TODAY_CLASS);
        }

        refDay.append(refButton);
    }

    #createEventsForDay(refDay: HTMLElement, _date: Date): void {
        const refListEvents = document.createElement('ul');
        refListEvents.className = LIST_EVENTS_CLASS;

        // TODO: utiliser this.#events pour faire la boucle
        for (let index = 0; index < 2; index++) {
            const refEvent = document.createElement('li');
            refEvent.className = EVENT_CLASS;

            const refEventButton = document.createElement('button');
            refEventButton.className = EVENT_BUTTON_CLASS;

            refEventButton.innerHTML = `<span class="${HIDDEN_CLASS}">#Event Name</soan>`;

            refEvent.append(refEventButton);
            refListEvents.append(refEvent);

            this.refEvents.push(refEvent);
        }

        refDay.append(refListEvents);
    }

    #setDatesOfMonthDisplayed(currentDate: Date): void {
        this.#datesOfMonthDisplayed = [];
        this.#datesOfMonthDisplayed = this.#getDateInMonth(currentDate);

        const visibleDates: Date[] = [];
        const firstDateOfWeek = this.datesOfMonthDisplayed[0];
        const firstDayOfWeek = firstDateOfWeek.getDay();

        if (firstDayOfWeek > 0) {
            const currentDate = new Date(firstDateOfWeek);

            for (let i = firstDayOfWeek - 1; i >= 0; i--) {
                currentDate.setDate(currentDate.getDate() - 1);
                visibleDates.push(new Date(currentDate));
            }
            visibleDates.reverse();
        }
        visibleDates.push(...this.#datesOfMonthDisplayed);

        const lastDateOfWeek =
            this.datesOfMonthDisplayed[this.datesOfMonthDisplayed.length - 1];
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

    #onDayClick(event: PointerEvent, Date: Date): void {
        if (this.#callbacks.dayClickCallbacks.length === 0) return;

        this.#callbacks.dayClickCallbacks.forEach(
            (callback: (event: PointerEvent, Date: Date) => void) =>
                callback(event, Date)
        );
    }
}
