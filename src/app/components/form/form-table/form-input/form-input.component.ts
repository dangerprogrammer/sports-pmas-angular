import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { CadastroService } from '../../../../services/cadastro.service';
import { options } from '../../../../types';
import { NgIf } from '@angular/common';

@Component({
  selector: 'form-input',
  standalone: true,
  imports: [ReactiveFormsModule, NgxMaskDirective, NgxMaskPipe, NgIf],
  templateUrl: './form-input.component.html',
  styleUrl: './form-input.component.scss'
})
export class FormInputComponent implements OnInit, AfterViewInit {
  constructor(
    private cdr: ChangeDetectorRef,
    private cadastro: CadastroService
  ) { }

  @Output() inputForm: EventEmitter<any> = new EventEmitter();
  @Input() controlName!: string;
  @Input() type?: any;
  @Input() multiple: boolean = !1;
  @Input() leastOne: boolean = !1;
  @Input() textarea: boolean = !1;
  @Input() readCPF: boolean = !1;
  @Input() form?: FormGroup;
  @Input() autocomplete: string = 'on';
  @Input() options?: options;
  @Input() selectedOption: number = 0;
  @Input() wrongField: boolean = !1;
  @Input() wrongMsg: string = 'Já existe um usuário com este CPF!';

  @ViewChildren('options') viewOptions?: QueryList<ElementRef>;

  ngOnInit(): void {
    if (!this.form) return;

    const reader = this.form.get(this.controlName);

    if (this.controlName == 'cpf' && this.readCPF) reader?.valueChanges.subscribe((cpf: string) => {
      const searchUser = this.cadastro.searchUser(cpf);

      if (reader.valid) searchUser.subscribe(user => this.wrongField = !!user);
    });
  }

  ngAfterViewInit(): void {
    if (this.options) {
      const htmlOptions = this.viewOptions?.map(({ nativeElement }) => nativeElement) as HTMLInputElement[];

      this.options.forEach((option, ind) => {
        if (option.status) {
          const hasActive = htmlOptions.filter(opt => opt.checked).length;
          const checked = !hasActive || this.multiple;

          htmlOptions[ind].checked = checked;
          this.cdr.detectChanges();
        };
      });

      this.options.forEach((option, ind) => {
        if (option.status) {
          const lengthActive = htmlOptions.filter(opt => opt.checked).length;
          const label = htmlOptions[ind].parentElement?.lastChild;

          if (lengthActive <= 1) (label as HTMLLabelElement).classList.remove('multiple');
        };
      });

      let controlValue;

      controlValue = this.multiple ?
        htmlOptions.filter(({ checked }) => checked).map(({ id }) => id) :
        htmlOptions.find(({ checked }) => checked)?.id;

      if (!this.form) return;

      this.form.get(this.controlName)?.setValue(controlValue);
      this.cdr.detectChanges();
    }
  }

  emitAction(ev: Event, index: number) {
    const element = ev.target as HTMLLabelElement,
      inputsHTML = element.parentElement?.parentElement?.children as any,
      inputs = [...inputsHTML].map(({ firstChild }) => firstChild),
      labels = [...inputsHTML].map(({ lastChild }) => lastChild),
      inputsChecked = inputs.map(({ checked }, ind) => ind == index ? !checked : checked),
      hasCheckeds = inputsChecked.filter(checked => checked).length,
      { action } = (this.options as options)[index];

    if (this.multiple) labels.forEach(label => label.classList.add('multiple'));

    if (hasCheckeds == 1) labels[inputsChecked.findIndex(checked => checked)].classList.remove('multiple');
    if (!hasCheckeds) return ev.preventDefault();

    if (action) action(index);
  }
}