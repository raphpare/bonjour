import {
    ALL_DAY_AREA_CLASS,
    ALL_DAY_EVENT_CLASS,
    BACKGROUND_CLASS,
    DEFAULT_OPTIONS,
    B5R_WEEK_VIEW_STYLE_ID,
    BODY_CLASS,
    COLUMNS_CLASS,
    COLUMN_CLASS,
    COLUMN_TODAY_CLASS,
    COLUMN_WEEKEND_CLASS,
    DAY_COLUMN_CLASS,
    EVENT_CLASS,
    HEADER_CLASS,
    HEADER_COLUMN_CLASS,
    HEADER_DAY_CLASS,
    HEADER_WEEKDAY_CLASS,
    ROOT_CLASS,
    ALL_DAY_EVENT_ENDS_OUT_OF_VIEW_CLASS,
    ALL_DAY_EVENT_STARTS_OUT_OF_VIEW_CLASS,
    CURRENT_TIME_CLASS,
} from './week-view.utils';
import {
    B5rWeekCallbacks,
    B5rWeekClassNames,
    B5rWeekDesignTokens,
    B5rWeekOptions,
    B5rWeekViewMode,
} from './week-view.def';
import { cloneEvents, sortEvents } from '../utils/event';
import { B5rEventClickCallback, B5rUpdateCallback } from '../models/callbacks';
import { CalendarView } from '../models/calendar-view';
import { B5rEvent, B5rInternalEvent } from '../models/event';
import { B5rDateRange } from '../models/date-range';
import { injectStyleTag } from '../utils/stylesheets';
import { generateUuid } from '../utils/uuid';
import { isDateRangeOverlap, isDateRangeSameDate } from '../utils/date-range';
import cssText from './week-view.css';
import { LOCALE_EN } from '../utils/locales';
import { newDate, getDaysBetween, isTodayDate } from '../utils/date';
import {
    addDesignTokenOnElement,
    addClassOnElement,
    removeClassOnElement,
} from '../utils/dom';

export class B5rWeekView implements CalendarView {
    refRoot: HTMLElement = null;
    refHeader: HTMLElement = null;
    refAllDayArea: HTMLElement = null;
    refBody: HTMLElement = null;
    refDayColumns: HTMLElement[] = [];
    refCurrentTime: HTMLElement = null;

