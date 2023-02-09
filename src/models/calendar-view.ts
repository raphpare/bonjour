import { B5rEventClickCallback, B5rUpdateCallback } from './callbacks';
import { B5rDateRange } from './date-range';
import { B5rEvent } from './event';

export interface CalendarView {
    events: B5rEvent[];
    currentDate: Date;
    locale: string;
    timeZone?: string;
    datesDisplayed: Date[];
    dateRangesDisplayed: B5rDateRange;
    refRoot: HTMLElement | null;
    refEvents: HTMLElement[];
    setEvents: (events: B5rEvent[]) => Promise<void>;
    today: () => Promise<Date>;
    previous: () => Promise<Date[]>;
    next: () => Promise<Date[]>;
    updateView: () => Promise<void> | void;
    deleteAllEvents: () => void;
    destroy: () => void;
    onUpdate: (callback: B5rUpdateCallback) => void;
    onEventClick: (callback: B5rEventClickCallback) => void;
}
