export class ColorTools {
    lighten({ r, g, b }: { r: number, g: number, b: number }, intensity: number) {
        r += (255 - r) * (intensity / 1e2);
        g += (255 - g) * (intensity / 1e2);
        b += (255 - b) * (intensity / 1e2);

        return { r, g, b };
    }

    darken({ r, g, b }: { r: number, g: number, b: number }, intensity: number) {
        r -= (255 - r) * (intensity / 1e2);
        g -= (255 - g) * (intensity / 1e2);
        b -= (255 - b) * (intensity / 1e2);

        return { r, g, b };
    }

    hex2rgb(hex: string) {
        hex = hex.slice(1);

        let res: any;
        if (!(hex.length % 3)) {
            res = console.log('Sem alpha!');
        }

        if (!(hex.length % 4)) {
            res = console.log('Com alpha!');
        }

        return res;
    }

    rgb2hex(r: string, g: string, b: string) {}
}