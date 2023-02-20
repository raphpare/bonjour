import { LOCALE_EN } from '../utils/locales';
import { B5rMonthOptions } from './month-view.def';

export const ROOT_CLASS = 'b5r-month';
export const BOBY_CLASS = `${ROOT_CLASS}__body`;
export const ROW_CLASS = `${ROOT_CLASS}__row`;
export const ROW_HEADER_CLASS = `${ROW_CLASS}--header`;
export const CELL_CLASS = `${ROOT_CLASS}__cell`;
export const CELL_HEADER_CLASS = `${CELL_CLASS}--header`;
export const CELL_TODAY_CLASS = `${CELL_CLASS}--today`;
export const DAY_NUMBER_CLASS = `${ROOT_CLASS}__day-number`;
export const DAY_NUMBER_TODAY_CLASS = `${DAY_NUMBER_CLASS}--today`;
export const LIST_EVENTS_CLASS = `${ROOT_CLASS}__list-events`;
export const EVENT_CLASS = `${ROOT_CLASS}__event`;
export const EVENT_BUTTON_CLASS = `${ROOT_CLASS}__event-button`;
export const HIDDEN_CLASS = `${ROOT_CLASS}__hidden`;

export const DEFAULT_OPTIONS: B5rMonthOptions = {
    currentDate: new Date(),
    weekdayFormat: 'short',
    locale: LOCALE_EN,
};

export const B5R_MONTH_VIEW_STYLE_ID = 'B5rMonthViewStyle';
