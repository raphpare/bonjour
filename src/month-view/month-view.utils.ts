import { LOCALE_EN } from '../utils/locales';
import { B5rMonthOptions } from './month-view.def';

export const ROOT_CLASS = 'b5r-month';
export const HEADER_CLASS = `${ROOT_CLASS}__header`;
export const HEADER_COLUMN_CLASS = `${ROOT_CLASS}__body`;
export const DAY_CLASS = `${ROOT_CLASS}__day`;
export const DAY_BUTTON_CLASS = `${ROOT_CLASS}__day-button`;
export const DAY_BUTTON_TODAY_CLASS = `${DAY_BUTTON_CLASS}--today`;
export const LIST_EVENTS_CLASS = `${ROOT_CLASS}__list-events`;
export const EVENT_CLASS = `${ROOT_CLASS}__event`;
export const EVENT_BUTTON_CLASS = `${ROOT_CLASS}__event-button`;
export const HIDDEN_CLASS = `${ROOT_CLASS}__hidden`;

export const DEFAULT_OPTIONS: B5rMonthOptions = {
    currentDate: new Date(),
    locale: LOCALE_EN,
};

export const B5R_MONTH_VIEW_STYLE_ID = 'B5rMonthViewStyle';
