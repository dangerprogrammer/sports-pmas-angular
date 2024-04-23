import { modName } from "./modalidade";

export type inscricao = {
    id: number;
    alunoId: number;
    professorId: number;
    aula: modName;
    time: Date;
}