import { AfterViewInit, Component, ContentChildren, ElementRef, EventEmitter, Input, Output, QueryList, ViewChild, ViewContainerRef } from '@angular/core';
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
  @Input() form!: FormGroup;
  @Input() formInputsList?: any[];
  @Input() submitEventForms: boolean = !1;
  @Input() oldValue?: any;
  @Input() submitText: string = "Cadastrar";
  @Input() submitEvent?: Function;
  @Input() autoGenerateForms: boolean = !1;
  @Input() index?: number;
  @Output() freezeForm = new EventEmitter<boolean>();

  @ContentChildren(FormInputComponent) formInput!: QueryList<ElementRef>;
  @ViewChild('inputs', { read: ViewContainerRef }) formInputs!: ViewContainerRef;
  @ViewChild(FormSubmitComponent) formSubmit!: FormSubmitComponent;

  oldInscricoes?: any[];

  submitFormEvent = () => this.formSubmit.submitForm();

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.autoGenerateForms) {
        if (this.formInputsList) for (let input of this.formInputsList) {
          const inputRef = this.formInputs.createComponent(FormInputComponent);

          inputRef.setInput('view', !0);
          inputRef.setInput('index', this.index);

          if (this.submitEventForms) inputRef.setInput('submitFormEvent', this.submitFormEvent);

          for (let inputField in input) inputRef.setInput(inputField, input[inputField]);
        };
      };

      setTimeout(() => {
        if (this.form.value.inscricoes) this.oldInscricoes = [...this.form.value.inscricoes];
        this.form.updateValueAndValidity();
      }, 5e2);

      if (this.oldValue) {
        this.form.valueChanges.subscribe((formValue: any) => {
          // NÃO FAÇO IDÉIA DO PQ TEM ESSA LINHA!!! MAS DEVE SER ÚTIL KKKKKKK
          // if (!this.oldValue.cpf) return this.form.setErrors({ 'loading': !0 });
  
          if (this.oldInscricoes) this.oldValue.inscricoes = this.oldInscricoes;
          else {
            delete this.oldValue.inscricoes;
            delete formValue.inscricoes;
          };
          const isEqual = this.compareForms(formValue, this.oldValue);
  
          // console.log(formValue, this.oldValue);
          this.form.setErrors(isEqual ? { 'equal': !0 } : null);
        });
      };
    });
  }

  compareForms(form1: any, form2: any) {
    const str = JSON.stringify, str1 = str(form1), str2 = str(form2);

    return str1 == str2;
  }

  freezeFormFunc = (freeze: boolean) => {
    this.freezeForm.emit(freeze);
  }

  hasFormInput() {
    return !!this.formInput.length;
  }
}
