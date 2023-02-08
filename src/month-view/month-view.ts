import { B5rDateRange } from '../models/date-range';
import { B5rEvent, B5rInternalEvent } from '../models/event';
import { getDaysBetween, isTodayDate } from '../utils/date';
import { isDateRangeOverlap } from '../utils/date-range';
import { cloneEvents, sortEvents } from '../utils/event';
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
import { B5rMonthOptions } from './month-view.def';
import { CalendarView } from '../models/calendar-view';
import { B5rUpdateCallback } from '../types';

export class B5rMonthView implements CalendarView {
    events: B5rEvent[] = [];
    refRoot: HTMLElement = null;
    refHeader: HTMLElement = null;
    refBody: HTMLElement = null;
    eventElement = null;
    refAllDayEvents: HTMLElement[] = [];
    refAllDayArea: HTMLElement = null;
    refDayColumns: HTMLElement[] = [];
    timeZone?: string;

    #locale: string = LOCALE_EN;
    #fullDatesOfMonth: Date[] = [];
    #currentDate: Date = new Date();
    #internalEvents: B5rEvent[] = [];
    #monthEvents: B5rEvent[] = [];
    #visibleDates: Date[] = [];
    #dayClickCallback: ((event: PointerEvent, date: Date) => void)[] = [];

    constructor(refRoot: HTMLElement, options?: B5rMonthOptions) {
        injectStyleTag(B5R_MONTH_VIEW_STYLE_ID, cssText);

        options = {
            ...DEFAULT_OPTIONS,
            ...options,
        };

        this.refRoot = refRoot;
        this.#currentDate = options.currentDate;
        this.#setFullDatesOfMonth(options.currentDate);
        this.#locale = options.locale;
        this.timeZone = options.timeZone;
        this.refRoot.append(this.#createTemplate());
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

    updateView(): void {
        this.#createBodyTemplate();
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
        this.#currentDate = new Date();
        this.#setFullDatesOfMonth(this.#currentDate);

        this.updateView();
        return Promise.resolve(this.#currentDate);
    }

    next(): Promise<Date[]> {
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
        return Promise.resolve(this.fullDatesOfMonth);
    }

    previous(): Promise<Date[]> {
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
        return Promise.resolve(this.fullDatesOfMonth);
    }

    deleteAllEvents(): void {
        // TODO
    }

    destroy(): void {
        // TODO
    }

    onUpdate(_callback: B5rUpdateCallback): void {
        // TODO
    }

    onDayClick(callback: (event: PointerEvent, Date: Date) => void): void {
        this.#dayClickCallback.push(callback);
    }

    set #events(events: B5rEvent[]) {
        this.events = cloneEvents(events);

        this.#internalEvents = sortEvents(events);
    }

    get #events(): B5rInternalEvent[] {
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
        this.refRoot = document.createElement('div');
        this.refRoot.className = ROOT_CLASS;

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

            this.#createEventForDay(refDay, vd);

            this.refBody.append(refDay);
        });

        this.refRoot.append(this.refBody);

        return this.refBody;
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

    #createEventForDay(refDay: HTMLElement, _date: Date): void {
        const refListEvents = document.createElement('ul');
        refListEvents.className = LIST_EVENTS_CLASS;

        for (let index = 0; index < 2; index++) {
            const refEvent = document.createElement('li');
            refEvent.className = EVENT_CLASS;

            const refEventButton = document.createElement('button');
            refEventButton.className = EVENT_BUTTON_CLASS;

            refEventButton.innerHTML = `<span class="${HIDDEN_CLASS}">#Event Name</soan>`;

            refEvent.append(refEventButton);
            refListEvents.append(refEvent);
        }

        refDay.append(refListEvents);
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
        if (this.#dayClickCallback.length === 0) return;

        this.#dayClickCallback.forEach(
            (callback: (event: PointerEvent, Date: Date) => void) =>
                callback(event, Date)
        );
    }
}
