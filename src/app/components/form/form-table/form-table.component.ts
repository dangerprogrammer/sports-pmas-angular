import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, ContentChildren, ElementRef, EventEmitter, Input, Output, QueryList, ViewChild, ViewContainerRef } from '@angular/core';
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
export class FormTableComponent implements AfterViewInit {
  constructor(
    private cdr: ChangeDetectorRef
  ) { }

  @Input() form!: FormGroup;
  @Input() formInputsList?: any[];
  @Input() oldValue?: any;
  @Input() submitText: string = "Cadastrar";
  @Input() submitEvent?: Function;
  @Input() autoGenerateForms: boolean = !1;
  @Output() freezeForm = new EventEmitter<boolean>();

  @ContentChildren(FormInputComponent) formInput!: QueryList<ElementRef>;
  @ViewChild('inputs', { read: ViewContainerRef }) formInputs!: ViewContainerRef;

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.autoGenerateForms) {
        if (this.formInputsList) for (let input of this.formInputsList) {
          const inputRef = this.formInputs.createComponent(FormInputComponent);

          inputRef.setInput('form', this.form);
          inputRef.setInput('view', !0);

          for (let inputField in input) {
            inputRef.setInput(inputField, input[inputField]);
            this.cdr.detectChanges();
          };
        };

        if (this.oldValue) this.form.valueChanges.subscribe((formValue: any) => {
          const isEqual = this.compareForms(formValue, this.oldValue);

          this.form.setErrors(isEqual ? { 'equal': !0 } : null);
        });
      };
    }, 0);
  }

  compareForms(form1: any, form2: any) {
    for (let field in form1) if (form1[field] != form2[field]) return !1;

    return !0;
  }

  freezeFormFunc = (freeze: boolean) => {
    this.freezeForm.emit(freeze);
  }

  hasFormInput() {
    return !!this.formInput.length;
  }
}
