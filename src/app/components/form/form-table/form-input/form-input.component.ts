import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { CadastroService } from '../../../../services/cadastro.service';
import { option } from '../../../../types';
import { NgIf } from '@angular/common';

@Component({
  selector: 'form-input',
  standalone: true,
  imports: [ReactiveFormsModule, NgxMaskDirective, NgxMaskPipe, FormsModule, NgIf],
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
  @Input() options?: option[];
  @Input() selectedOption: number = 0;
  @Input() wrongField: boolean = !1;
  @Input() inputText?: string;
  @Input() view: boolean = !1;
  @Input() builderOptions?: option[];
  @Input() index: number = 0;
  @Input() wrongMsg: string = 'Já existe um usuário com este CPF!';

  @Output() inputForm: EventEmitter<any> = new EventEmitter();

  htmlOptions?: HTMLInputElement[];
  horarioSubText: string = 'Loading';
  horarioIcon: 'add' | 'checkmark' = 'add';

  @ViewChildren('options') viewOptions?: QueryList<ElementRef>;
  @ViewChild('horarioSubscribe') horarioSubscribe?: ElementRef;

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
          htmlOptions.find(({ checked }) => checked)?.id.split('-')[0];

        this.form.get(this.controlName)?.setValue(controlValue);
        this.cdr.detectChanges();
      };

      const button = this.horarioSubscribe?.nativeElement;

      if (button) {
        this.horarioSubText = 'Criar Horário';
        this.horarioIcon = 'add';

        (button as HTMLButtonElement).onclick = this.addHorario;
        this.cdr.detectChanges();
      };
    });
  }

  horarioChange = (value: string) => {
    let formattedValue: string | string[] = value.split('');

    if (formattedValue.length < 4) formattedValue.splice(formattedValue.length, 0, '0');

    formattedValue = formattedValue.join('');

    let hora = +formattedValue.substring(0, 2);
    let minuto = +formattedValue.substring(2);

    const allExistingHorarios = this.builderOptions?.map(({ text }) =>
      `${text.substring(0, 2) + text.substring(3)}`
    );
    const hasHorario = allExistingHorarios?.find(horario => horario == formattedValue);

    // while (minuto >= 60) {
    //   minuto -= 60;
    //   hora++;
    // };

    // formattedValue = `${hora}${minuto}`;

    if (hasHorario || (hora >= 24 || minuto >= 60 || hora < 5)) {
      this.enableAddHorario = !1;

      return;
    };

    this.horarioValue = formattedValue;

    this.enableAddHorario = formattedValue != this.defHorarioValue;
    this.cdr.detectChanges();
  }

  enableAddHorario: boolean = !1;

  addHorario = (ev: Event) => {
    ev.preventDefault();

    this.enableAddHorario = !1;

    const formatHorario = `${this.horarioValue.substring(0, 2)
      }:${this.horarioValue.substring(2)}`;

    if (this.builderOptions) {
      this.builderOptions.push({ id: 0, text: formatHorario, status: !1 });
      this.sortBuilderOptions();
      this.form.get(this.controlName)?.setValue(this.builderOptions);

      this.horarioValue = this.defHorarioValue;
    };

    this.cdr.detectChanges();
  }

  sortBuilderOptions = () => {
    if (this.builderOptions) this.builderOptions = this.builderOptions.sort(({ text: textA }, { text: textB }) => {
      const valueA = +(textA.substring(0, 2) + textA.substring(3)),
        valueB = +(textB.substring(0, 2) + textB.substring(3));

      return valueA - valueB;
    });
  }

  editHorario = (option: option, ev: Event) => {
    ev.preventDefault();

    const button = this.horarioSubscribe?.nativeElement as HTMLButtonElement;

    option.status = !option.status;

    if (option.status) {
      this.horarioSubText = 'Salvar Horário';
      this.horarioIcon = 'checkmark';
      this.horarioValue = option.text.substring(0, 2) + option.text.substring(3);
      button.onclick = ev => this.saveEdit(option, ev);
    } else {
      this.horarioSubText = 'Criar Horário';
      this.horarioIcon = 'add';
      this.horarioValue = this.defHorarioValue;
      button.onclick = this.addHorario;
    };

    this.cdr.detectChanges();
  }

  deleteHorario = (option: option, ev: Event) => {
    ev.preventDefault();

    if (this.builderOptions) {
      const index = this.builderOptions.findIndex(({ text }) => text == option.text);

      this.builderOptions.splice(index, 1);
      this.sortBuilderOptions();
      this.form.get(this.controlName)?.setValue(this.builderOptions);
    };

    this.cdr.detectChanges();
  }

  saveEdit = (option: option, ev: Event) => {
    ev.preventDefault();

    this.enableAddHorario = !1;

    const button = this.horarioSubscribe?.nativeElement as HTMLButtonElement;
    const formatHorario = `${this.horarioValue.substring(0, 2)
      }:${this.horarioValue.substring(2)}`;

    if (this.builderOptions) {
      option.text = formatHorario;
      option.status = !1;

      this.sortBuilderOptions();
      this.form.get(this.controlName)?.setValue(this.builderOptions);

      this.horarioSubText = 'Criar Horário';
      this.horarioIcon = 'add';
      this.horarioValue = this.defHorarioValue;
      button.onclick = this.addHorario;
    };

    this.cdr.detectChanges();
  }

  emitAction(ev: Event, index: number) {
    const element = ev.target as HTMLLabelElement,
      inputsHTML = element.parentElement?.parentElement?.children as any,
      inputs = [...inputsHTML].map(({ firstChild }) => firstChild),
      labels = [...inputsHTML].map(({ lastChild }) => lastChild),
      inputsChecked = inputs.map(({ checked }, ind) => ind == index ? !checked : checked),
      hasCheckeds = inputsChecked.filter(checked => checked).length,
      { action } = (this.options as option[])[index];

    if (this.multiple) labels.forEach(label => label.classList.add('multiple'));

    if (hasCheckeds == 1) labels[inputsChecked.findIndex(checked => checked)].classList.remove('multiple');
    if (!hasCheckeds) return ev.preventDefault();

    if (action) action(index);
  }
}