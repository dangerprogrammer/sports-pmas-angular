export class StringTools {
    capitalize(str: string) {
        return str.toUpperCase().slice(0, 1) + str.toLowerCase().slice(1);
    }

    formatCPF = (cpf: string) => {
        const formatted = `${cpf.slice(0, 3)}.${cpf.slice(3, 6)}.${cpf.slice(6, 9)}-${cpf.slice(9)}`;

        return formatted;
    }

    formatPhone = (tel: string) => {
        const formatted = `+55 (${tel.slice(0, 2)})${tel.slice(2)}`;

        return formatted;
    }
}