export class DateTools {
    formatTime(time: Date) {
        const date = new Date(time);

        date.setFullYear(2024, 0, 1);
        date.setHours(date.getUTCHours(), date.getUTCMinutes());

        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    yearsOld(time: Date) {
        const diff = (new Date() as unknown as number) - (new Date(time) as unknown as number);
        
        return Math.floor(diff / (1e3 * 60 * 60 * 24 * 365.25));
    }
}