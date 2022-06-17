import { LOCAL_FR_CA, DAY_MS, isDateRangeOverlap, getDaysBetween, generateUuid, BjEvent, BjInternalEvent, BjDateRange,  isTodayDate, } from '../utils/index';
import { ALL_DAY_AREA_CLASS, ALL_DAY_EVENT_CLASS, BACKGROUND_CLASS, DEFAULT_OPTIONS, BJ_WEEK_VIEW_STYLE_ID, BjWeekCallbacks, BjWeekClassName, BjWeekCustomCSSProperties, BjWeekOptions, BjWeekViewMode, BODY_CLASS, COLUMNS_CLASS, COLUMN_CLASS, COLUMN_TODAY_CLASS, COLUMN_WEEKEND_CLASS, DAY_COLUMN_CLASS, EVENT_CLASS, HEADER_CLASS, HEADER_COLUMN_CLASS, HEADER_DAY_CLASS, HEADER_MONTH_CLASS, ROOT_CLASS } from './week-view.utils';
import cssText from './week-view.css';
 
export class BjWeekView {
    events: BjEvent[] = [];
    refRoot: HTMLElement = null;
    refEvents: HTMLElement[] = [];
    refHeader: HTMLElement = null;
    refAllDayArea:HTMLElement = null;
    refAllDayEvents: HTMLElement[] = [];
    refBody: HTMLElement = null;
    refDayColumns: HTMLElement[] = [];
    #mode: BjWeekViewMode = BjWeekViewMode.SevenDays;
    #nbDaysDisplayed: number = 7;
    #local: string = LOCAL_FR_CA;
    #classNames: BjWeekClassName = null;
    #datesDisplayed: Date[] = [];
    #currentDate: Date = new Date();
    #weekEvents: BjInternalEvent[] = [];
    #callbacks: BjWeekCallbacks;

    constructor(
        element: HTMLElement,
        options: BjWeekOptions,
    ) {
        if (!document.getElementById(BJ_WEEK_VIEW_STYLE_ID)) {
            document.head.insertAdjacentHTML('beforeend', `<style id="${BJ_WEEK_VIEW_STYLE_ID}">${cssText}</style>`);
        }
        options = {
            ...DEFAULT_OPTIONS,
            ...options
        }
        this.mode = options.mode;
        this.#currentDate = options.currentDate;
        this.#setDatesDisplayed(options.currentDate);
        this.#local = options.local;
        this.#classNames = options.classNames;
        this.#createTemplate(element);
        this.#setCustomCSSProperties(options?.customCSSProperties);

        if(options.callbacks) {
            this.#callbacks = options.callbacks;
        }
    }

    set mode(mode: BjWeekViewMode) {
        this.#mode = mode;
        switch(mode) {
            case BjWeekViewMode.OneDay:
                this.#nbDaysDisplayed = 1;
                break;
            case BjWeekViewMode.ThreeDays:
                this.#nbDaysDisplayed = 3;
                break;
            case BjWeekViewMode.SevenDays:
                this.#nbDaysDisplayed = 7;
        }

        if (this.refRoot) {
            this.destroy();
            this.#setDatesDisplayed(this.#currentDate);
            this.#createTemplate();
            this.updateView();
        }
    }

    get mode(): BjWeekViewMode {
        return this.#mode;
    }

    set local(local: string) {
        this.#local = local;
        this.updateView();
    }

    get local(): string {
        return this.#local;
    }

    get datesDisplayed(): Date[] {
        return this.#datesDisplayed;   
    }

    get dateRangesDisplayed(): BjDateRange {
        const dateFin = this.datesDisplayed[this.datesDisplayed.length - 1];
        return {
            start: this.datesDisplayed[0],
            end: new Date(dateFin.getFullYear(), dateFin.getMonth(), dateFin.getDate(), 23, 59, 59)
        }
    }

