interface aluno {
    id: number;
    cpf: string;
    email: string;
    telefone: string;
    endereco: string;
    bairro: string;
    nascimento: Date;
    sexo: 'feminino' | 'masculino' | 'outro';
    inscricao: 'natacao' | 'hidroginastica';
    periodo: 'manha' | 'tarde' | 'noite';
    nomeResp1: string;
    cpfResp1: string;
    emailResp1: string;
    telResp1: string;
    nomeResp2?: string;
    cpfResp2?: string;
    emailResp2?: string;
    telResp2?: string;
}

export default aluno;