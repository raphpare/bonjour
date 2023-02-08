import { LOCALE_EN } from '../utils/locales';
import { B5rWeekOptions, B5rWeekViewMode } from './week-view.def';

export const ROOT_CLASS = 'b5r-week';
export const HEADER_CLASS = `${ROOT_CLASS}__header`;
export const HEADER_DAY_NUMBER_CLASS = `${ROOT_CLASS}__header-day-number`;
export const HEADER_DAY_NAME_CLASS = `${ROOT_CLASS}__header-day-name`;
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

export const addClassOnElement = (element: HTMLElement, className?: string) => {
    if (!className) return;
    element.classList.add(className);
};

export const removeClassOnElement = (
    element: HTMLElement,
    className?: string
) => {
    if (!className) return;
    element.classList.remove(className);
};

export const addDesignTokenOnElement = (
    element: HTMLElement,
    designTokens?: Record<string, string>
) => {
    if (!designTokens) return;
    for (const propertie in designTokens) {
        if (designTokens[propertie]) {
            element.style.setProperty(propertie, designTokens[propertie]);
        }
    }
};
