import { role } from "./cadastro";
import { horario } from "./horario";

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
    status: 'ATIVO' | 'INATIVO';
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
    name: string;
    endereco: string;
    bairro: string;
    horarios?: horario[];
    vagas: number;
}