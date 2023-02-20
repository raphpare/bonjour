import { B5rEvent } from '../models/event';
import { isTodayDate, newDate } from '../utils/date';
import { cloneEvents } from '../utils/event';
import { LOCALE_EN } from '../utils/locales';
import { injectStyleTag } from '../utils/stylesheets';
import {
    B5R_MONTH_VIEW_STYLE_ID,
    CELL_CLASS,
    CELL_HEADER_CLASS,
    CELL_TODAY_CLASS,
    DAY_NUMBER_CLASS,
    DAY_NUMBER_TODAY_CLASS,
    DEFAULT_OPTIONS,
    EVENT_BUTTON_CLASS,
    EVENT_CLASS,
    HIDDEN_CLASS,
    LIST_EVENTS_CLASS,
    ROOT_CLASS,
    ROW_CLASS,
    ROW_HEADER_CLASS,
} from './month-view.utils';
import cssText from './month-view.css';
import {
    B5rDayClickCallback,
    B5rMonthCallbacks,
    B5rMonthDesignTokens,
    B5rMonthOptions,
    B5rWeekdayFormat,
} from './month-view.def';
import { CalendarView } from '../models/calendar-view';
import { B5rEventClickCallback, B5rUpdateCallback } from '../models/callbacks';
import { B5rDateRange } from '../models/date-range';
import { addDesignTokenOnElement } from '../week-view/week-view.utils';
import { isDateRangeSameDate, isDateRangeSameMonth } from '../utils/date-range';
import { DAY_MS } from '../utils/milliseconds';

export class B5rMonthView implements CalendarView {
    refRoot: HTMLElement = null;
    refHeaderRow: HTMLElement = null;
    refWeekRows: HTMLElement[] = [];
    refEvents: HTMLElement[] = [];
    timeZone?: string;

