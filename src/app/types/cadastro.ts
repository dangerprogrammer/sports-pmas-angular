import { FormGroup } from "@angular/forms";

export type cadastroTypes = "aluno" | "funcionario";

export type subscribeTypes = "cadastro" | "login";

export type options = ({
    id: string,
    text: string,
    form: FormGroup,
    submitText?: string,
    status?: boolean,
    action?: any
} | {
    id: string,
    text: string,
    status?: boolean,
    action?: any
})[];