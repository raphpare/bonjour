import { cloneEvents, sortEvents } from './event.utils';
import { B5rEvent, B5rInternalEvent } from '../../models/event';
import {
    EVENT_1_JEST_MOCK,
    INTERNAL_EVENT_1_JEST_MOCK,
    INTERNAL_EVENT_2_JEST_MOCK,
    INTERNAL_EVENT_3_JEST_MOCK,
    INTERNAL_EVENT_4_JEST_MOCK,
} from '../../mocks/events.mocks';

describe('utils/event', () => {
    describe('cloneEvents', () => {
        it('should create a deep copy of the events array', () => {
            const events: B5rEvent[] = [EVENT_1_JEST_MOCK];

            const clonedEvents = cloneEvents(events);

            expect(clonedEvents).toEqual(events);
            expect(clonedEvents).not.toBe(events);
        });
    });

    describe('sortEvents', () => {
        it('should sort the events array by date range', () => {
            const events: B5rInternalEvent[] = [
                INTERNAL_EVENT_1_JEST_MOCK,
                INTERNAL_EVENT_2_JEST_MOCK,
                INTERNAL_EVENT_3_JEST_MOCK,
                INTERNAL_EVENT_4_JEST_MOCK,
            ];

            const sortedEvents = sortEvents(events);

            // Verify that the events array is sorted by date range
            expect(sortedEvents).toEqual([
                INTERNAL_EVENT_4_JEST_MOCK,
                INTERNAL_EVENT_1_JEST_MOCK,
                INTERNAL_EVENT_3_JEST_MOCK,
                INTERNAL_EVENT_2_JEST_MOCK,
            ]);
        });
    });
});
