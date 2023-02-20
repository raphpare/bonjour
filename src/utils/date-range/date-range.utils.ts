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

export const isDateRangeSameYear = (dateRange: B5rDateRange): boolean =>
    dateRange.start.getFullYear() === dateRange.end.getFullYear();

export const isDateRangeSameMonth = (dateRange: B5rDateRange): boolean =>
    isDateRangeSameYear(dateRange) &&
    dateRange.start.getMonth() === dateRange.end.getMonth();

export const isDateRangeSameDate = (dateRange: B5rDateRange): boolean =>
    isDateRangeSameMonth(dateRange) &&
    dateRange.start.getDate() === dateRange.end.getDate();
