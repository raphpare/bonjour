import {
    isDateRangeOverlap,
    isDateRangeSameYear,
    isDateRangeSameMonth,
    isDateRangeSameDate,
} from './date-range.utils';

describe('utils/date-range', () => {
    describe('isDateRangeOverlap', () => {
        it('should return true if the date ranges overlap', () => {
            const dateRangeA = {
                start: new Date(2022, 0, 1),
                end: new Date(2023, 0, 6),
            };
            const dateRangeB = {
                start: new Date(2023, 0, 5),
                end: new Date(2023, 0, 15),
            };

            const result = isDateRangeOverlap(dateRangeA, dateRangeB);

            expect(result).toBe(true);
        });

        it('should return false if the date ranges do not overlap', () => {
            const dateRangeA = {
                start: new Date(2023, 0, 1),
                end: new Date(2023, 0, 14),
            };
            const dateRangeB = {
                start: new Date(2023, 0, 15),
                end: new Date(2023, 0, 20),
            };

            const result = isDateRangeOverlap(dateRangeA, dateRangeB);

            expect(result).toBe(false);
        });
    });

    describe('isDateRangeSameYear', () => {
        it('should return true if the date range spans across the same year', () => {
            const dateRange = {
                start: new Date(2023, 0, 1),
                end: new Date(2023, 11, 28),
            };

            const result = isDateRangeSameYear(dateRange);

            expect(result).toBe(true);
        });

        it('should return false if the date range does not span across the same year', () => {
            const dateRange = {
                start: new Date(2023, 0, 1),
                end: new Date(2024, 0, 1),
            };

            const result = isDateRangeSameYear(dateRange);

            expect(result).toBe(false);
        });
    });

    describe('isDateRangeSameMonth', () => {
        it('should return true if the date range spans across the same month and year', () => {
            const dateRange = {
                start: new Date(2023, 0, 1),
                end: new Date(2023, 0, 28),
            };

            const result = isDateRangeSameMonth(dateRange);

            expect(result).toBe(true);
        });

        it('should return false if the date range does not span across the same month and year', () => {
            const dateRange = {
                start: new Date(2023, 1, 1),
                end: new Date(2023, 2, 1),
            };

            const result = isDateRangeSameMonth(dateRange);

            expect(result).toBe(false);
        });
    });

    describe('isDateRangeSameDate', () => {
        it('should return true if the date range spans across the same date, month, and year', () => {
            const dateRange = {
                start: new Date(2023, 0, 1, 5, 20),
                end: new Date(2023, 0, 1, 15, 30),
            };

            const result = isDateRangeSameDate(dateRange);

            expect(result).toBe(true);
        });

        it('should return false if the date range does not span across the same date, month, and year', () => {
            const dateRange = {
                start: new Date(2023, 0, 1),
                end: new Date(2023, 0, 2),
            };

            const result = isDateRangeSameDate(dateRange);

            expect(result).toBe(false);
        });
    });
});
