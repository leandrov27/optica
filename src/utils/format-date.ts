import { dayjs } from "src/libs/dayjs";

// ----------------------------------------------------------------------

export function formatDate(date: Date | string): string {
    const formattedDate = dayjs(date).format('ddd DD MMM, YYYY');
    return formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
}

export function getTodayLocal(): string {
    return dayjs().startOf('day').format('YYYY-MM-DD');
}

export function formatDateDB(date: Date | string): string {
    return dayjs(date).startOf('day').format('YYYY-MM-DD');
}