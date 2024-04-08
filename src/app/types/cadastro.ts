import { FormGroup } from "@angular/forms";

export type cadastroTypes = "aluno" | "funcionario";

export type subscribeTypes = "cadastro" | "login";

export type option = {
    id: string | number,
    text: string,
    form: FormGroup,
    submitText?: string,
    status?: boolean,
    action?: Function
} | {
    id: string | number,
    text: string,
    status?: boolean,
    action?: Function
};

export type role = "ALUNO" | "PROFESSOR" | "ADMIN";