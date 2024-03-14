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

  submitForm(ev: Event) {
    ev.preventDefault();

    const userPrismaObj = {
      ...this.form.value,
      aluno: {
        ...this.form.value.aluno,
        data_nasc: new Date(this.form.value.aluno.data_nasc).toISOString()
      }
    }

    console.log(userPrismaObj);
  }
}
