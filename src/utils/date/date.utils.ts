import { DAY_MS } from '../milliseconds';

export const isTodayDate = (someDate: Date) => {
    const today = new Date();
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
