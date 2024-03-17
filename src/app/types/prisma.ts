export type PrismaUser = {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    cpf: string;
    nome_comp: string;
    roles: ('ALUNO' | 'PROFESSOR' | 'ADMIN')[];
    hash: string;
    hashedRt?: string;
    accepted: boolean;
};

export type PrismaSolic = {
    id: number;
    userId: number;
    roles: ('ALUNO' | 'PROFESSOR' | 'ADMIN')[];
}