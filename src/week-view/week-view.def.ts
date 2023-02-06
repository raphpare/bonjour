import { B5rEventClassName } from '../models/event';

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
