import { B5rEvent } from '../models/event';
import { isTodayDate, newDate } from '../utils/date';
import { cloneEvents } from '../utils/event';
import { LOCALE_EN } from '../utils/locales';
import { injectStyleTag } from '../utils/stylesheets';
import {
    B5R_MONTH_VIEW_STYLE_ID,
    CELL_CLASS,
    CELL_CURRENT_CLASS,
    CELL_HEADER_CLASS,
    CELL_SELECTED_CLASS,
    CELL_TODAY_CLASS,
    DATA_DATE,
    DAY_NUMBER_CLASS,
    DAY_NUMBER_TODAY_CLASS,
    DEFAULT_OPTIONS,
    KEY_ARROW_DOWN,
    KEY_ARROW_LEFT,
    KEY_ARROW_RIGHT,
    KEY_ARROW_UP,
    KEY_ENTER,
    KEY_SPACE,
    ROLE_GRID_CELL,
    ROOT_CLASS,
    ROW_CLASS,
    ROW_HEADER_CLASS,
    ROW_SELECTED_CLASS,
} from './month-view.utils';
import cssText from './month-view.css';
import {
    B5rDayClickCallback,
    B5rMonthCallbacks,
    B5rMonthClassNames,
    B5rMonthDesignTokens,
    B5rMonthOptions,
    B5rWeekdayFormat,
} from './month-view.def';
import { CalendarView } from '../models/calendar-view';
import { B5rEventClickCallback, B5rUpdateCallback } from '../models/callbacks';
import { B5rDateRange } from '../models/date-range';
import { addDesignTokenOnElement } from '../week-view/week-view.utils';
import { isDateRangeSameDate, isDateRangeSameMonth } from '../utils/date-range';