    set weekEvents(events: BjEvent[]) {
        this.events = events;
        const initEvents: BjInternalEvent[] = events;

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

            if (!(
                    yearStart === yearEnd 
                    && monthStart === monthEnd 
                    && dateStart === dateEnd
                ) && currentEvent.allDay !== true
            ) {
                const newEventStart: BjInternalEvent = {...currentEvent};
                newEventStart._id = generateUuid();
                newEventStart.dateRange = {
                    start: eventStart,
                    end: new Date(new Date(yearStart,monthStart,dateStart).getTime() + DAY_MS - 1)
                };
    
                const newEventEnd: BjInternalEvent = {...currentEvent};
                newEventEnd._id = generateUuid();
                newEventEnd.dateRange = {
                    start: new Date(yearEnd, monthEnd, dateEnd),
                    end: eventEnd
                };
                initEvents.splice(index, 1);
                
                initEvents.push(newEventStart);
                initEvents.push(newEventEnd);
    
                let daysBetween = getDaysBetween(
                    newEventStart.dateRange.end,
                    newEventEnd.dateRange.start
                );
    
                while (daysBetween > 0) {
                    const start: Date = new Date(yearStart, monthStart, dateStart + daysBetween);
                    const eventBetweenStartAndEnd: BjInternalEvent = {...currentEvent};
                    eventBetweenStartAndEnd._id = generateUuid();
                    eventBetweenStartAndEnd.dateRange = {
                        start,
                        end: new Date(start.getTime() + DAY_MS - 1)
                    };
    
                    initEvents.push(eventBetweenStartAndEnd);
                    daysBetween--;
                }
            }
        }
            
        const sortEvents: BjInternalEvent[] = initEvents.sort((a, b) => 
            a.dateRange.start.getTime() - b.dateRange.start.getTime() 
            || a.dateRange.end.getTime() - b.dateRange.end.getTime()
        );

        this.#weekEvents = sortEvents.map(((event) => {
            const eventsOverlapped = sortEvents.filter(
                (e) => (isDateRangeOverlap(event.dateRange, e.dateRange) || event === e) && e.allDay === undefined
            );
            
