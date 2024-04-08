export class DateTools {
    formatTime(time: Date) {
        const date = new Date(time);

        date.setFullYear(2024, 0, 1);
        date.setHours(date.getUTCHours(), date.getUTCMinutes());

        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
}