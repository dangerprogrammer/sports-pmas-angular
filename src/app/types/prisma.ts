import { role } from "./cadastro";
import { horario } from "./horario";
import { modName } from "./modalidade";

export type PrismaUser = {
    id: number;
    email: string;
    createdAt: Date;
    updatedAt: Date;
    cpf: string;
    nome_comp: string;
    roles: role[];
    hash: string;
    tel: string;
    hashedRt?: string;
    accepted: boolean;
};

export type PrismaAluno = {
    id: number;
    email: string;
    cpf: string;
    nome_comp: string;
    tel: string;
    endereco: string;
    bairro: string;
    data_nasc: Date;
    sexo: "MASCULINO" | "FEMININO" | "OUTRO";
}

export type PrismaProfessor = {
    email: string;
    tel: string;
}

export type PrismaAdmin = {
    email: string;
    tel: string;
}

export type PrismaSolic = {
    id: number;
    userId: number;
    adminId: number;
    updatedAt: Date;
    done: boolean;
    roles: role[];
}

export type PrismaModalidade = {
    name: modName;
    endereco: string;
    bairro: string;
    available: number;
    horarios?: horario[];
    vagas: number;
}