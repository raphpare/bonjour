import { B5rEventClickCallback, B5rUpdateCallback } from '../models/callbacks';

export interface B5rMonthOptions {
    currentDate?: Date;
    locale?: string;
    timeZone?: string;
}

export type B5rDayClickCallback = (event: PointerEvent, date: Date) => void;

export interface B5rMonthCallbacks {
    updateCallbacks: B5rUpdateCallback[];
    eventClickCallbacks: B5rEventClickCallback[];
    dayClickCallbacks: B5rDayClickCallback[];
}
