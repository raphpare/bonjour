import { B5rEvent, B5rInternalEvent } from '../../models/event';

export const cloneEvents = (events: B5rEvent[]): B5rEvent[] =>
    JSON.parse(
        JSON.stringify(
            events.map((e) => ({
                ...e,
                dateRange: {
                    start: e.dateRange.start
                        ? new Date(e.dateRange.start)
                        : undefined,
                    end: e.dateRange.end
                        ? new Date(e.dateRange.end)
                        : undefined,
                },
            }))
        )
    ) as B5rEvent[];

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
