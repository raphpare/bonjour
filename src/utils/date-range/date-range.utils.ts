import { B5rDateRange } from '../../models/date-range';

/**
 * Checks if two date ranges overlap with each other.
 * @param dateRangeA - The first date range to compare.
 * @param dateRangeB - The second date range to compare.
 * @returns True if the date ranges overlap, false otherwise.
 */
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

/**
 * Checks if a date range spans across the same year.
 * @param dateRange - The date range to check.
 * @returns True if the date range spans across the same year, false otherwise.
 */
export const isDateRangeSameYear = (dateRange: B5rDateRange): boolean =>
    dateRange.start.getFullYear() === dateRange.end.getFullYear();

/**
 * Checks if a date range spans across the same month and year.
 * @param dateRange - The date range to check.
 * @returns True if the date range spans across the same month and year, false otherwise.
 */
export const isDateRangeSameMonth = (dateRange: B5rDateRange): boolean =>
    isDateRangeSameYear(dateRange) &&
    dateRange.start.getMonth() === dateRange.end.getMonth();

/**
 * Checks if a date range spans across the same date, month, and year.
 * @param dateRange - The date range to check.
 * @returns True if the date range spans across the same date, month, and year, false otherwise.
 */
export const isDateRangeSameDate = (dateRange: B5rDateRange): boolean =>
    isDateRangeSameMonth(dateRange) &&
    dateRange.start.getDate() === dateRange.end.getDate();
