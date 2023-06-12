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
    setEvents: (events: B5rEvent[]) => void;
    today: () => Date;
    previous: () => Date[];
    next: () => Date[];
    updateView: () => void;
    destroy: () => void;
}
