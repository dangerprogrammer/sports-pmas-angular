import { horario, modalidade, role } from "../types";

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
    }[];

    solic: {
        roles: role[];
    };

    aluno?: Aluno;
    professor?: Professor;
    admin?: Admin;
};

export interface signinUser {
    cpf: string;
    password: string;
};