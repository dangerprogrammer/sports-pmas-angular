import { horario } from "./horario";

export type modalidade = {
    name: string;
    horarios?: horario[];
    local: {
        endereco: string;
        bairro: string;
    };
};

export type weekDays = 'SEGUNDA' | 'TERCA' | 'QUARTA' | 'QUINTA' | 'SEXTA';