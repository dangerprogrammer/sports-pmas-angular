import { Component, Input } from '@angular/core';
import { FormSubmitComponent } from './form-submit/form-submit.component';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'form-table',
  standalone: true,
  imports: [FormSubmitComponent],
  templateUrl: './form-table.component.html',
  styleUrl: './form-table.component.scss'
})
export class FormTableComponent {
  @Input() form!: FormGroup;
  @Input() submitText: string = "Cadastrar";
  @Input() submitEvent?: any;
}
