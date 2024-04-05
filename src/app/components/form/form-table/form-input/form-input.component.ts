import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { CadastroService } from '../../../../services/cadastro.service';
import { options } from '../../../../types';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'form-input',
  standalone: true,
  imports: [ReactiveFormsModule, NgxMaskDirective, NgxMaskPipe, JsonPipe, FormsModule],
  templateUrl: './form-input.component.html',
  styleUrl: './form-input.component.scss'
})
export class FormInputComponent implements OnInit, AfterViewInit {
  defHorarioValue = '0000';
  horarioValue: any = this.defHorarioValue;

  constructor(
    private cdr: ChangeDetectorRef,
    private cadastro: CadastroService
  ) { }

  @Input() form!: FormGroup;
  @Input() controlName!: string;
  @Input() type?: any;
  @Input() multiple: boolean = !1;
  @Input() leastOne: boolean = !1;
  @Input() textarea: boolean = !1;
  @Input() readCPF: boolean = !1;
  @Input() autocomplete: string = 'on';
  @Input() options?: options;
  @Input() selectedOption: number = 0;
  @Input() wrongField: boolean = !1;
  @Input() inputText?: string;
  @Input() view: boolean = !1;
  @Input() builderOptions?: options;
  @Input() wrongMsg: string = 'Já existe um usuário com este CPF!';

  @Output() inputForm: EventEmitter<any> = new EventEmitter();

  htmlOptions?: HTMLInputElement[];

  @ViewChildren('options') viewOptions?: QueryList<ElementRef>;

  ngOnInit(): void {
    const reader = this.form.get(this.controlName);

    if (this.controlName == 'cpf' && this.readCPF) reader?.valueChanges.subscribe((cpf: string) => {
      const searchUser = this.cadastro.searchUser(cpf);

      if (reader.valid) searchUser.subscribe(user => this.wrongField = !!user);
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.options) {
        const htmlOptions = this.viewOptions?.map(({ nativeElement }) => nativeElement) as HTMLInputElement[];

        this.htmlOptions = htmlOptions;
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

        let controlValue = this.multiple ?
          htmlOptions.filter(({ checked }) => checked).map(({ id }) => id) :
          htmlOptions.find(({ checked }) => checked)?.id;

        this.form.get(this.controlName)?.setValue(controlValue);
        this.cdr.detectChanges();
      };
    }, 0);
  }

  horarioChange = (value: string) => {
    let formattedValue: string | string[] = value.split('');

    if (formattedValue.length < 4) formattedValue.splice(formattedValue.length, 0, '0');

    formattedValue = formattedValue.join('');

    const hora = +formattedValue.substring(0, 2);
    const minuto = +formattedValue.substring(2);

    formattedValue = formattedValue.split('');

    if (hora >= 24 || minuto >= 60 || hora < 5) {
      this.enableAddHorario = !1;

      return;
    };

    formattedValue = formattedValue.join('');

    this.horarioValue = formattedValue;

    this.enableAddHorario = formattedValue != this.defHorarioValue;
  }

  enableAddHorario: boolean = !1;

  addHorario = (ev: Event) => {
    ev.preventDefault();

    this.enableAddHorario = !1;

    const horarios = this.form.get(this.controlName)?.value;
    const formatHorario = `${
      this.horarioValue.substring(0, 2)
    }:${this.horarioValue.substring(2)}:00`;

    if (this.builderOptions) {
      // VER COMO COLOCAR O HORARIO NA TELA E O FORM VER QUE NÃO É IGUAL!!
      this.builderOptions.push({ id: horarios.length, text: formatHorario });
      this.form.get(this.controlName)?.setValue(this.builderOptions);
    };
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