export class StringTools {
    capitalize(str: string) {
        return str.toUpperCase().slice(0, 1) + str.toLowerCase().slice(1);
    }
}