    #mode: B5rWeekViewMode = B5rWeekViewMode.SevenDays;
    #nbDaysDisplayed = 7;
    #locale: string = LOCALE_EN;
    #timeZone?: string;
    #classNames: B5rWeekClassNames = {};
    #datesDisplayed: Date[] = [];
    #currentDate: Date;
    #eventsClone: B5rEvent[] = [];
    #internalEvents: B5rInternalEvent[] = [];
    #intervalCurrentTime?: NodeJS.Timer;
    #callbacks: B5rWeekCallbacks = {
        update: [],
        eventClick: [],
    };

    constructor(element: HTMLElement, options?: B5rWeekOptions) {
        injectStyleTag(B5R_WEEK_VIEW_STYLE_ID, cssText);

        options = {
            ...DEFAULT_OPTIONS,
            ...options,
        };
        this.mode = options.mode;
        this.#timeZone = options.timeZone;
        this.currentDate =
            options.currentDate || newDate({ timeZone: options.timeZone });
        this.#locale = options.locale;
        this.#classNames = options.classNames;

        this.#createTemplate(element);
        this.#setDesignTokens(options?.designTokens);
        this.#updateCurrentTimeTemplate();
    }

    /**
     * Set the mode of the week view.
     * @param mode - The mode to set.
     */
    set mode(mode: B5rWeekViewMode) {
        this.#mode = mode;
        switch (mode) {
            case B5rWeekViewMode.OneDay:
                this.#nbDaysDisplayed = 1;
                break;
            case B5rWeekViewMode.ThreeDays:
                this.#nbDaysDisplayed = 3;
                break;
            case B5rWeekViewMode.SevenDays:
                this.#nbDaysDisplayed = 7;
        }

        if (!this.refRoot) return;
        this.destroy();
        this.#setDatesDisplayed(this.currentDate);
        this.#createTemplate();
        this.updateView();
    }

    /**
     * Get the current mode of the week view.
     * @returns The current mode.
     */
    get mode(): B5rWeekViewMode {
        return this.#mode;
    }

    /**
     * Set the current date of the week view.
     * @param currentDate - The current date to set.
     */
    set currentDate(currentDate: Date) {
        if (this.currentDate === currentDate) return;
        this.#currentDate = currentDate;
        this.#setDatesDisplayed(currentDate);
        this.updateView();
    }

    /**
     * Get the current date of the week view.
     * @returns The current date.
     */
    get currentDate(): Date {
        return this.#currentDate;
    }

    /**
     * Set the locale of the week view.
     * @param locale - The locale to set.
     */
    set locale(locale: string) {
        this.#locale = locale;
        this.updateView();
    }

    /**
     * Get the locale of the week view.
     * @returns The locale.
     */
    get locale(): string {
        return this.#locale;
    }

    /**
     * Get the events send to the week view.
     * @returns The events in the week view.
     */
    get events(): B5rEvent[] {
        return this.#eventsClone;
    }

    /**
     * Get the dates displayed in the week view.
     * @returns The dates displayed.
     */
    get datesDisplayed(): Date[] {
        return this.#datesDisplayed;
    }

    /**
     * Get the date range displayed in the week view.
     * @returns The date range displayed.
     */
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

    /**
     * Set the events in the week view.
     * If there are events, these are deleted and replaced by the new events passed in parameters
     * @param events - The events to set.
     */
    setEvents(events: B5rEvent[] = []): void {
        if (events === this.#events) return;
        this.#events = events;
        this.#createAllEvents();
    }

    /**
     * Set the current date of the week view to today's date.
     * @returns The today's date.
     */
    today(): Date {
        this.currentDate = this.#todayDate;
        return this.currentDate;
    }

    /**
     * Go to the next set of dates in the week view.
     * @returns The updated dates displayed.
     */
    next(): Date[] {
        this.currentDate = new Date(
            this.currentDate.setDate(
                this.currentDate.getDate() + this.#nbDaysDisplayed
            )
        );
        return this.datesDisplayed;
    }

    /**
     * Go to the previous set of dates in the week view.
     * @returns The updated dates displayed.
     */
    previous(): Date[] {
        this.currentDate = new Date(
            this.currentDate.setDate(
                this.currentDate.getDate() - this.#nbDaysDisplayed
            )
        );
        return this.datesDisplayed;
    }

    /**
     * Update the view of the week.
     */
    updateView(): void {
        if (!this.refRoot) return;

        this.refRoot.querySelector(
            `.${HEADER_CLASS} .${COLUMNS_CLASS}`
        ).innerHTML = this.#getHeaderColumnsContainTemplate();

        this.#createAllEvents();
        this.#updateCurrentTimeTemplate();
        this.#updateBackgroundTemplate();
        this.#updated();
    }

    /**
     * Update the design tokens of the week view.
     * @param designTokens - The design tokens to update.
     */
    updateDesignTokens(designTokens: B5rWeekDesignTokens): void {
        this.#setDesignTokens(designTokens);
    }

    /**
     * Destroy the week view instance.
     */
    destroy(): void {
        this.#deleteAllEvents();
        clearInterval(this.#intervalCurrentTime);
        this.refRoot.innerHTML = '';
        this.refRoot.classList.remove(ROOT_CLASS);
    }

    /**
     * Scroll to the current time in the week view.
     * @param offsetTopToAdd - The additional offset top to add to the scroll position.
     */
    scrollToCurrentTime(offsetTopToAdd = 0): void {
        requestAnimationFrame(() => {
            if (!this.refCurrentTime || !this.refHeader) return;

            window.scrollTo(
                0,
                this.refCurrentTime.getBoundingClientRect().top -
                    this.refHeader.getBoundingClientRect().height +
                    offsetTopToAdd
            );
        });
    }

    /**
     * Register a callback function to be invoked when the week view is updated.
     * @param callback - The callback function to be registered.
     */
    onUpdate(callback: B5rUpdateCallback): void {
        this.#callbacks.update.push(callback);
    }

    /**
     * Register a callback function to be invoked when an event is clicked.
     * @param callback - The callback function to be registered.
     */
    onEventClick(callback: B5rEventClickCallback): void {
        this.#callbacks.eventClick.push(callback);
    }

    set #events(events: B5rEvent[]) {
        this.#eventsClone = cloneEvents(events);

        const initEvents: B5rInternalEvent[] = cloneEvents(events);

        let index = events.length;

        while (index--) {
            const currentEvent = initEvents[index];
            const eventStart = currentEvent.dateRange.start;
            const eventEnd = currentEvent.dateRange.end;
            const yearStart = eventStart.getFullYear();
            const monthStart = eventStart.getMonth();
            const dateStart = eventStart.getDate();
            const yearEnd = eventEnd.getFullYear();
            const monthEnd = eventEnd.getMonth();
            const dateEnd = eventEnd.getDate();

            currentEvent._id = generateUuid();
            currentEvent._dateRange = {
                start: new Date(eventStart),
                end: new Date(eventEnd.getTime() - 1),
            };

            if (
                !isDateRangeSameDate(currentEvent.dateRange) &&
                currentEvent.allDay !== true
            ) {
                currentEvent._dateRange.end = new Date(
                    yearStart,
                    monthStart,
                    dateStart,
                    23,
                    59,
                    59
                );

                const newEventEnd: B5rInternalEvent = { ...currentEvent };
                newEventEnd._id = generateUuid();
                newEventEnd._dateRange = {
                    start: new Date(yearEnd, monthEnd, dateEnd),
                    end: eventEnd,
                };

                initEvents.push(newEventEnd);

                let daysBetween =
                    getDaysBetween(
                        currentEvent._dateRange.end,
                        newEventEnd._dateRange.start
                    ) - 2;

                while (daysBetween > 0) {
                    const start: Date = new Date(
                        yearStart,
                        monthStart,
                        dateStart + daysBetween
                    );

                    const eventBetweenStartAndEnd: B5rInternalEvent = {
                        ...currentEvent,
                    };
                    eventBetweenStartAndEnd._id = generateUuid();
                    eventBetweenStartAndEnd._dateRange = {
                        start,
                        end: new Date(
                            start.getFullYear(),
                            start.getMonth(),
                            start.getDate(),
                            23,
                            59,
                            59
                        ),
                    };

                    initEvents.push(eventBetweenStartAndEnd);
                    daysBetween--;
                }
            }
        }

        const sortedEvents: B5rInternalEvent[] = sortEvents(initEvents);

        this.#internalEvents = sortedEvents.map((event) => {
            const eventsOverlapped = sortedEvents.filter(
                (e) =>
                    (isDateRangeOverlap(event._dateRange, e._dateRange) ||
                        event === e) &&
                    e.allDay === event.allDay
            );

            if (eventsOverlapped.length > 1) {
                const eventIds = eventsOverlapped.map(
                    (e: B5rInternalEvent) => e._id
                );
                event._overlapped = {
                    index: eventIds.indexOf(event._id),
                    eventIds,
                };
            }

            return event;
        });
    }

    get #events(): B5rInternalEvent[] {
        return this.#internalEvents;
    }

    get #allDayEventsDisplayed(): B5rInternalEvent[] {
        return this.#events.filter(
            (event) =>
                isDateRangeOverlap(
                    this.dateRangesDisplayed,
                    event._dateRange
                ) && event?.allDay === true
        );
    }

    get #dayOfWeek(): string[] {
        return this.datesDisplayed.map((d) =>
            d.toLocaleString(this.locale, { weekday: 'short', day: 'numeric' })
        );
    }

    get #datesOfWeek(): string[] {
        return this.#datesDisplayed.map((d) =>
            d.toLocaleString(this.locale, {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
            })
        );
    }

    #setDatesDisplayed(currentDate: Date): void {
        this.#datesDisplayed = [];

        const startDay = this.#nbDaysDisplayed === 7 ? currentDate.getDay() : 0;

        for (let i = 0; i < this.#nbDaysDisplayed; i++) {
            const date = new Date(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                currentDate.getDate() + i - startDay
            );

            this.#datesDisplayed.push(date);
        }
    }

    get #todayDate(): Date {
        return newDate({ timeZone: this.#timeZone });
    }

    #createTemplate(element?: HTMLElement): void {
        if (element) {
            this.refRoot = element;
        }
        this.refRoot.className = ROOT_CLASS;
        this.refRoot.append(this.#getHeaderTemplate());
        this.refRoot.append(this.#getBodyTemplate());

        // When the body has a vertical scrollbar,
        // the header columns must be aligned with the body columns
        const bodyScrollabrWidth =
            this.refHeader.clientWidth - this.refBody.clientWidth;
        this.refHeader.style.width = `calc(100% - ${bodyScrollabrWidth}px)`;
    }

    #setDesignTokens(designTokens?: B5rWeekDesignTokens): void {
        addDesignTokenOnElement(
            this.refRoot,
            designTokens as Record<string, string>
        );
    }

    #updated(): void {
        if (!this.#callbacks.update) return;

        this.#callbacks.update.forEach((callback) => callback());
    }

    #createAllEvents(): void {
        this.#deleteAllEvents();

        if (this.refDayColumns.length === 0) return;

        let columnIndex = 0;
        while (columnIndex < this.refDayColumns.length) {
            const refCurrentColumn = this.refDayColumns[columnIndex];

            let eventIndex = 0;
            while (eventIndex < this.#events.length) {
                const event = this.#events[eventIndex];

                if (
                    isDateRangeOverlap(
                        this.dateRangesDisplayed,
                        event._dateRange
                    )
                ) {
                    if (event._position) {
                        delete event._position;
                    }

                    if (event?.allDay === true && columnIndex === 0) {
                        this.#createAllDayEvent(event);
                    } else {
                        this.#createEvent(event, refCurrentColumn, columnIndex);
                    }
                }
                eventIndex++;
            }
            columnIndex++;
        }

        this.refRoot.style.setProperty(
            '--number-of-columns',
            this.#nbDaysDisplayed.toString()
        );
    }

    #createEvent(
        event: B5rInternalEvent,
        refColumn: HTMLElement,
        indexColumn: number
    ): void {
        const dateStart: Date = event._dateRange.start;

        const currentColumnDate: string = this.#datesOfWeek[
            indexColumn
        ].replace(/-/g, '');

        const currentEventDate: string = dateStart
            .toLocaleString(this.locale, {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
            })
            .replace(/-/g, '');

        if (currentEventDate !== currentColumnDate || event.allDay === true)
            return;

        const dateEnd: Date = event._dateRange.end;

        const eventStartTime =
            dateStart.getHours() + dateStart.getMinutes() / 60;
        const eventEndTime = dateEnd.getHours() + dateEnd.getMinutes() / 60;
        const refEvent = document.createElement('button');
        refEvent.id = event._id;
        refEvent.className = EVENT_CLASS;

        addClassOnElement(refEvent, this.#classNames?.event?.root);
        addClassOnElement(refEvent, event?.classNames?.root);

        refEvent.setAttribute(
            'data-date-start',
            event.dateRange.start.toISOString()
        );

        refEvent.setAttribute(
            'data-date-end',
            event.dateRange.end.toISOString()
        );

        refEvent.type = 'button';
        refEvent.disabled = event.disabled;
        refEvent.setAttribute('aria-label', this.#getEventAriaLabel(event));
        refEvent.style.setProperty('--start-time', eventStartTime.toString());
        refEvent.style.setProperty('--end-time', eventEndTime.toString());

        addDesignTokenOnElement(
            refEvent,
            event?.designTokens as Record<string, string>
        );

        if (event._overlapped) {
            const numberOverlappingEvents = event._overlapped.eventIds.reduce(
                (acc, cur) => {
                    const currentEvent = this.#events.find(
                        (e) => e._id === cur
                    );

                    if (
                        currentEvent?._overlapped?.eventIds?.length >
                        acc?.eventIds?.length
                    ) {
                        const eventIds = currentEvent._overlapped.eventIds;
                        acc = {
                            columnNumber: Math.max(
                                ...eventIds.map(
                                    (id) =>
                                        this.#events.find((e) => e._id === id)
                                            ._overlapped.eventIds.length
                                )
                            ),
                            eventIds,
                        };
                    }

                    return acc;
                },
                { columnNumber: 0, eventIds: [] }
            ).columnNumber;

            const eventIds = event?._overlapped.eventIds;
            const isLastEvent = event._id == eventIds[eventIds.length - 1];
            let currentPosition = eventIds.indexOf(event._id);
            const idLastEventAdd = eventIds[currentPosition - 1];

            if (idLastEventAdd) {
                const positionLastEventAdd = this.#events.find(
                    (e) => e._id === idLastEventAdd
                )._position;
                if (Number(positionLastEventAdd)) {
                    currentPosition = Number(positionLastEventAdd) + 1;
                }
            }
            event._position = currentPosition.toString();

            refEvent.style.setProperty(
                '--index-start',
                currentPosition.toString()
            );

            refEvent.style.setProperty(
                '--index-end',
                isLastEvent
                    ? numberOverlappingEvents.toString()
                    : (currentPosition + 1).toString()
            );

            refEvent.style.setProperty(
                '--number-overlapping-events',
                numberOverlappingEvents.toString()
            );
        }

        refEvent.append(this.#getTitleAreaTemplate(event, EVENT_CLASS));
        refEvent.addEventListener(
            'click',
            this.#onEventClick.bind(this, event)
        );
        refColumn.append(refEvent);
    }

    #createAllDayEvent(event: B5rInternalEvent): void {
        if (!isDateRangeOverlap(this.dateRangesDisplayed, event.dateRange))
            return;

        const refAllDayEvent = document.createElement('button');
        refAllDayEvent.id = event._id;
        refAllDayEvent.className = ALL_DAY_EVENT_CLASS;
        refAllDayEvent.setAttribute(
            'aria-label',
            this.#getEventAriaLabel(event)
        );

        addClassOnElement(refAllDayEvent, this.#classNames?.event?.root);
        addClassOnElement(refAllDayEvent, event?.classNames?.root);

        refAllDayEvent.setAttribute(
            'data-date-start',
            event.dateRange.start.toISOString()
        );

        refAllDayEvent.setAttribute(
            'data-date-end',
            event.dateRange.end.toISOString()
        );

        refAllDayEvent.type = 'button';
        refAllDayEvent.disabled = event.disabled;

        const indexStart = Math.max(
            getDaysBetween(
                this.dateRangesDisplayed.start,
                event._dateRange.start
            ) - 1,
            0
        );
        const indexEnd = Math.min(
            getDaysBetween(
                this.dateRangesDisplayed.start,
                event._dateRange.end
            ),
            this.datesDisplayed.length
        );

        refAllDayEvent.style.setProperty(
            '--index-start',
            indexStart.toString()
        );

        if (event._dateRange.start < this.dateRangesDisplayed.start) {
            addClassOnElement(
                refAllDayEvent,
                ALL_DAY_EVENT_STARTS_OUT_OF_VIEW_CLASS
            );
        }

        if (event._dateRange.end > this.dateRangesDisplayed.end) {
            addClassOnElement(
                refAllDayEvent,
                ALL_DAY_EVENT_ENDS_OUT_OF_VIEW_CLASS
            );
        }

        refAllDayEvent.style.setProperty(
            '--index-end',
            indexEnd >= this.#nbDaysDisplayed
                ? this.#nbDaysDisplayed.toString()
                : indexEnd.toString()
        );

        if (!event?._overlapped) {
            refAllDayEvent.style.setProperty('--row-number', '1');
        } else {
            if (!event._position) {
                const eventIds = event?._overlapped.eventIds.filter((eventId) =>
                    this.#allDayEventsDisplayed
                        .find((e) => e._id === eventId)
                        ?._overlapped.eventIds.filter((id) => id === eventId)
                );
                let currentPosition = eventIds.indexOf(event._id);
                const overlappedEvents = eventIds.map((id) =>
                    this.#events.find((e) => e._id === id)
                );
                overlappedEvents.forEach((oe, index) => {
                    if (oe?._position === currentPosition.toString()) {
                        currentPosition = index - Number(oe._position);
                    }
                });
                event._position = currentPosition.toString();
            }

            refAllDayEvent.style.setProperty(
                '--row-number',
                (Number(event._position) + 1).toString()
            );
        }

        addDesignTokenOnElement(
            refAllDayEvent,
            event?.designTokens as Record<string, string>
        );

        refAllDayEvent.append(
            this.#getTitleAreaTemplate(event, ALL_DAY_EVENT_CLASS)
        );

        refAllDayEvent.addEventListener(
            'click',
            this.#onEventClick.bind(this, event)
        );

        this.refAllDayArea.append(refAllDayEvent);
    }

    #deleteAllEvents(): void {
        const refEvents = Array.from(
            this.refRoot.querySelectorAll(
                `.${ALL_DAY_EVENT_CLASS}, .${EVENT_CLASS}`
            )
        );

        if (!refEvents) return;

        let indexEvent = refEvents.length;

        while (indexEvent--) {
            const refEvent = refEvents[indexEvent];
            const event: B5rEvent = this.#events.find(
                (we) => we._id === refEvent.id
            );
            refEvent.removeEventListener(
                'click',
                this.#onEventClick.bind(this, event)
            );
            refEvent.remove();
        }
    }

    #getEventAriaLabel(event: B5rInternalEvent): string {
        const ariaLabels: string[] = [];

        if (event.title) {
            ariaLabels.push(event.title);
        }

        if (event.subtitle) {
            ariaLabels.push(event.subtitle);
        }

        if (event.dateRange.start) {
            const startLabel = event.dateRange.start.toLocaleString(
                this.locale,
                {
                    day: 'numeric',
                    year: 'numeric',
                    month: 'short',
                    hour: event.allDay ? undefined : 'numeric',
                    minute: event.allDay ? undefined : 'numeric',
                }
            );

            ariaLabels.push(startLabel);
        }

        return ariaLabels.join(' – ');
    }

    #getTitleAreaTemplate(
        event: B5rInternalEvent,
        className: string
    ): HTMLElement {
        const refTitleArea = document.createElement('span');
        refTitleArea.className = `${className}-title-area`;

        refTitleArea.append(
            this.#getTileEventTemplate(event, `${className}-title`)
        );

        if (event.subtitle) {
            refTitleArea.append(
                this.#getSubtileEventTemplate(event, `${className}-subtitle`)
            );
        }

        return refTitleArea;
    }

    #getTileEventTemplate(
        event: B5rInternalEvent,
        className: string
    ): HTMLElement {
        const refTitle = document.createElement('span');
        refTitle.className = className;
        refTitle.innerHTML = `${event.title} `;

        addClassOnElement(refTitle, this.#classNames?.event?.title);
        addClassOnElement(refTitle, event?.classNames?.title);

        return refTitle;
    }

    #getSubtileEventTemplate(
        event: B5rInternalEvent,
        className: string
    ): HTMLElement {
        const refSubitle = document.createElement('span');
        refSubitle.className = className;
        refSubitle.innerHTML = event.subtitle || '';

        addClassOnElement(refSubitle, this.#classNames?.event?.subtitle);
        addClassOnElement(refSubitle, event?.classNames?.subtitle);

        return refSubitle;
    }

    #onEventClick(
        eventClicked: B5rInternalEvent,
        pointerEvent: PointerEvent
    ): void {
        if (this.#callbacks.eventClick.length === 0) return;
        eventClicked = this.events.find((e) => e.id === eventClicked.id);

        this.#callbacks.eventClick.forEach((callback: B5rEventClickCallback) =>
            callback(pointerEvent, eventClicked)
        );
    }

    #getHeaderTemplate(): HTMLElement {
        this.refHeader = document.createElement('header');
        this.refHeader.className = HEADER_CLASS;
        addClassOnElement(this.refHeader, this.#classNames?.header);

        this.refHeader.append(
            this.#getBackgroundTemplate(),
            this.#getHeaderColumnsTemplate(),
            this.#getAllDayAreaTemplate()
        );

        return this.refHeader;
    }

    #getHeaderColumnsTemplate(): HTMLElement {
        const refHeaderColumns = document.createElement('div');
        refHeaderColumns.className = COLUMNS_CLASS;
        refHeaderColumns.innerHTML = this.#getHeaderColumnsContainTemplate();
        return refHeaderColumns;
    }

    #getHeaderColumnsContainTemplate(): string {
        const classNames = this.#classNames || {};
        const weekendClassName = classNames.weekendModifier || '';
        const todayClassName = classNames.todayModifier || '';
        let html = '';

        for (let i = 0; i < this.#nbDaysDisplayed; i++) {
            const day = this.#dayOfWeek[i];
            const currentDay = this.datesDisplayed[i].getDay();
            const isWeekend = currentDay === 0 || currentDay === 6;
            const isToday = isTodayDate(this.datesDisplayed[i], this.#timeZone);

            const headerColumnClass = `${HEADER_COLUMN_CLASS} ${
                classNames.headerColumn || ''
            } ${isWeekend ? weekendClassName : ''} ${
                isToday ? todayClassName : ''
            }`;
            const headerDayClass = `${HEADER_DAY_CLASS} ${
                classNames.headerDay || ''
            } ${isWeekend ? weekendClassName : ''} ${
                isToday ? todayClassName : ''
            }`;
            const headerWeekdayClass = `${HEADER_WEEKDAY_CLASS} ${
                classNames.headerWeekday || ''
            } ${isWeekend ? weekendClassName : ''} ${
                isToday ? todayClassName : ''
            }`;

            const formattedDay = day
                .split(' ')
                .map((d) => {
                    const selectedClass = parseInt(d, 10)
                        ? headerDayClass
                        : headerWeekdayClass;
                    return `<span class="${selectedClass}">${d}</span>`;
                })
                .join(' ');

            const columnHtml = `<div class="${headerColumnClass}" aria-hidden="true">${formattedDay}</div>`;
            html += columnHtml;
        }

        return html;
    }

    #getAllDayAreaTemplate(): HTMLElement {
        const refAllDayArea = document.createElement('div');
        refAllDayArea.className = ALL_DAY_AREA_CLASS;
        this.refAllDayArea = refAllDayArea;
        return refAllDayArea;
    }

    #getBodyTemplate(): HTMLElement {
        this.refBody = document.createElement('div');
        this.refBody.className = `${BODY_CLASS} ${
            this.#classNames?.body || ''
        }`;

        this.refBody.append(
            this.#getHourRowsTemplate(),
            this.#getDayColumnsTemplate()
        );
        return this.refBody;
    }

    #getBackgroundTemplate(): HTMLElement {
        const refBackground = document.createElement('div');
        refBackground.className = BACKGROUND_CLASS;
        refBackground.setAttribute('aria-hidden', 'true');

        for (let day = 0; day < this.#nbDaysDisplayed; day++) {
            const refColumn = document.createElement('div');
            refColumn.className = `${COLUMN_CLASS} ${
                this.#classNames?.bodyColumn || ''
            }`;
            refColumn.setAttribute('aria-hidden', 'true');

            const currentDay = this.datesDisplayed[day].getDay();

            if (currentDay === 0 || currentDay === 6) {
                addClassOnElement(refColumn, COLUMN_WEEKEND_CLASS);
                addClassOnElement(refColumn, this.#classNames?.weekendModifier);
            }

            if (isTodayDate(this.datesDisplayed[day], this.#timeZone)) {
                addClassOnElement(refColumn, COLUMN_TODAY_CLASS);
                addClassOnElement(refColumn, this.#classNames?.todayModifier);
            }

            refBackground.append(refColumn);
        }
        return refBackground;
    }

    #updateCurrentTimeTemplate(): void {
        const todayDateRange: B5rDateRange = {
            start: this.#todayDate,
            end: this.#todayDate,
        };

        if (!isDateRangeOverlap(this.dateRangesDisplayed, todayDateRange)) {
            clearInterval(this.#intervalCurrentTime);
            this.#intervalCurrentTime = null;

            if (this.refCurrentTime) {
                this.refCurrentTime.remove();
                this.refCurrentTime = null;
            }
            return;
        }

        if (!this.refCurrentTime) {
            this.refCurrentTime = document.createElement('div');
            this.refCurrentTime.classList.add(CURRENT_TIME_CLASS);
            this.#setCurrentTime();
        }

        if (!this.refBody.contains(this.refCurrentTime)) {
            this.refBody.append(this.refCurrentTime);
        }

        this.#startIntervalCurrentTime();
    }

    #startIntervalCurrentTime(): void {
        if (this.#intervalCurrentTime) return;

        this.#intervalCurrentTime = setInterval(() => {
            this.#setCurrentTime();
        }, 2000);
    }

    #setCurrentTime(): void {
        const position =
            this.#todayDate.getHours() * 60 + this.#todayDate.getMinutes();
        this.refCurrentTime.style.setProperty(
            '--current-time',
            position.toString()
        );
    }

    #updateBackgroundTemplate(): void {
        const refHeaderColumns: HTMLElement[] = Array.from(
            this.refRoot.querySelectorAll(`.${HEADER_CLASS} .${COLUMN_CLASS}`)
        );
        const refBodyColumns: HTMLElement[] = Array.from(
            this.refRoot.querySelectorAll(`.${BODY_CLASS} .${COLUMN_CLASS}`)
        );
        [refHeaderColumns, refBodyColumns].forEach((refColumns) => {
            refColumns.forEach((refColumn, i) => {
                const currentDay = this.datesDisplayed[i].getDay();

                if (currentDay === 0 || currentDay === 6) {
                    refColumn.classList.add(COLUMN_WEEKEND_CLASS);

                    addClassOnElement(
                        refColumn,
                        this.#classNames?.weekendModifier
                    );
                } else {
                    refColumn.classList.remove(COLUMN_WEEKEND_CLASS);

                    removeClassOnElement(
                        refColumn,
                        this.#classNames?.weekendModifier
                    );
                }

                if (isTodayDate(this.datesDisplayed[i], this.#timeZone)) {
                    refColumn.classList.add(COLUMN_TODAY_CLASS);

                    addClassOnElement(
                        refColumn,
                        this.#classNames?.todayModifier
                    );
                } else {
                    refColumn.classList.remove(COLUMN_TODAY_CLASS);

                    removeClassOnElement(
                        refColumn,
                        this.#classNames?.todayModifier
                    );
                }
            });
        });
    }

    #getHourRowsTemplate(): HTMLElement {
        const refRows = document.createElement('div');
        refRows.className = `${ROOT_CLASS}__rows`;
        refRows.ariaHidden = 'true';
        refRows.append(this.#getBackgroundTemplate());

        for (let hour = 0; hour < 24; hour++) {
            const refHourRow = document.createElement('div');
            refHourRow.className = `${ROOT_CLASS}__hour-row`;
            refHourRow.setAttribute('aria-hidden', 'true');

            if (hour > 0) {
                refHourRow.dataset.hour = hour.toString();
            }

            refRows.append(refHourRow);
        }
        return refRows;
    }

    #getDayColumnsTemplate(): HTMLElement {
        const refColumns = document.createElement('div');
        refColumns.className = COLUMNS_CLASS;

        const dayColumnElements: HTMLElement[] = [];

        for (let day = 0; day < this.#nbDaysDisplayed; day++) {
            const refColumn = document.createElement('div');
            refColumn.className = DAY_COLUMN_CLASS;
            refColumns.append(refColumn);
            dayColumnElements.push(refColumn);
        }

        this.refDayColumns = dayColumnElements;
        return refColumns;
    }
}
