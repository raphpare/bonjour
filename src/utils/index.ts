export const LOCAL_FR_CA = 'fr-CA';
export const SECOND_MS = 1000;
export const MINUTE_MS = SECOND_MS * 60;
export const HOUR_MS = MINUTE_MS * 60;
export const DAY_MS = HOUR_MS * 24;

export interface BjEvent {
    id: string,
    title: string,
    subtitle?: string,
    allDay?: boolean,
    classNames?: BjEventClassName,
    ariaLabel?: string,
    disabled?: boolean,
    dateRange: {
        start: Date,
        end: Date
    }
}

export interface BjInternalEvent extends BjEvent {
    _id?: string, 
    _overlapped?: {
        eventIds?: string[],
    }
    _position?: string
}

export interface BjEventClassName { 
    title?: string,
    subtitle?: string
    root?: string
}

export interface BjDateRange {
    start: Date,
    end: Date
}

export const isTodayDate = (someDate: Date) => {
    const today = new Date();
    return someDate.getDate() == today.getDate() &&
        someDate.getMonth() == today.getMonth() &&
        someDate.getFullYear() == today.getFullYear()
}

export const isDateRangeOverlap = (dateRangeA: BjDateRange, dateRangeB: BjDateRange): boolean => {
    const timeRangeA = {
        start: dateRangeA.start.getTime(),
        end: dateRangeA.end.getTime(),
    }
    const timeRangeB = {
        start: dateRangeB.start.getTime(),
        end: dateRangeB.end.getTime(),
    }
    return (timeRangeA.start >= timeRangeB.start && timeRangeA.start <= timeRangeB.end || timeRangeB.start >= timeRangeA.start && timeRangeB.start <= timeRangeA.end)
};

export const getDaysBetween = (dateA, dateB) => {
    const differenceMs = Math.abs(dateA - dateB);
    return Math.round(differenceMs / DAY_MS);
};

export const generateUuid = (): string => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
};