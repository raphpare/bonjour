/**
 * Creates a new Date object based on the provided options.
 * If no options are provided, the current date and time will be used.
 * If a string date is provided, it will be parsed into a Date object.
 * @param options - The options for creating the new Date object.
 * @returns The new Date object.
 */
export const newDate = (options: {
    date?: Date | string;
    timeZone?: string;
}): Date => {
    let date: Date = options.date as Date;

    if (!options.date) {
        date = new Date();
    } else if (typeof options.date === 'string') {
        date = new Date(options.date);
    }

    return options.timeZone
        ? new Date(date.toLocaleString('en-US', { timeZone: options.timeZone }))
        : date;
};

/**
 * Checks if the provided date is the same as the current date.
 * @param someDate - The date to compare.
 * @param timeZone - The optional time zone to consider when comparing dates.
 * @returns True if the provided date is the same as the current date, otherwise false.
 */
export const isTodayDate = (someDate: Date, timeZone?: string): boolean => {
    const today = newDate({ timeZone: timeZone });
    return (
        someDate.getDate() == today.getDate() &&
        someDate.getMonth() == today.getMonth() &&
        someDate.getFullYear() == today.getFullYear()
    );
};

/**
 * Calculates the number of days between two dates.
 * @param dateA - The first date.
 * @param dateB - The second date.
 * @returns The number of days between the two dates.
 */
export const getDaysBetween = (dateA: Date, dateB: Date): number => {
    let dateIncrementer = dateA.getTime();
    let numberDays = 0;

    while (
        dateIncrementer <
        new Date(
            dateB.getFullYear(),
            dateB.getMonth(),
            dateB.getDate(),
            23,
            59,
            59
        ).getTime()
    ) {
        const date = new Date(dateIncrementer);
        numberDays++;

        dateIncrementer = new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate() + 1
        ).getTime();
    }
    return numberDays;
};
