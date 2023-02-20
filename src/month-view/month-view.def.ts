import { B5rEventClassNames } from '../models';
import { B5rEventClickCallback, B5rUpdateCallback } from '../models/callbacks';

export type B5rWeekdayFormat = 'long' | 'short' | 'narrow';

export interface B5rMonthOptions {
    selectedDate?: Date;
    currentDate?: Date;
    locale?: string;
    timeZone?: string;
    weekdayFormat?: B5rWeekdayFormat;
    classNames?: B5rMonthClassNames;
    designTokens?: B5rMonthDesignTokens;
}

export interface B5rMonthClassNames {
    event?: B5rEventClassNames;
    header?: string;
    body?: string;
    day?: string;
    dayButton?: string;
    listEvents?: string;
    todayModifier?: string;
    weekendModifier?: string;
}

export interface B5rMonthDesignTokens {
    ['--day-height']?: string;
    ['--cell-align-items']?: string;
    ['--cell-padding']?: string;
    ['--day-number-min-width']?: string;
    ['--day-number-min-height']?: string;
    ['--day-number-color']?: string;
    ['--day-number-color-hover']?: string;
    ['--day-number-color-focus']?: string;
    ['--day-number-color-active']?: string;
    ['--day-number-background']?: string;
    ['--day-number-background-hover']?: string;
    ['--day-number-background-focus']?: string;
    ['--day-number-background-active']?: string;
    ['--day-number-border-radius']?: string;
    ['--today-color']?: string;
    ['--today-background']?: string;
    ['--background']?: string;
}

export type B5rDayClickCallback = (event: PointerEvent, date: Date) => void;

export interface B5rMonthCallbacks {
    updateCallbacks: B5rUpdateCallback[];
    eventClickCallbacks: B5rEventClickCallback[];
    dayClickCallbacks: B5rDayClickCallback[];
}
