import { option } from "./cadastro"

export type genders = option[] & {
    id: "MASCULINO" | "FEMININO" | "OUTRO"
}[];