import { weekDays } from "./modalidade";

export type horario = {
    id: number;
    day: weekDays;
    time: Date;
    periodo: 'MANHA' | 'TARDE' | 'NOITE';
    vagas: number;
    available: number;
};