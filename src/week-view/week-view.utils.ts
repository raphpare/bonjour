import { B5rEventClassName } from '../models/event';
import { LOCALE_EN } from '../utils/locales';

export interface B5rWeekOptions {
    mode?: B5rWeekViewMode;
    currentDate?: Date;
    locale?: string;
    timeZone?: string;
    classNames?: B5rWeekClassName;
    designTokens?: B5rWeekDesignTokens;
}

export enum B5rWeekViewMode {
    SevenDays = '7-days',
    ThreeDays = '3-days',
    OneDay = '1-day',
}

export interface B5rWeekClassName {
    event?: B5rEventClassName;
    body?: string;
    header?: string;
    headerColumn?: string;
    headerDay?: string;
    headerMonth?: string;
    columnWeekend?: string;
    columnToday?: string;
    today?: {
        headerColumn?: string;
        headerDay?: string;
        headerMonth?: string;
    };
}

export interface B5rWeekDesignTokens {
    ['--time-area-width']?: string;
    ['--hour-height']?: string;
    ['--border-color']?: string;
    ['--weekend-background']?: string;
    ['--today-background']?: string;
}

export const ROOT_CLASS = 'b5r-week';
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

export const DEFAULT_OPTIONS: B5rWeekOptions = {
    mode: B5rWeekViewMode.SevenDays,
    currentDate: new Date(),
    locale: LOCALE_EN,
};

export const B5R_WEEK_VIEW_STYLE_ID = 'B5rWeekViewStyle';