    #locale: string = LOCALE_EN;
    #datesOfMonthDisplayed: Date[] = [];
    #selectedDate: Date = new Date();
    #pastSelectedDate: Date = new Date();
    #currentDate: Date = new Date();
    #eventsClone: B5rEvent[] = [];
    #internalEvents: B5rEvent[] = [];
    #visibleDates: Date[] = [];
    #callbacks: B5rMonthCallbacks = {
        updateCallbacks: [],
        eventClickCallbacks: [],
        dayClickCallbacks: [],
    };
    #options: B5rMonthOptions = {};

    constructor(element: HTMLElement, options?: B5rMonthOptions) {
        injectStyleTag(B5R_MONTH_VIEW_STYLE_ID, cssText);

        options = {
            ...DEFAULT_OPTIONS,
            ...options,
        };

        this.refRoot = element;
        this.refRoot.role = 'grid';

        this.selectedDate =
            options.selectedDate ||
            options.currentDate ||
            newDate({ timeZone: options.timeZone });

        this.#pastSelectedDate = new Date(
            this.#selectedDate.getMilliseconds() - DAY_MS * 365
        );

        this.currentDate = this.selectedDate;

        this.#locale = options.locale;
        this.timeZone = options.timeZone;
        this.#options = options;

        this.#createTemplate();
        this.#setDesignTokens(options?.designTokens);
    }

    set selectedDate(selectedDate: Date) {
        this.#selectedDate = selectedDate;

        if (
            !isDateRangeSameMonth({
                start: this.#pastSelectedDate,
                end: selectedDate,
            })
        ) {
            this.#setDatesOfMonthDisplayed(selectedDate);
            this.updateView();
        }

        this.#pastSelectedDate = selectedDate;
    }

    get selectedDate(): Date {
        return this.#selectedDate;
    }

    set currentDate(currentDate: Date) {
        this.selectedDate = currentDate;
        this.#currentDate = currentDate;
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
        this.selectedDate = newDate({ timeZone: this.timeZone });
        return Promise.resolve(this.selectedDate);
    }

    next(): Promise<Date[]> {
        this.selectedDate = new Date(
            this.#selectedDate.getFullYear(),
            this.#selectedDate.getMonth() + 1,
            1,
            0,
            0,
            0,
            0
        );
        return Promise.resolve(this.datesOfMonthDisplayed);
    }

    previous(): Promise<Date[]> {
        this.selectedDate = new Date(
            this.#selectedDate.getFullYear(),
            this.#selectedDate.getMonth(),
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

    #createTemplate(): HTMLElement {
        if (!this.refRoot) {
            this.refRoot = document.createElement('div');
        }

        this.refRoot.className = ROOT_CLASS;
        this.refEvents = [];

        if (!this.refHeaderRow) {
            this.#createHeaderTemplate();
        }
        this.#createBodyTemplate();

        return this.refRoot;
    }

    #createHeaderTemplate(): HTMLElement {
        if (this.refHeaderRow) {
            this.refHeaderRow.remove();
        }

        this.refHeaderRow = document.createElement('div');
        this.refHeaderRow.className = `${ROW_CLASS} ${ROW_HEADER_CLASS}`;
        this.refHeaderRow.role = 'row';

        [...this.#visibleDates].splice(0, 7).forEach((date) => {
            const refHeaderCell = document.createElement('div');
            refHeaderCell.className = `${CELL_CLASS} ${CELL_HEADER_CLASS}`;
            refHeaderCell.role = 'columnheader';
            refHeaderCell.setAttribute('aria-readonly', 'true');
            refHeaderCell.setAttribute('aria-hidden', 'columnheader');
            refHeaderCell.setAttribute(
                'aria-label',
                this.#getWeekday(date, 'long')
            );
            refHeaderCell.innerText = this.#getWeekday(
                date,
                this.#options?.weekdayFormat ?? 'short'
            );

            this.refHeaderRow.append(refHeaderCell);
        });

        this.refRoot.prepend(this.refHeaderRow);
        return this.refHeaderRow;
    }

    #createBodyTemplate(): void {
        if (this.refWeekRows) {
            this.refWeekRows.forEach((r) => r.remove());
            this.refWeekRows = [];

            document
                .querySelectorAll(`.${DAY_NUMBER_CLASS}`)
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

        let indexDayOfWeek = 1;
        this.refWeekRows = [this.#getWeekRowElement()];
        let indexCurrentWeekRow = 0;

        this.#visibleDates.forEach((vd) => {
            if (indexDayOfWeek === 8) {
                indexCurrentWeekRow++;
                this.refWeekRows.push(this.#getWeekRowElement());
                indexDayOfWeek = 1;
            }

            this.#createCell(this.refWeekRows[indexCurrentWeekRow], vd);

            this.refRoot.append(this.refWeekRows[indexCurrentWeekRow]);

            indexDayOfWeek++;
        });
    }

    #getWeekRowElement(): HTMLElement {
        const refWeekRow = document.createElement('div');
        refWeekRow.role = 'row';
        refWeekRow.className = ROW_CLASS;

        return refWeekRow;
    }

    #createCell(refRow: HTMLElement, date: Date): void {
        const refCell = document.createElement('div');
        refCell.className = CELL_CLASS;
        refCell.role = 'gridcell';

        const isSelectedDate = isDateRangeSameDate({
            start: date,
            end: this.selectedDate,
        });

        refCell.setAttribute('tabindex', isSelectedDate ? '0' : '-1');
        refCell.setAttribute(
            'aria-selected',
            isSelectedDate ? 'true' : 'false'
        );

        const refDayNumber = document.createElement('span');
        refDayNumber.className = DAY_NUMBER_CLASS;
        refDayNumber.innerText = date.getDate().toString();
        refCell.append(refDayNumber);

        refCell.className = CELL_CLASS;
        refCell.setAttribute('data-date', date.toISOString());
        refDayNumber.setAttribute(
            'aria-label',
            date.toLocaleString(this.#locale, {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
            })
        );

        refCell.addEventListener('click', this.#onDayClick.bind(this, date));

        if (isTodayDate(date, this.timeZone)) {
            refCell.classList.add(CELL_TODAY_CLASS);
            refDayNumber.classList.add(DAY_NUMBER_TODAY_CLASS);
        }

        this.#createEventsForDay(refCell, date);

        refRow.append(refCell);
    }

    #createEventsForDay(refDay: HTMLElement, _date: Date): void {
        const refListEvents = document.createElement('ul');
        refListEvents.className = LIST_EVENTS_CLASS;

        // TODO: utiliser this.#events pour faire la boucle
        for (let index = 0; index < 2; index++) {
            const refEvent = document.createElement('li');
            refEvent.className = EVENT_CLASS;

            const refEventButton = document.createElement('span');
            refEventButton.className = EVENT_BUTTON_CLASS;

            refEventButton.innerHTML = `<span class="${HIDDEN_CLASS}">#Event Name</soan>`;

            refEvent.append(refEventButton);
            refListEvents.append(refEvent);

            this.refEvents.push(refEvent);
        }

        refDay.append(refListEvents);
    }

    #getWeekday(date: Date, format: B5rWeekdayFormat): string {
        return date.toLocaleString(this.locale, {
            weekday: format,
        });
    }

    #setDesignTokens(designTokens?: B5rMonthDesignTokens): void {
        addDesignTokenOnElement(
            this.refRoot,
            designTokens as Record<string, string>
        );
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

    #onDayClick(event: PointerEvent, date: Date): void {
        if (this.#callbacks.dayClickCallbacks.length === 0) return;

        this.#callbacks.dayClickCallbacks.forEach(
            (callback: (event: PointerEvent, date: Date) => void) =>
                callback(event, date)
        );
    }
}
