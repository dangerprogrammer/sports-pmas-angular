export class DateTools {
    formatTime(time: Date) {
        const date = new Date(time);

        date.setHours(date.getUTCHours(), date.getUTCMinutes());

        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
}