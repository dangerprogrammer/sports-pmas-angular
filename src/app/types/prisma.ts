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

interface PrismaAluno {
    email: string;
    tel: string;
    endereco: string;
    bairro: string;
    data_nasc: Date;
    sexo: "MASCULINO" | "FEMININO" | "OUTRO";
}

interface PrismaProfessor {
    email: string;
    tel: string;
}

interface PrismaAdmin {
    email: string;
    tel: string;
}

export type PrismaSolic = {
    id: number;
    userId: number;
    roles: role[];
}

export type PrismaModalidade = {
    name: modName;
    endereco: string;
    bairro: string;
    available: number;
    horarios?: horario[];
}