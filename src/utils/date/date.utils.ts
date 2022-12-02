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

export const isTodayDate = (someDate: Date, timeZone?: string) => {
    const today = newDate({ timeZone: timeZone });
    return (
        someDate.getDate() == today.getDate() &&
        someDate.getMonth() == today.getMonth() &&
        someDate.getFullYear() == today.getFullYear()
    );
};

export const getDaysBetween = (dateA, dateB) => {
    const differenceMs = Math.abs(dateA - dateB);
    return Math.round(differenceMs / DAY_MS);
};
