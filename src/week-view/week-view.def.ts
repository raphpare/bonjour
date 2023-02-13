import { B5rEventClickCallback, B5rUpdateCallback } from '../models/callbacks';
import { B5rEventClassNames } from '../models/event';

export interface B5rWeekOptions {
    mode?: B5rWeekViewMode;
    currentDate?: Date;
    locale?: string;
    timeZone?: string;
    classNames?: B5rWeekClassNames;
    designTokens?: B5rWeekDesignTokens;
}

export enum B5rWeekViewMode {
    SevenDays = '7-days',
    ThreeDays = '3-days',
    OneDay = '1-day',
}

export interface B5rWeekClassNames {
    event?: B5rEventClassNames;
    header?: string;
    body?: string;
    headerColumn?: string;
    headerDay?: string;
    headerWeekday?: string;
    bodyColumn?: string;
    todayModifier?: string;
    weekendModifier?: string;
}

export interface B5rWeekDesignTokens {
    ['--time-area-width']?: string;
    ['--hour-height']?: string;
    ['--border-color']?: string;
    ['--weekend-background']?: string;
    ['--today-background']?: string;
    ['--background']?: string;
    ['--out-of-view-event-indicator-size']?: string;
}

export interface B5rWeekCallbacks {
    updateCallbacks: B5rUpdateCallback[];
    eventClickCallbacks: B5rEventClickCallback[];
}
