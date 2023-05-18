import { DAY_MS } from '../milliseconds';

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

export const isTodayDate = (someDate: Date, timeZone?: string): boolean => {
    const today = newDate({ timeZone: timeZone });
    return (
        someDate.getDate() == today.getDate() &&
        someDate.getMonth() == today.getMonth() &&
        someDate.getFullYear() == today.getFullYear()
    );
};

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
