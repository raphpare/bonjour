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
    event?: string;
    headerRow?: string;
    row?: string;
    rowSelected?: string;
    headerCell?: string;
    cell?: string;
    cellCurrentDate?: string;
    cellSelectedDate?: string;
    todayCell?: string;
    weekendCell?: string;
    dayNumber?: string;
    dayOutMonth?: string;
}

export interface B5rMonthDesignTokens {
    ['--event-background']?: string;
    ['--event-width']?: string;
    ['--event-height']?: string;
    ['--background']?: string;
    ['--cell-height']?: string;
    ['--cell-align-items']?: string;
    ['--cell-padding']?: string;
    ['--day-min-width']?: string;
    ['--day-min-height']?: string;
    ['--day-border-radius']?: string;
    ['--day-border']?: string;
    ['--day-color']?: string;
    ['--day-color-hover']?: string;
    ['--day-color-focus']?: string;
    ['--day-color-active']?: string;
    ['--day-background']?: string;
    ['--day-background-hover']?: string;
    ['--day-background-focus']?: string;
    ['--day-background-active']?: string;
    ['--selected-day-color']?: string;
    ['--selected-day-background']?: string;
    ['--selected-day-border']?: string;
    ['--current-day-color']?: string;
    ['--current-day-background']?: string;
    ['--current-day-border']?: string;
    ['--today-color']?: string;
    ['--today-background']?: string;
    ['--today-border']?: string;
    ['--row-background']?: string;
    ['--selected-row-background']?: string;
    ['--header-background']?: string;
    ['--cell-selected-color']?: string;
    ['--cell-selected-background']?: string;
    ['--out-of-month-day-color']?: string;
    ['--out-of-month-day-background']?: string;
    ['--out-of-month-day-border']?: string;
}

export type B5rDateCallback = (date: Date) => void;

export interface B5rMonthCallbacks {
    selectedDateChange: B5rDateCallback[];
    currentDateChange: B5rDateCallback[];
}
