import { LOCALE_EN } from '../utils/locales';
import { B5rMonthOptions } from './month-view.def';

export const ROOT_CLASS = 'b5r-month';
export const ROW_CLASS = `${ROOT_CLASS}__row`;
export const ROW_SELECTED_CLASS = `${ROW_CLASS}--selected`;
export const ROW_HEADER_CLASS = `${ROW_CLASS}--header`;
export const CELL_CLASS = `${ROOT_CLASS}__cell`;
export const CELL_HEADER_CLASS = `${CELL_CLASS}--header`;
export const CELL_TODAY_CLASS = `${CELL_CLASS}--today`;
export const CELL_SELECTED_CLASS = `${CELL_CLASS}--selected`;
export const CELL_OUT_OF_MONTH_CLASS = `${CELL_CLASS}--out-of-month`;
export const CELL_CURRENT_CLASS = `${CELL_CLASS}--current`;
export const DAY_NUMBER_CLASS = `${ROOT_CLASS}__day-number`;
export const DAY_NUMBER_TODAY_CLASS = `${DAY_NUMBER_CLASS}--today`;
export const LIST_EVENTS_CLASS = `${ROOT_CLASS}__list-events`;
export const EVENT_CLASS = `${ROOT_CLASS}__event`;
export const EVENT_BUTTON_CLASS = `${ROOT_CLASS}__event-button`;
export const ROLE_GRID_CELL = 'gridcell';
export const DATA_DATE = 'data-date';
export const KEY_ARROW_LEFT = 'ArrowLeft';
export const KEY_ARROW_RIGHT = 'ArrowRight';
export const KEY_ARROW_UP = 'ArrowUp';
export const KEY_ARROW_DOWN = 'ArrowDown';
export const KEY_ENTER = 'Enter';
export const KEY_SPACE = 'Space';

export const DEFAULT_OPTIONS: B5rMonthOptions = {
    weekdayFormat: 'short',
    locale: LOCALE_EN,
};

export enum eventKey {}

export const B5R_MONTH_VIEW_STYLE_ID = 'B5rMonthViewStyle';
