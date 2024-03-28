import { Component, ContentChildren, ElementRef, EventEmitter, Input, Output, QueryList } from '@angular/core';
import { FormSubmitComponent } from './form-submit/form-submit.component';
import { FormGroup } from '@angular/forms';
import { FormInputComponent } from './form-input/form-input.component';

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
  @Output() freezeForm = new EventEmitter<boolean>();

  @ContentChildren(FormInputComponent) formInput!: QueryList<ElementRef>;
  @ContentChildren('*') all!: QueryList<ElementRef>;

  freezeFormFunc = (freeze: boolean) => {
    this.freezeForm.emit(freeze);
  }

  hasFormInput() {
    return !!this.formInput.length;
  }
}
