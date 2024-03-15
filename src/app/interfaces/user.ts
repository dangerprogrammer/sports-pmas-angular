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

interface Professor {}

interface Admin {}

export interface User {
    nome_comp: string;
    cpf: string;
    password: string;

    solic: Solic;

    aluno?: Aluno;
    professor?: Professor;
    admin?: Admin;
};