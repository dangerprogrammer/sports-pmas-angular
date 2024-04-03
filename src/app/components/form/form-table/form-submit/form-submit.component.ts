import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'form-submit',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './form-submit.component.html',
  styleUrl: './form-submit.component.scss'
})
export class FormSubmitComponent {
  @Input() form!: FormGroup;
  @Input() submitEvent?: Function;
  @Input() freezeFormFunc!: any;

  hasRole = (roles: any[], role: string) => roles.find(r => r == role);

  submitForm(ev: Event) {
    ev.preventDefault();

    const userPrisma = this.form.value;

    if (userPrisma.solic) {
      if (typeof userPrisma.solic.roles == "string") userPrisma.solic.roles = userPrisma.solic.roles.split(',');

      if (this.hasRole(userPrisma.solic.roles, "ALUNO")) userPrisma.aluno = {
        ...userPrisma.aluno,
        data_nasc: new Date(userPrisma.aluno.data_nasc).toISOString()
      };
    };

    if (this.submitEvent) {
      this.freezeFormFunc(!0);
      return this.submitEvent(userPrisma, this.form);
    };
  }
}
