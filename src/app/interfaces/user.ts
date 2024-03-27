import { horario, modalidade } from "../types";

interface Solic {
    role: 'ALUNO' | 'PROFESSOR' | 'ADMIN';
}

interface Aluno {
    email: string;
    tel: string;
    endereco: string;
    bairro: string;
    data_nasc: Date;
    sexo: "MASCULINO" | "FEMININO" | "OUTRO";
}

interface Professor {
    email: string;
    tel: string;
}

interface Admin {
    email: string;
    tel: string;
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

    solic: Solic;

    aluno?: Aluno;
    professor?: Professor;
    admin?: Admin;
};

export interface signinUser {
    cpf: string;
    password: string;
};