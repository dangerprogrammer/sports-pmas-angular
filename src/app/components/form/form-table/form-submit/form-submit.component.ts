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
  @Input() submitEvent?: any;

  hasRole = (roles: any[], role: string) => roles.find(r => r == role);

  submitForm(ev: Event) {
    ev.preventDefault();

    const userPrisma = this.form.value;

    if (userPrisma.solic && typeof userPrisma.solic.roles == "string") userPrisma.solic.roles = userPrisma.solic.roles.split(',');

    if (userPrisma.solic && this.hasRole(userPrisma.solic.roles, "ALUNO")) userPrisma.aluno = {
      ...userPrisma.aluno,
      data_nasc: new Date(userPrisma.aluno.data_nasc).toISOString()
    };

    if (this.submitEvent) return this.submitEvent(userPrisma, this.form);
  }
}
