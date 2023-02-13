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
    addClassOnElement,
    removeClassOnElement,
    addDesignTokenOnElement,
    ALL_DAY_EVENT_ENDS_OUT_OF_VIEW_CLASS,
    ALL_DAY_EVENT_STARTS_OUT_OF_VIEW_CLASS,
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
import { isDateRangeOverlap } from '../utils/date-range';
import cssText from './week-view.css';
import { LOCALE_EN } from '../utils/locales';
import { DAY_MS } from '../utils/milliseconds';
import { getDaysBetween, isTodayDate } from '../utils/date';
import { newDate } from '../utils/date/date.utils';

export class B5rWeekView implements CalendarView {
    refRoot: HTMLElement = null;
    refEvents: HTMLElement[] = [];
    refAllDayEvents: HTMLElement[] = [];
    refWeekEvents: HTMLElement[] = [];
    refHeader: HTMLElement = null;
    refAllDayArea: HTMLElement = null;
    refBody: HTMLElement = null;
    refDayColumns: HTMLElement[] = [];
    timeZone?: string;

    #mode: B5rWeekViewMode = B5rWeekViewMode.SevenDays;
    #nbDaysDisplayed = 7;
    #locale: string = LOCALE_EN;
    #classNames: B5rWeekClassNames = {};
    #datesDisplayed: Date[] = [];
    #currentDate: Date;
    #eventsClone: B5rEvent[] = [];
    #internalEvents: B5rInternalEvent[] = [];
    #callbacks: B5rWeekCallbacks = {
        updateCallbacks: [],
        eventClickCallbacks: [],
    };

    constructor(element: HTMLElement, options?: B5rWeekOptions) {
        injectStyleTag(B5R_WEEK_VIEW_STYLE_ID, cssText);

        options = {
            ...DEFAULT_OPTIONS,
            ...options,
        };
        this.mode = options.mode;
        this.timeZone = options.timeZone;
        this.currentDate =
            options.currentDate || newDate({ timeZone: options.timeZone });
        this.#locale = options.locale;
        this.#classNames = options.classNames;
        this.#createTemplate(element);
        this.#setDesignTokens(options?.designTokens);
    }

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

        if (this.refRoot) {
            this.destroy();
            this.#setDatesDisplayed(this.currentDate);
            this.#createTemplate();
            this.updateView();
        }
    }

    get mode(): B5rWeekViewMode {
        return this.#mode;
    }

    set currentDate(currentDate: Date) {
        this.#currentDate = currentDate;
        this.#setDatesDisplayed(currentDate);
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
        return this.#datesDisplayed;
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

    setEvents(events: B5rEvent[] = []): Promise<void> {
        return new Promise<void>((resolve) => {
            this.deleteAllEvents();
            if (events !== this.#events) {
                this.#events = events;
            }
            this.#createAllEvents();
            resolve();
        });
    }

    today(): Promise<Date> {
        return new Promise<Date>((resolve) => {
            this.currentDate = newDate({ timeZone: this.timeZone });
            resolve(this.currentDate);
        });
    }

    next(): Promise<Date[]> {
        return new Promise<Date[]>((resolve) => {
            this.currentDate = new Date(
                this.currentDate.setDate(
                    this.currentDate.getDate() + this.#nbDaysDisplayed
                )
            );
            resolve(this.datesDisplayed);
        });
    }

    previous(): Promise<Date[]> {
        return new Promise<Date[]>((resolve) => {
            this.currentDate = new Date(
                this.currentDate.setDate(
                    this.currentDate.getDate() - this.#nbDaysDisplayed
                )
            );
            resolve(this.datesDisplayed);
        });
    }

    async updateView(): Promise<void> {
        if (!this.refRoot) return;

        this.refRoot.querySelector(
            `.${HEADER_CLASS} .${COLUMNS_CLASS}`
        ).innerHTML = this.#getHeaderColumnsContainTemplate();

        await this.setEvents(this.#events);

        this.#updateCurrentTimeTemplate();
        this.#updateBackgroundTemplate();
        this.#updated();
    }

    deleteAllEvents(): void {
        if (!this.refEvents) return;

        let indexEvent = this.refEvents.length;
        while (indexEvent--) {
            const refEvent = this.refEvents[indexEvent];
            const event: B5rEvent = this.#events.find(
                (we) => we._id === refEvent.id
            );
            refEvent.removeEventListener(
                'click',
                this.#onEventClick.bind(this, event)
            );
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

    set #events(events: B5rEvent[]) {
        this.#eventsClone = cloneEvents(events);

        const initEvents: B5rInternalEvent[] = events;

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

            if (
                !(
                    yearStart === yearEnd &&
                    monthStart === monthEnd &&
                    dateStart === dateEnd
                ) &&
                currentEvent.allDay !== true
            ) {
                const newEventStart: B5rInternalEvent = { ...currentEvent };
                newEventStart._id = generateUuid();
                newEventStart.dateRange = {
                    start: eventStart,
                    end: new Date(
                        new Date(yearStart, monthStart, dateStart).getTime() +
                            DAY_MS -
                            1
                    ),
                };

                const newEventEnd: B5rInternalEvent = { ...currentEvent };
                newEventEnd._id = generateUuid();
                newEventEnd.dateRange = {
                    start: new Date(yearEnd, monthEnd, dateEnd),
                    end: eventEnd,
                };
                initEvents.splice(index, 1);

                initEvents.push(newEventStart);
                initEvents.push(newEventEnd);

                let daysBetween = getDaysBetween(
                    newEventStart.dateRange.end,
                    newEventEnd.dateRange.start
                );

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
                    eventBetweenStartAndEnd.dateRange = {
                        start,
                        end: new Date(start.getTime() + DAY_MS - 1),
                    };

                    initEvents.push(eventBetweenStartAndEnd);
                    daysBetween--;
                }
            }
        }

        const sortedEvents: B5rInternalEvent[] = sortEvents(initEvents);

        this.#internalEvents = sortedEvents.map((event) => {
            let eventsOverlapped = [];
            if (event.allDay) {
                eventsOverlapped = sortedEvents.filter(
                    (e) =>
                        (isDateRangeOverlap(event.dateRange, e.dateRange) ||
                            event === e) &&
                        e.allDay === true
                );
            } else {
                eventsOverlapped = sortedEvents.filter(
                    (e) =>
                        (isDateRangeOverlap(event.dateRange, e.dateRange) ||
                            event === e) &&
                        e.allDay !== true
                );
            }

            if (eventsOverlapped.length > 1) {
                event._overlapped = {
                    index: eventsOverlapped.indexOf(event._id),
                    eventIds: eventsOverlapped.map(
                        (e: B5rInternalEvent) => e._id
                    ),
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
                isDateRangeOverlap(this.dateRangesDisplayed, event.dateRange) &&
                event?.allDay === true
        );
    }

    get #dayOfWeek(): string[] {
        return this.datesDisplayed.map((d) =>
            d.toLocaleString(this.locale, { weekday: 'short', day: 'numeric' })
        );
    }

    get #dayOfWeekAriaLabel(): string[] {
        return this.datesDisplayed.map((d) =>
            d.toLocaleString(this.locale, {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
            })
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

        for (let i = 0; i < this.#nbDaysDisplayed; i++) {
            const date = new Date(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                currentDate.getDate()
            );

            if (this.#nbDaysDisplayed === 7) {
                date.setDate(date.getDate() - date.getDay() + i);
            } else {
                date.setDate(currentDate.getDate() + i);
            }

            this.#datesDisplayed.push(date);
        }
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
        if (!this.#callbacks.updateCallbacks) return;

        this.#callbacks.updateCallbacks.forEach((callback) => callback());
    }

    #createAllEvents(): void {
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
                        event.dateRange
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
        this.refAllDayEvents = Array.from(
            this.refRoot.querySelectorAll(`.${ALL_DAY_EVENT_CLASS}`)
        );
        this.refWeekEvents = Array.from(
            this.refRoot.querySelectorAll(`.${EVENT_CLASS}`)
        );
        this.refEvents = [...this.refAllDayEvents, ...this.refWeekEvents];
    }

    #createEvent(
        event: B5rInternalEvent,
        refColumn: HTMLElement,
        indexColumn: number
    ): void {
        const dateStart: Date = event.dateRange.start;
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

        const dateEnd: Date = event.dateRange.end;

        const eventStartTime =
            dateStart.getHours() + dateStart.getMinutes() / 60;
        const eventEndTime = dateEnd.getHours() + dateEnd.getMinutes() / 60;
        const refEvent = document.createElement('button');
        refEvent.id = event._id;
        refEvent.className = EVENT_CLASS;

        addClassOnElement(refEvent, this.#classNames?.event?.root);
        addClassOnElement(refEvent, event?.classNames?.root);

        refEvent.type = 'button';
        refEvent.disabled = event.disabled;
        refEvent.style.setProperty('--start-time', eventStartTime.toString());
        refEvent.style.setProperty('--end-time', eventEndTime.toString());

        addDesignTokenOnElement(
            refEvent,
            event?.designTokens as Record<string, string>
        );

        if (event._overlapped) {
            const numberOverlappingEvents =
                event._overlapped.eventIds.reduce(
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
                                    ...eventIds
                                        .filter((id) => id !== currentEvent._id)
                                        .map(
                                            (id) =>
                                                this.#events.find(
                                                    (e) => e._id === id
                                                )._overlapped.eventIds.length
                                        )
                                ),
                                eventIds,
                            };
                        }

                        return acc;
                    },
                    { columnNumber: 0, eventIds: [] }
                ).columnNumber - 1;

            const eventIds = event?._overlapped.eventIds;
            const isLastEvent = event._id == eventIds[eventIds.length - 1];
            let currentPosition = eventIds.indexOf(event._id);
            const idlastEventAdd = eventIds[currentPosition - 1];

            if (idlastEventAdd) {
                const positionLastEventAdd = this.#events.find(
                    (e) => e._id === idlastEventAdd
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

        addClassOnElement(refAllDayEvent, this.#classNames?.event?.root);
        addClassOnElement(refAllDayEvent, event?.classNames?.root);

        refAllDayEvent.type = 'button';
        refAllDayEvent.disabled = event.disabled;

        const indexStart =
            event.dateRange.start < this.dateRangesDisplayed.start
                ? 0
                : getDaysBetween(
                      this.dateRangesDisplayed.start,
                      event.dateRange.start
                  );
        const indexEnd =
            event.dateRange.end > this.dateRangesDisplayed.end
                ? this.datesDisplayed.length
                : getDaysBetween(
                      this.dateRangesDisplayed.start,
                      event.dateRange.end
                  ) + 1;
        refAllDayEvent.style.setProperty(
            '--index-start',
            indexStart.toString()
        );

        if (event.dateRange.start < this.dateRangesDisplayed.start) {
            addClassOnElement(
                refAllDayEvent,
                ALL_DAY_EVENT_STARTS_OUT_OF_VIEW_CLASS
            );
        }

        if (event.dateRange.end > this.dateRangesDisplayed.end) {
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
                const eventIds = event?._overlapped.eventIds.filter((event) =>
                    this.#allDayEventsDisplayed
                        .find((e) => e._id === event)
                        ?._overlapped.eventIds.filter((e) => e === event)
                );
                let currentPosition = eventIds.indexOf(event._id);
                const overlappedEvents = eventIds.map((id) =>
                    this.#events.find((we) => we._id === id)
                );
                overlappedEvents.forEach((oe, index) => {
                    if (oe?._position === currentPosition.toString()) {
                        currentPosition = index;
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
        if (this.#callbacks.eventClickCallbacks.length === 0) return;
        eventClicked = this.events.find((e) => e.id === eventClicked.id);

        this.#callbacks.eventClickCallbacks.forEach(
            (callback: B5rEventClickCallback) =>
                callback(pointerEvent, eventClicked)
        );
    }

    #getHeaderTemplate(): HTMLElement {
        this.refHeader = document.createElement('header');
        this.refHeader.className = HEADER_CLASS;

        addClassOnElement(this.refHeader, this.#classNames?.header);

        this.refHeader.append(this.#getBackgroundTemplate());
        this.refHeader.append(this.#getHeaderColumnsTemplate());
        this.refHeader.append(this.#getAllDayAreaTemplate());
        return this.refHeader;
    }

    #getHeaderColumnsTemplate(): HTMLElement {
        const refHeaderColumns = document.createElement('div');
        refHeaderColumns.className = COLUMNS_CLASS;
        refHeaderColumns.innerHTML = this.#getHeaderColumnsContainTemplate();
        return refHeaderColumns;
    }

    #getHeaderColumnsContainTemplate(): string {
        let html = ``;
        for (let i = 0; i < this.#nbDaysDisplayed; i++) {
            let day = this.#dayOfWeek[i];
            let headerColumnClass = HEADER_COLUMN_CLASS;
            let headerDayClass = HEADER_DAY_CLASS;
            let headerWeekdayClass = HEADER_WEEKDAY_CLASS;

            if (this.#classNames?.headerColumn) {
                headerColumnClass += ` ${this.#classNames.headerColumn}`;
            }

            if (this.#classNames?.headerDay) {
                headerDayClass += ` ${this.#classNames.headerDay}`;
            }

            if (this.#classNames?.headerWeekday) {
                headerWeekdayClass += ` ${this.#classNames.headerWeekday}`;
            }

            const weekendClassName = this.#classNames?.weekendModifier;
            const currentDay = this.datesDisplayed[i].getDay();

            if (currentDay === 0 || currentDay === 6) {
                headerColumnClass += ` ${weekendClassName}`;
                headerDayClass += ` ${weekendClassName}`;
                headerWeekdayClass += ` ${weekendClassName}`;
            }

            const todayClassName = this.#classNames?.todayModifier;

            if (
                isTodayDate(this.datesDisplayed[i], this.timeZone) &&
                todayClassName
            ) {
                headerColumnClass += ` ${todayClassName}`;
                headerDayClass += ` ${todayClassName}`;
                headerWeekdayClass += ` ${todayClassName}`;
            }
            day = day
                .split(' ')
                .map(
                    (d) =>
                        `<span class="${
                            parseInt(d, 10)
                                ? headerDayClass
                                : headerWeekdayClass
                        }">${d}</span>`
                )
                .join(' ');
            html += `<div class="${headerColumnClass}" aria-hidden="true">${day}</div>`;
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
        this.refBody.className = BODY_CLASS;

        addClassOnElement(this.refBody, this.#classNames?.body);

        this.refBody.append(this.#getHourRowsTemplate());
        this.refBody.append(this.#getDayColumnsTemplate());
        return this.refBody;
    }

    #getBackgroundTemplate(): HTMLElement {
        const refBackground = document.createElement('div');
        refBackground.className = BACKGROUND_CLASS;
        refBackground.ariaHidden = 'true';

        for (let day = 0; day < this.#nbDaysDisplayed; day++) {
            const refColumn = document.createElement('div');
            refColumn.className = COLUMN_CLASS;
            refColumn.ariaHidden = 'true';

            addClassOnElement(refColumn, this.#classNames?.bodyColumn);

            const currentDay = this.datesDisplayed[day].getDay();

            if (currentDay === 0 || currentDay === 6) {
                refColumn.classList.add(COLUMN_WEEKEND_CLASS);

                addClassOnElement(refColumn, this.#classNames?.weekendModifier);
            }

            if (isTodayDate(this.datesDisplayed[day], this.timeZone)) {
                refColumn.classList.add(COLUMN_TODAY_CLASS);

                addClassOnElement(refColumn, this.#classNames?.todayModifier);
            }

            refBackground.append(refColumn);
        }
        return refBackground;
    }

    #updateCurrentTimeTemplate(): void {
        // Si n'est pas semaine courante {
        //   Si (this.intervaleCurrenTime)
        //       clearIntervale(this.intervaleCurrenTime);
        //    Si (this.refCurrentTime) {
        //        refCurrentTime.remove();
        //    }
        //    return;
        //}
        // si (!this.refCurrentTime) {
        //      this.refCurrentTime = document.createElement('div');
        //      this.refCurrentTime = CURRENT_TIME_CLASS;
        //      this.refBody.append(this.refCurrentTime);
        //}
        // startIntervaleCurrentTime()
    }

    #startIntervaleCurrentTime(): void {
        // if (this.intervaleCurrenTime) return;
        // this.intervaleCurrenTime = setInterval(() => {
        //     this.refCurrentTime.setAttrinute(
        //         '--current-time',
        //         newDate(new date(), timezone)
        //     );
        // }, 1000);
        //
        // CSS
        // position: absolute;
        // top: 20px;
        // right: 0;
        // left: var(--time-area-width);
        // height: 2px;
        // background: red;
    }

    #updateBackgroundTemplate(): void {
        const refHeaderColumn: HTMLElement[] = Array.from(
            this.refRoot.querySelectorAll(`.${HEADER_CLASS} .${COLUMN_CLASS}`)
        );
        const refBodyColumn: HTMLElement[] = Array.from(
            this.refRoot.querySelectorAll(`.${BODY_CLASS} .${COLUMN_CLASS}`)
        );
        [refHeaderColumn, refBodyColumn].forEach((refColumns) => {
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

                if (isTodayDate(this.datesDisplayed[i], this.timeZone)) {
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
            refHourRow.ariaHidden = 'true';
            if (hour > 0) {
                refHourRow.setAttribute('data-hour', hour.toString());
            }
            refRows.append(refHourRow);
        }
        return refRows;
    }

    #getDayColumnsTemplate(): HTMLElement {
        const refColumns = document.createElement('div');
        refColumns.className = COLUMNS_CLASS;

        for (let day = 0; day < this.#nbDaysDisplayed; day++) {
            const refColumn = document.createElement('div');
            refColumn.className = DAY_COLUMN_CLASS;
            refColumn.setAttribute('aria-label', this.#dayOfWeekAriaLabel[day]);
            refColumn.setAttribute('tabindex', '0');
            refColumns.append(refColumn);
        }
        this.refDayColumns = Array.from(
            refColumns.querySelectorAll(`.${DAY_COLUMN_CLASS}`)
        );
        return refColumns;
    }
}
