import { B5rEventClickCallback, B5rUpdateCallback } from './callbacks';
import { B5rEvent } from './event';

export interface CalendarView {
    events: B5rEvent[];
    currentDate: Date;
    today: () => Promise<Date>;
    previous: () => Promise<Date[]>;
    next: () => Promise<Date[]>;
    setEvents: (events: B5rEvent[]) => Promise<void>;
    deleteAllEvents: () => void;
    destroy: () => void;
    onUpdate: (callback: B5rUpdateCallback) => void;
    onEventClick: (callback: B5rEventClickCallback) => void;
}
