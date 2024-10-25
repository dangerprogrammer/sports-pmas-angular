import { horario, modalidade, role, weekDays } from "../types";

interface Aluno {
    endereco: string;
    bairro: string;
    data_nasc: Date;
    sexo: "MASCULINO" | "FEMININO" | "OUTRO";
}

interface Professor {
}

interface Admin {
}

export interface User {
    nome_comp: string;
    cpf: string;
    password: string;
    tel: string;
    email: string;
    inscricoes: {
        horario: horario;
        modalidade: modalidade;
        week_day: weekDays;
    }[];

    solic: {
        roles: role[];
    };

    aluno?: Aluno;
    professor?: Professor;
    admin?: Admin;
};

export interface updateUser {
    cpf?: string;
    password: string;
    tel: string;
    email: string;

    aluno?: Aluno;
    professor?: Professor;
    admin?: Admin;

    inscricoes?: {
        aula: string;
        horario: Date;
    }[];
}

export interface signinUser {
    cpf: string;
    password: string;
};