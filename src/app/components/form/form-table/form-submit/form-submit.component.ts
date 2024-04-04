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

    const prismaRes = this.form.value;

    if (prismaRes.solic) {
      if (typeof prismaRes.solic.roles == "string") prismaRes.solic.roles = prismaRes.solic.roles.split(',');

      if (this.hasRole(prismaRes.solic.roles, "ALUNO")) prismaRes.aluno = {
        ...prismaRes.aluno,
        data_nasc: new Date(prismaRes.aluno.data_nasc).toISOString()
      };
    };

    if (this.submitEvent) {
      this.freezeFormFunc(!0);
      return this.submitEvent(prismaRes, this.form);
    };
  }
}