const convertDateToString = (date: Date): string =>
    date.toISOString().slice(0, 10);
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
    #keydowEvent: () => void;
    #refWithKeydownEvent: Set<HTMLElement> = new Set();
    #classNames: B5rMonthClassNames = {};

    constructor(element: HTMLElement, options?: B5rMonthOptions) {
        injectStyleTag(B5R_MONTH_VIEW_STYLE_ID, cssText);

        options = {
            ...DEFAULT_OPTIONS,
            ...options,
        };

        this.refRoot = element;
        this.refRoot.role = 'grid';

        const originalDate: Date =
            options.selectedDate ||
            options.currentDate ||
            newDate({ timeZone: options.timeZone });

        this.#pastSelectedDate = originalDate;
        this.currentDate = originalDate;

        this.#locale = options.locale;
        this.timeZone = options.timeZone;
        this.#options = options;
        this.#classNames = options.classNames;

        this.#keydowEvent = this.#onKeydown.bind(this) as () => void;

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
        } else {
            this.#updateSelectedCell();
        }

        this.#pastSelectedDate = selectedDate;
    }

    get selectedDate(): Date {
        return this.#selectedDate;
    }

    set currentDate(currentDate: Date) {
        this.#currentDate = currentDate;
        this.selectedDate = currentDate;
    }

    get currentDate(): Date {
        return this.#currentDate;
    }

    set locale(locale: string) {
        this.#locale = locale;
        this.#createHeaderTemplate();
        this.#createBodyTemplate();
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
            refEvent.remove();
        }

        this.#events = [];
    }

    destroy(): void {
        this.deleteAllEvents();
        this.#removeAllKeydownEventListener();
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
        this.#setDatesOfMonthDisplayed(this.#selectedDate);

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
        this.refHeaderRow.role = 'row';
        this.refHeaderRow.className = `${ROW_CLASS} ${ROW_HEADER_CLASS}`;

        [...this.#visibleDates].splice(0, 7).forEach((date) => {
            const refHeaderCell = document.createElement('div');
            refHeaderCell.role = 'columnheader';
            refHeaderCell.className = `${CELL_CLASS} ${CELL_HEADER_CLASS}`;
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
        const pastSelectedCell: HTMLElement = this.#getCell(
            this.#pastSelectedDate
        );
        const pastSelectedCellIsFocus =
            pastSelectedCell === document.activeElement;

        if (this.refWeekRows) {
            this.refWeekRows.forEach((r) => r.remove());
            this.refWeekRows = [];
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

        const nextSelectedCell: HTMLElement = this.#getCell(this.#selectedDate);
        if (pastSelectedCellIsFocus) {
            nextSelectedCell?.focus();
        }
    }

    #getWeekRowElement(): HTMLElement {
        const refWeekRow = document.createElement('div');
        refWeekRow.role = 'row';
        refWeekRow.className = ROW_CLASS;

        return refWeekRow;
    }

    #createCell(refRow: HTMLElement, date: Date): void {
        const refCell = document.createElement('div');
        refCell.role = ROLE_GRID_CELL;
        refCell.className = this.#classNames?.day
            ? `${CELL_CLASS} ${this.#classNames.day}`
            : CELL_CLASS;

        const isSelectedDate = isDateRangeSameDate({
            start: date,
            end: this.selectedDate,
        });

        const isCurrentDate = isDateRangeSameDate({
            start: date,
            end: this.currentDate,
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

        refCell.setAttribute(DATA_DATE, convertDateToString(date));
        refDayNumber.setAttribute(
            'aria-label',
            date.toLocaleString(this.#locale, {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
            })
        );

        if (isTodayDate(date, this.timeZone)) {
            refCell.classList.add(CELL_TODAY_CLASS);
            refDayNumber.classList.add(DAY_NUMBER_TODAY_CLASS);

            if (this.#classNames?.todayModifier)
                refCell.classList.add(this.#classNames.todayModifier);
        }

        if (isCurrentDate) {
            this.#updateClassCurrentDate(refCell);
        }

        if (isSelectedDate) {
            refRow.classList.add(ROW_SELECTED_CLASS);
            if (this.#classNames?.weekSelectedModifier)
                refRow.classList.add(this.#classNames.weekSelectedModifier);

            refCell.classList.add(CELL_SELECTED_CLASS);
            this.#addKeydowEventListener(refCell);
        }

        refCell.addEventListener('click', (event: PointerEvent) => {
            this.#onDayClick(event, date);
        });

        refRow.append(refCell);
    }

    #getCell(date: Date): HTMLElement {
        return this.refRoot.querySelector(
            `.${CELL_CLASS}[${DATA_DATE}="${convertDateToString(date)}"]`
        );
    }

    #updateCurrentDate(element: Element) {
        const date = element.getAttribute(DATA_DATE);
        this.currentDate = new Date(`${date}:00:00:000`);
    }

    #updateClassCurrentDate(element: Element) {
        const elementCurrentDate = document.querySelector(
            `.${CELL_CURRENT_CLASS}`
        );

        elementCurrentDate?.classList.remove(CELL_CURRENT_CLASS);
        element.classList.add(CELL_CURRENT_CLASS);

        if (this.#classNames?.currentDateSelected) {
            elementCurrentDate?.classList.remove(
                this.#classNames.currentDateSelected
            );

            element.classList.add(this.#classNames.currentDateSelected);
        }
    }

    #updateRowSelected() {
        const elementRowCurrentDate = document.querySelector(
            `.${ROW_SELECTED_CLASS}`
        );

        elementRowCurrentDate.classList.remove(ROW_SELECTED_CLASS);

        const elementCurrentDate = document.querySelector(
            `.${CELL_CURRENT_CLASS}`
        );
        elementCurrentDate?.parentElement.classList.add(ROW_SELECTED_CLASS);

        if (this.#classNames?.weekSelectedModifier) {
            elementRowCurrentDate?.classList.remove(
                `${this.#classNames.weekSelectedModifier}`
            );

            elementCurrentDate?.parentElement?.classList.add(
                this.#classNames.weekSelectedModifier
            );
        }
    }

    #updateSelectedCell() {
        if (!this.refRoot) return;

        const pastSelectedCell: HTMLElement = this.#getCell(
            this.#pastSelectedDate
        );

        const nextSelectedCell: HTMLElement = this.#getCell(this.#selectedDate);

        const pastSelectedCellIsFocus =
            pastSelectedCell === document.activeElement;

        if (pastSelectedCell) {
            pastSelectedCell.setAttribute('tabindex', '-1');
            pastSelectedCell.setAttribute('aria-selected', 'false');
            pastSelectedCell.classList.remove(CELL_SELECTED_CLASS);

            this.#removeKeydowEventListener(pastSelectedCell);
        }

        if (nextSelectedCell) {
            nextSelectedCell.setAttribute('tabindex', '0');
            nextSelectedCell.setAttribute('aria-selected', '');
            nextSelectedCell.classList.add(CELL_SELECTED_CLASS);

            this.#addKeydowEventListener(nextSelectedCell);
        }

        if (pastSelectedCellIsFocus) {
            nextSelectedCell?.focus();
        }

        if (
            nextSelectedCell &&
            isDateRangeSameDate({
                start: this.#selectedDate,
                end: this.currentDate,
            })
        ) {
            this.#updateClassCurrentDate(nextSelectedCell);
            this.#updateRowSelected();
        }
    }

    #addDays(date: string, days: number): Date {
        const newDate = new Date(`${date}:00:00:000`);

        newDate.setDate(newDate.getDate() + days);
        return newDate;
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
        this.#callbacks.dayClickCallbacks.forEach(
            (callback: (event: PointerEvent, date: Date) => void) =>
                callback(event, date)
        );
    }

    #onKeydown(event: KeyboardEvent): void {
        const refCell = event.target as HTMLElement;

        const setSelectedDate = (dayToAdd: number): void => {
            this.selectedDate = this.#addDays(
                refCell.getAttribute(DATA_DATE),
                dayToAdd
            );
        };

        switch (event.code) {
            case KEY_ARROW_LEFT:
                setSelectedDate(-1);
                break;
            case KEY_ARROW_RIGHT:
                setSelectedDate(1);
                break;
            case KEY_ARROW_UP:
                setSelectedDate(-7);
                break;
            case KEY_ARROW_DOWN:
                setSelectedDate(7);
                break;
            case KEY_ENTER:
            case KEY_SPACE:
                this.#updateCurrentDate(refCell);
                break;
        }
    }

    #addKeydowEventListener(refCell: HTMLElement): void {
        refCell.addEventListener('keydown', this.#keydowEvent);
        this.#refWithKeydownEvent.add(refCell);
    }

    #removeKeydowEventListener(refCell: HTMLElement): void {
        refCell.removeEventListener('keydown', this.#keydowEvent);
        this.#refWithKeydownEvent.delete(refCell);
    }

    #removeAllKeydownEventListener(): void {
        Array.from(this.#refWithKeydownEvent).forEach((refCell) => {
            refCell.removeEventListener('keydown', this.#keydowEvent);
        });
        this.#refWithKeydownEvent = new Set();
    }
}
