import { newDate, isTodayDate, getDaysBetween } from './date.utils';

describe('utils/date', () => {
    describe('newDate', () => {
        it('should create a new Date object with the current date and time if no options are provided', () => {
            const result = newDate({});
            const currentDate = new Date();
            expect(result.getFullYear()).toBe(currentDate.getFullYear());
            expect(result.getMonth()).toBe(currentDate.getMonth());
            expect(result.getDate()).toBe(currentDate.getDate());
            expect(result.getHours()).toBe(currentDate.getHours());
            expect(result.getMinutes()).toBe(currentDate.getMinutes());
            expect(result.getSeconds()).toBe(currentDate.getSeconds());
        });

        it('should create a new Date object based on the provided string date', () => {
            const result = newDate({ date: new Date(2023, 5, 15) });
            expect(result.getFullYear()).toBe(2023);
            expect(result.getMonth()).toBe(5);
            expect(result.getDate()).toBe(15);
        });

        it('should create a new Date object in the specified time zone', () => {
            const date = new Date();
            const timeZone = 'Europe/Paris';
            const result = newDate({
                date,
                timeZone,
            });
            const expectedTime = new Date(
                date.toLocaleString('en-US', {
                    timeZone: 'Europe/Paris',
                })
            );
            expect(result).toEqual(expectedTime);
        });
    });

    describe('isTodayDate', () => {
        it('should return true if the provided date is the same as the current date', () => {
            const today = new Date();
            const result = isTodayDate(today);
            expect(result).toBe(true);
        });

        it('should return false if the provided date is not the same as the current date', () => {
            const someDate = new Date(2023, 6, 15);
            const result = isTodayDate(someDate);
            expect(result).toBe(false);
        });

        it('should consider the specified time zone when comparing dates', () => {
            const someDate = new Date();
            const timeZone = 'America/New_York';
            const result = isTodayDate(someDate, timeZone);
            const today = newDate({ timeZone });
            expect(result).toBe(someDate.getDate() === today.getDate());
        });
    });

    describe('getDaysBetween', () => {
        it('should calculate the correct number of days between two dates', () => {
            const dateA = new Date(2023, 6, 10);
            const dateB = new Date(2023, 6, 15);
            const result = getDaysBetween(dateA, dateB);
            expect(result).toBe(6);
        });

        it('should handle dates that span across multiple months', () => {
            const dateA = new Date(2023, 5, 29);
            const dateB = new Date(2023, 6, 2);
            const result = getDaysBetween(dateA, dateB);
            expect(result).toBe(4);
        });

        it('should handle dates that span across multiple years', () => {
            const dateA = new Date(2022, 11, 30);
            const dateB = new Date(2023, 0, 2);
            const result = getDaysBetween(dateA, dateB);
            expect(result).toBe(4);
        });
    });
});
