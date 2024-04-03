import { role } from "./cadastro";
import { horario } from "./horario";
import { modName } from "./modalidade";

export type PrismaUser = {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    cpf: string;
    nome_comp: string;
    roles: role[];
    hash: string;
    hashedRt?: string;
    accepted: boolean;
};

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