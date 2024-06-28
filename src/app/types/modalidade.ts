import { horario } from "./horario";

export type modalidade = {
    name: modName;
    horarios?: horario[];
    local: {
        endereco: string;
        bairro: string;
    };
};

export type modName = 'HIDRO' | 'NATACAO';

export type weekDays = 'SEGUNDA' | 'TERCA' | 'QUARTA' | 'QUINTA' | 'SEXTA';