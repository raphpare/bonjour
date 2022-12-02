import { B5rDateRange } from '../../models/date-range';

export const isDateRangeOverlap = (
    dateRangeA: B5rDateRange,
    dateRangeB: B5rDateRange
): boolean => {
    const timeRangeA = {
        start: dateRangeA.start.getTime(),
        end: dateRangeA.end.getTime(),
    };
    const timeRangeB = {
        start: dateRangeB.start.getTime(),
        end: dateRangeB.end.getTime(),
    };
    return (
        (timeRangeA.start >= timeRangeB.start &&
            timeRangeA.start <= timeRangeB.end) ||
        (timeRangeB.start >= timeRangeA.start &&
            timeRangeB.start <= timeRangeA.end)
    );
};
