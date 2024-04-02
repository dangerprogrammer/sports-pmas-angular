import { AfterViewChecked, AfterViewInit, Component, ContentChildren, ElementRef, EventEmitter, Input, Output, QueryList, ViewChild, ViewContainerRef } from '@angular/core';
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
export class FormTableComponent implements AfterViewInit, AfterViewChecked {
  @Input() form!: FormGroup;
  @Input() oldValue?: any;
  @Input() submitText: string = "Cadastrar";
  @Input() submitEvent?: any;
  @Input() autoGenerateForms: boolean = !1;
  @Output() freezeForm = new EventEmitter<boolean>();

  @ContentChildren(FormInputComponent) formInput!: QueryList<ElementRef>;
  @ViewChild('formInputs', { read: ViewContainerRef }) formInputs!: ViewContainerRef;

  ngAfterViewInit(): void {
    console.log(this.formInputs);
  }

  ngAfterViewChecked(): void {
    if (this.autoGenerateForms) {
      console.log(this, this.autoGenerateForms);
      // const inputRef = this.formInputs.createComponent(FormInputComponent);

      this.form.valueChanges.subscribe((formValue: any) => {
        console.log(formValue);
      });
    };
  }

  freezeFormFunc = (freeze: boolean) => {
    this.freezeForm.emit(freeze);
  }

  hasFormInput() {
    return !!this.formInput.length;
  }
}
