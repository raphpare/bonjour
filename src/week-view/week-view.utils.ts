import { BjEvent, BjEventClassName, LOCAL_FR_CA } from '../utils/index';

export interface BjWeekOptions {
    mode?: BjWeekViewMode;
    currentDate?: Date, 
    local?:  string,
    classNames?: BjWeekClassName,
    customProperties?: BjWeekCustomProperties,
    callbacks?: BjWeekCallbacks,
}

export enum BjWeekViewMode {
    SevenDays = '7-days',
    ThreeDays = '3-days',
    OneDay = '1-day'
}

export interface BjWeekClassName {
    event?: BjEventClassName,
    body?: string,
    header?: string,
    headerColumn?: string,
    headerDay?: string,
    headerMonth?: string,
    columnWeekend?: string,
    columnToday?: string,
    today?: {
        headerColumn?: string,
        headerDay?: string,
        headerMonth?: string,
    }
}

export interface BjWeekCustomProperties {
    ['--time-area-width']?: string,
    ['--day-height']?: string,
    ['--number-of-columns']?: string;
    ['--border-color']?: string;
    ['--background-weekend']?: string;
    ['--background-today']?: string;
}

export interface BjWeekCallbacks {
    updated: () => void,
    eventOnClick: (PointerEvent: PointerEvent, currentEvent: BjEvent) => void,
}


export const ROOT_CLASS = 'bj-week'
export const HEADER_CLASS = `${ROOT_CLASS}__header`;
export const HEADER_DAY_CLASS = `${ROOT_CLASS}__header-day`;
export const HEADER_MONTH_CLASS = `${ROOT_CLASS}__header-month`;
export const HEADER_COLUMN_CLASS = `${ROOT_CLASS}__header-column`;
export const BODY_CLASS = `${ROOT_CLASS}__body`;
export const ALL_DAY_EVENT_CLASS = `${ROOT_CLASS}__all-day-event`;
export const ALL_DAY_AREA_CLASS = `${ROOT_CLASS}__all-day-area`;
export const EVENT_CLASS = `${ROOT_CLASS}__event`;
export const COLUMNS_CLASS = `${ROOT_CLASS}__columns`;
export const COLUMN_CLASS = `${ROOT_CLASS}__column`;
export const COLUMN_WEEKEND_CLASS = `${COLUMN_CLASS}--weekend`;
export const COLUMN_TODAY_CLASS = `${COLUMN_CLASS}--today`;
export const DAY_COLUMN_CLASS = `${ROOT_CLASS}__day-column`;
export const BACKGROUND_CLASS = `${ROOT_CLASS}__background`;

export const DEFAULT_OPTIONS: BjWeekOptions = { 
    mode: BjWeekViewMode.SevenDays,
    currentDate: new Date(),
    local:  LOCAL_FR_CA
}

export const BJ_WEEK_VIEW_STYLE_ID = 'BjWeekViewStyle';
