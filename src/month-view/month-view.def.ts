import { B5rEventClassNames } from '../models';
import { B5rEventClickCallback, B5rUpdateCallback } from '../models/callbacks';

export interface B5rMonthOptions {
    currentDate?: Date;
    locale?: string;
    timeZone?: string;
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
    ['--day-align-items']?: string;
    ['--day-padding']?: string;
    ['--day-button-color']?: string;
    ['--day-button-color-hover']?: string;
    ['--day-button-color-focus']?: string;
    ['--day-button-color-active']?: string;
    ['--day-button-background']?: string;
    ['--day-button-background-hover']?: string;
    ['--day-button-background-focus']?: string;
    ['--day-button-background-active']?: string;
    ['--day-button-border-radius']?: string;
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
