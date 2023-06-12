import { B5rEvent, B5rInternalEvent } from '../../models/event';

/**
 * Clones an array of events and returns a new array with cloned event objects.
 * @param events - The array of events to clone.
 * @returns A new array of cloned event objects.
 */
export const cloneEvents = (events: B5rEvent[]): B5rEvent[] =>
    (JSON.parse(JSON.stringify([...events])) as B5rEvent[]).map((e) => ({
        ...e,
        dateRange: {
            start: new Date(e.dateRange.start),
            end: new Date(e.dateRange.end),
        },
    }));

/**
 * Sorts an array of internal events based on the date range.
 * @param events - The array of internal events to sort.
 * @returns The sorted array of internal events.
 */
export const sortEvents = (events: B5rInternalEvent[]): B5rInternalEvent[] =>
    events
        .sort(
            (a, b) =>
                b._dateRange.end.getTime() -
                b._dateRange.start.getTime() -
                (a._dateRange.end.getTime() - a._dateRange.start.getTime())
        )
        .sort(
            (a, b) =>
                a._dateRange.start.getTime() - b._dateRange.start.getTime()
        );
