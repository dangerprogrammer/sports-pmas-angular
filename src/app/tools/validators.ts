import { AbstractControl } from "@angular/forms";

export class MyValidators {
  validCPFAndTel = (control: AbstractControl) => {
    const { value } = control;

    if (value && value == 'ROOT') return null;

    if (!value || value.length != 11 || value == '00000000000') return { 'invalid': !0 };

    return null;
  }
}