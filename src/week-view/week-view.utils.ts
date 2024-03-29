import { LOCALE_EN } from '../utils/locales';
import { B5rWeekOptions, B5rWeekViewMode } from './week-view.def';

export const ROOT_CLASS = 'b5r-week';
export const HEADER_CLASS = `${ROOT_CLASS}__header`;
export const HEADER_DAY_CLASS = `${ROOT_CLASS}__header-day`;
export const HEADER_WEEKDAY_CLASS = `${ROOT_CLASS}__header-weekday`;
export const HEADER_COLUMN_CLASS = `${ROOT_CLASS}__header-column`;
export const BODY_CLASS = `${ROOT_CLASS}__body`;
export const ALL_DAY_EVENT_CLASS = `${ROOT_CLASS}__all-day-event`;
export const ALL_DAY_EVENT_STARTS_OUT_OF_VIEW_CLASS = `${ALL_DAY_EVENT_CLASS}--starts-out-of-view`;
export const ALL_DAY_EVENT_ENDS_OUT_OF_VIEW_CLASS = `${ALL_DAY_EVENT_CLASS}--ends-out-of-view`;
export const ALL_DAY_AREA_CLASS = `${ROOT_CLASS}__all-day-area`;
export const EVENT_CLASS = `${ROOT_CLASS}__event`;
export const COLUMNS_CLASS = `${ROOT_CLASS}__columns`;
export const COLUMN_CLASS = `${ROOT_CLASS}__column`;
export const COLUMN_WEEKEND_CLASS = `${COLUMN_CLASS}--weekend`;
export const COLUMN_TODAY_CLASS = `${COLUMN_CLASS}--today`;
export const DAY_COLUMN_CLASS = `${ROOT_CLASS}__day-column`;
export const BACKGROUND_CLASS = `${ROOT_CLASS}__background`;
export const CURRENT_TIME_CLASS = `${ROOT_CLASS}__current-time`;

export const DEFAULT_OPTIONS: B5rWeekOptions = {
    mode: B5rWeekViewMode.SevenDays,
    currentDate: new Date(),
    locale: LOCALE_EN,
};

export const B5R_WEEK_VIEW_STYLE_ID = 'B5rWeekViewStyle';