            if (eventsOverlapped.length > 1) {
                event._overlapped = {
                    index: eventsOverlapped.indexOf(event),
                    eventIds: eventsOverlapped.map(e => e._id),
                };
            }
            return event;
        }));
    }

    get weekEvents(): BjInternalEvent[] {
        return this.#weekEvents;
    }

    get dayOfWeek(): string[] {
        return this.#datesDisplayed.map(d => 
            d.toLocaleString(this.local, { weekday: 'short', day: 'numeric'})
        );   
    }

    get dayOfWeekAriaLabel(): string[] {
        return this.#datesDisplayed.map(d => 
            d.toLocaleString(this.local, {  day: 'numeric', month: 'long', year: 'numeric'})
        );   
    }

    get datesOfWeek(): string[] {
        return this.#datesDisplayed.map(d => 
            d.toLocaleString(this.local, { year: 'numeric', month: '2-digit', day: '2-digit' })
        );   
    }

    setEvents(events: BjEvent[] = []): Promise<void> {
        return new Promise<void>((resolve) => {
            this.deleteAllEvents();
            if (events !== this.weekEvents) {
                this.weekEvents = events;
            }
            this.#createAllEvents();
            resolve();
        })
    }

    async updateView(): Promise<void> {
        this.refRoot.querySelector(`.${HEADER_CLASS} .${COLUMNS_CLASS}`).innerHTML = this.#getHeaderColumnsContainTemplate();
        await this.setEvents(this.weekEvents);
        this.#updateBackgroundTemplate();
        this.#updated();
    }

    goToToday(): Promise<Date> {
        return new Promise<Date>((resolve) => {
            this.#currentDate = new Date();
            this.#setDatesDisplayed(this.#currentDate);
            this.updateView();
            resolve(this.#currentDate);
        })
    }

    goToNextDate(): Promise<Date[]> {
        return new Promise<Date[]>((resolve) => {
            this.#currentDate.setDate(this.#currentDate.getDate() + this.#nbDaysDisplayed);
            this.#setDatesDisplayed(this.#currentDate);
            this.updateView();
            resolve(this.datesDisplayed);
        });
    }

    goToPreviousDate(): Promise<Date[]> {
        return new Promise<Date[]>((resolve) => {
            this.#currentDate.setDate(this.#currentDate.getDate() - this.#nbDaysDisplayed);
            this.#setDatesDisplayed(this.#currentDate);
            this.updateView();
            resolve(this.datesDisplayed);
        });
    }

    deleteAllEvents(): void {
        if (this.refEvents) {
            let indexEvent = this.refEvents.length;
            while (indexEvent--) {
                const refEvent = this.refEvents[indexEvent];
                const event: BjEvent = this.weekEvents.filter(e => e.allDay !== true)[indexEvent];
                refEvent.removeEventListener('click', this.#eventOnClick.bind(this, event));
                refEvent.remove();
            }
        }

        if (this.refAllDayEvents) {
            let indexEvent = this.refAllDayEvents.length;
            while (indexEvent--) {
                const refEvent = this.refAllDayEvents[indexEvent];
                const event: BjEvent = this.weekEvents.filter(e => e.allDay === true)[indexEvent];
                refEvent.removeEventListener('click', this.#eventOnClick.bind(this, event));
                refEvent.remove();
            }
        }
    }

    destroy(): void {
        this.deleteAllEvents();
        this.refRoot.innerHTML = '';
        this.refRoot.classList.remove(ROOT_CLASS);
    }

    #setDatesDisplayed(currentDate: Date): void {
        this.#datesDisplayed = [];
        
        for (let i = 0; i < this.#nbDaysDisplayed; i++) {
            let date = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 0, 0, 0);
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
        const bodyScrollabrWidth = this.refHeader.clientWidth - this.refBody.clientWidth;
        this.refHeader.style.width = `calc(100% - ${bodyScrollabrWidth}px)`;
    }

    #setCustomCSSProperties(customCSSProperties?: BjWeekCustomCSSProperties): void {
        if (!customCSSProperties) return;
        for (const propertie in customCSSProperties) {
            this.refRoot.style.setProperty(propertie, customCSSProperties[propertie]);
        }
    }

    #updated(): void {
        if(!this.#callbacks.updated) return;
        this.#callbacks.updated();
    }

    #createAllEvents(): void {
        if (this.refDayColumns.length === 0) return;
       
        let columnIndex = 0;
        while (columnIndex < this.refDayColumns.length) {
            const refCurrentColumn = this.refDayColumns[columnIndex];
        
            let eventIndex = 0;
            while (eventIndex < this.weekEvents.length) {
                const event = this.weekEvents[eventIndex];

                if (isDateRangeOverlap(this.dateRangesDisplayed, event.dateRange)) {
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
        
        this.refAllDayEvents = Array.from(this.refRoot.querySelectorAll(`.${ALL_DAY_EVENT_CLASS}`));
        this.refEvents = Array.from(this.refRoot.querySelectorAll(`.${EVENT_CLASS}`));
    }

    #createEvent(event: BjInternalEvent, refColumn: HTMLElement, indexColumn: number): void {
        const dateStart: Date = event.dateRange.start;
        const currentColumnDate: string = this.datesOfWeek[indexColumn].replace(/-/g, '');
        const currentEventDate: string = dateStart.toLocaleString(
            this.local, 
            { year: 'numeric', month: '2-digit', day: '2-digit' }
        ).replace(/-/g, '');
        
        if (currentEventDate !== currentColumnDate || event.allDay === true) return;
        
        const dateEnd: Date = event.dateRange.end;

        const eventStartTime: Number = dateStart.getHours() + dateStart.getMinutes() / 60;
        const eventEndTime: Number = dateEnd.getHours() + dateEnd.getMinutes() / 60;
        const refEvent = document.createElement('button');
        refEvent.className = EVENT_CLASS;
        
        if (this.#classNames?.event?.root) {
            refEvent.classList.add(this.#classNames.event.root);
        }
        
        if (event?.classNames?.root) {
            refEvent.classList.add(event.classNames.root);
        }

        refEvent.type = 'button';
        refEvent.disabled = event.disabled;
        refEvent.style.setProperty('--event-start-time', eventStartTime.toString());
        refEvent.style.setProperty('--event-end-time', eventEndTime.toString());


        if (event._overlapped) {
            const maxEventIds = event._overlapped.eventIds.reduce((acc, cur) => {
                const currentEvent = this.#weekEvents.find((e) => e._id === cur);

                if (currentEvent?._overlapped?.eventIds?.length > acc.length) {
                    acc = currentEvent._overlapped.eventIds;
                }
                
                return acc;
            }, []);

            refEvent.style.setProperty('--number-overlapped-events', maxEventIds.length.toString());
            refEvent.style.setProperty('--index-overlapped-events', maxEventIds.indexOf(event._id).toString());
        }

        refEvent.append(this.#getTitleAreaTemplate(event, EVENT_CLASS));
        refEvent.addEventListener('click', this.#eventOnClick.bind(this, event));
        refColumn.append(refEvent);
    }

    #createAllDayEvent(event: BjInternalEvent): void {
        if (!isDateRangeOverlap(this.dateRangesDisplayed, event.dateRange)) return;

        const refAllDayEvent = document.createElement('button');
        refAllDayEvent.type = 'button';
        refAllDayEvent.className = ALL_DAY_EVENT_CLASS;
        refAllDayEvent.disabled = event.disabled;
        
        const indexStart = event.dateRange.start < this.dateRangesDisplayed.start ? 0 : getDaysBetween(this.dateRangesDisplayed.start, event.dateRange.start);
        const indexEnd = event.dateRange.end > this.dateRangesDisplayed.end ? this.datesDisplayed.length : getDaysBetween(this.dateRangesDisplayed.start, event.dateRange.end) + 1;
        refAllDayEvent.style.setProperty('--index-start', indexStart.toString());
        refAllDayEvent.style.setProperty('--index-end', indexEnd > this.#nbDaysDisplayed ? this.#nbDaysDisplayed.toString() : indexEnd.toString());
        refAllDayEvent.style.setProperty('--number-of-columns', this.#nbDaysDisplayed.toString());
        
        refAllDayEvent.append(this.#getTitleAreaTemplate(event, ALL_DAY_EVENT_CLASS));

        refAllDayEvent.addEventListener('click', this.#eventOnClick.bind(this, event));

        this.refAllDayArea.append(refAllDayEvent);
    }
    
    #getTitleAreaTemplate(event: BjInternalEvent, className: string): HTMLElement {
        const refTitleArea = document.createElement('span');
        refTitleArea.className = `${className}-title-area`;

        refTitleArea.append(this.#getTileEventTemplate(event, `${className}-title`));

        if (event.subtitle) {
            refTitleArea.append(this.#getSubtileEventTemplate(event, `${className}-subtitle`));
        }

        return refTitleArea;
    }

    #getTileEventTemplate(event: BjInternalEvent, className: string): HTMLElement {
        const refTitle = document.createElement('span');
        refTitle.className = className;
        refTitle.innerHTML = event.title;

        if (this.#classNames?.event?.title) {
            refTitle.classList.add(this.#classNames.event.title);
        }

        if (event?.classNames?.title) {
            refTitle.classList.add(event.classNames.title);
        }

        return refTitle;
    }

    #getSubtileEventTemplate(event: BjInternalEvent, className: string): HTMLElement {
        const refSubitle = document.createElement('span');
        refSubitle.className = className;
        refSubitle.innerHTML = event.subtitle;

        if (this.#classNames?.event?.subtitle) {
            refSubitle.classList.add(this.#classNames?.event?.subtitle);
        }

        if (event?.classNames?.subtitle) {
            refSubitle.classList.add(event.classNames.subtitle);
        }

        return refSubitle;
    }

    #eventOnClick(currentEvent: BjInternalEvent, pointerEvent: PointerEvent): void {
        if (!this.#callbacks.eventOnClick) return;
        currentEvent = {...currentEvent};

        delete currentEvent._id;
        delete currentEvent._overlapped;

        this.#callbacks.eventOnClick(pointerEvent, currentEvent);
    }

    #getHeaderTemplate(): HTMLElement {
        this.refHeader = document.createElement('header');
        this.refHeader.className = HEADER_CLASS;
        if (this.#classNames?.header) {
            this.refHeader.classList.add(this.#classNames.header);
        }
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
        for(let i = 0; i < this.#nbDaysDisplayed; i++) {
            let day = this.dayOfWeek[i];
            let headerColumnClass = HEADER_COLUMN_CLASS;
            let headerDayClass = HEADER_DAY_CLASS;
            let headerMonthClass = HEADER_MONTH_CLASS;

            if (this.#classNames?.headerColumn) {
                headerColumnClass += ` ${this.#classNames.headerColumn}`;
            }

            if (this.#classNames?.headerDay) {
                headerDayClass += ` ${this.#classNames.headerDay}`;
            }

            if (this.#classNames?.headerMonth) {
                headerMonthClass += ` ${this.#classNames.headerMonth}`;
            }

            const todayClassNames = this.#classNames?.today;

            if (isTodayDate(this.datesDisplayed[i]) && todayClassNames) {
                if (todayClassNames?.headerColumn) {
                    headerColumnClass += ` ${todayClassNames.headerColumn}`;
                }

                if (todayClassNames?.headerDay) {
                    headerDayClass += ` ${todayClassNames.headerDay}`;
                }
    
                if (todayClassNames?.headerMonth) {
                    headerMonthClass += ` ${todayClassNames.headerMonth}`;
                }
            }
            day = day.split(' ').map(d => `<span class="${ parseInt(d, 10) ? headerDayClass: headerMonthClass}">${d}</span>`).join(' ');
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
        this.refBody.classList.add(this.#classNames?.body);
        this.refBody.append(this.#getHourRowsTemplate());
        this.refBody.append(this.#getDayColumnsTemplate());
        return this.refBody;
    }

    #getBackgroundTemplate(): HTMLElement {
        const refBackground = document.createElement('div');
        refBackground.className = BACKGROUND_CLASS;
        refBackground.ariaHidden = 'true';

        for(let day = 0; day < this.#nbDaysDisplayed; day++) {
            const refColumn = document.createElement('div');
            refColumn.className = COLUMN_CLASS;
            refColumn.ariaHidden = 'true';

            const currentDay = this.datesDisplayed[day].getDay();

            if(currentDay === 0 || currentDay === 6) {
                refColumn.classList.add(COLUMN_WEEKEND_CLASS);
            }

            if (isTodayDate(this.datesDisplayed[day])) {
                refColumn.classList.add(COLUMN_TODAY_CLASS);
            }

            refBackground.append(refColumn);
        }
        return refBackground;
    }

    #updateBackgroundTemplate(): void {
        const refHeaderColumn: HTMLElement[] = Array.from(this.refRoot.querySelectorAll(`.${HEADER_CLASS} .${COLUMN_CLASS}`));
        const refBodyColumn: HTMLElement[] = Array.from(this.refRoot.querySelectorAll(`.${BODY_CLASS} .${COLUMN_CLASS}`));
        [refHeaderColumn, refBodyColumn].forEach(
            (refColumns => {
                refColumns.forEach((refColumn, i) => {
                    const currentDay = this.datesDisplayed[i].getDay();
                    if(currentDay === 0 || currentDay === 6) {
                        refColumn.classList.add(COLUMN_WEEKEND_CLASS);
                    } else {
                        refColumn.classList.remove(COLUMN_WEEKEND_CLASS);
                    }

                    if (isTodayDate(this.datesDisplayed[i])) {
                        refColumn.classList.add(COLUMN_TODAY_CLASS);
                    } else {
                        refColumn.classList.remove(COLUMN_TODAY_CLASS);
                    }
                });
            }
        ));
    }
    
    #getHourRowsTemplate(): HTMLElement {
        const refRows = document.createElement('div');
        refRows.className = `${ROOT_CLASS}__rows`;
        refRows.ariaHidden = 'true';
        refRows.append(this.#getBackgroundTemplate());

        for(let hour = 0; hour < 24; hour++) {
            const refHourRow = document.createElement('div');
            refHourRow.className = `${ROOT_CLASS}__hour-row`;
            refHourRow.ariaHidden = 'true';
            if (hour > 0) {
                refHourRow.setAttribute('data-hour', hour.toString());
            }
            refRows.append(refHourRow);
        }
        return refRows;
    }

    #getDayColumnsTemplate(): HTMLElement {
        const refColumns = document.createElement('div');
        refColumns.className = COLUMNS_CLASS;
        
        for(let day = 0; day < this.#nbDaysDisplayed; day++) {
            const refColumn = document.createElement('div');
            refColumn.className = DAY_COLUMN_CLASS;
            refColumn.setAttribute('aria-label', this.dayOfWeekAriaLabel[day]);
            refColumn.setAttribute('tabindex', '0');
            refColumns.append(refColumn);
        }
        this.refDayColumns = Array.from(refColumns.querySelectorAll(`.${DAY_COLUMN_CLASS}`));
        return refColumns;
    }
}