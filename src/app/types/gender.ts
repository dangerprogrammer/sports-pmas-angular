import { options } from "./cadastro"

export type genders = options & {
    id: "MASCULINO" | "FEMININO" | "OUTRO"
}[];