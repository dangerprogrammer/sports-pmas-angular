import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { CadastroService } from '../../../../services/cadastro.service';
import { option, weekDays } from '../../../../types';
import { NgIf } from '@angular/common';

@Component({
  selector: 'form-input',
  standalone: true,
  imports: [ReactiveFormsModule, NgxMaskDirective, NgxMaskPipe, FormsModule, NgIf],
  templateUrl: './form-input.component.html',
  styleUrl: './form-input.component.scss'
})
export class FormInputComponent implements OnInit, AfterViewInit {
  defHorarioValue = '00:00';

  weekDays: weekDays[] = ['SEGUNDA', 'TERCA', 'QUARTA', 'QUINTA', 'SEXTA'];

  constructor(
    private cdr: ChangeDetectorRef,
    private cadastro: CadastroService
  ) { }

  @Input() form!: FormGroup;
  @Input() controlName!: string;
  @Input() type?: any;
  @Input() multiple: boolean = !1;
  @Input() textarea: boolean = !1;
  @Input() readCPF: boolean = !1;
  @Input() autocomplete: string = 'on';
  @Input() options?: option[];
  @Input() wrongField: boolean = !1;
  @Input() inputText?: string;
  @Input() view: boolean = !1;
  @Input() builderOptions?: option[];
  @Input() index: number = 0;
  @Input() edit: boolean = !0;
  @Input() wrongMsg: string = 'Já existe um usuário com este CPF!';

  @Output() inputForm: EventEmitter<any> = new EventEmitter();

  toggleEye: boolean = !1;
  htmlOptions?: HTMLInputElement[];
  horarioSubText: string = 'Loading';
  horarioIcon: 'add' | 'checkmark' = 'add';

  @ViewChildren('options') viewOptions?: QueryList<ElementRef>;
  @ViewChild('horarioSubscribe') horarioSubscribe?: ElementRef;
  @ViewChild('weekDay') weekDay?: ElementRef;
  @ViewChild('horarioValue') horarioValue?: ElementRef;

  ngOnInit(): void {
    const reader = this.form.get(this.controlName);

    if (this.controlName == 'cpf' && this.readCPF) reader?.valueChanges.subscribe((cpf: string) => {
      const searchUser = this.cadastro.search.searchUser(cpf);

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
          htmlOptions.filter(({ checked }) => checked).map(({ id }) => id.split('-')[0]) :
          htmlOptions.find(({ checked }) => checked)?.id.split('-')[0];

        this.form.get(this.controlName)!.setValue(controlValue);
        this.cdr.detectChanges();
      };

      const button = this.horarioSubscribe?.nativeElement as HTMLButtonElement;

      if (button) {
        this.horarioSubText = 'Criar Horário';
        this.horarioIcon = 'add';

        button.onclick = this.addHorario;
        this.cdr.detectChanges();
      };
      
    const valueHorario = this.horarioValue?.nativeElement as HTMLInputElement;

    if (valueHorario) valueHorario.value = this.defHorarioValue;
    });
  }

  horarioChange = () => {
    const valueHorario = this.horarioValue!.nativeElement as HTMLInputElement;

    const hora = +valueHorario.value.substring(0, 2),
      dayWeek = this.weekDay!.nativeElement as HTMLSelectElement,
      dayI = dayWeek.selectedIndex;

    const hasHorario = this.builderOptions?.find(({ text }) => text == `${this.weekDays[dayI]} - ${valueHorario.value}`);

    if (hasHorario || (hora < 5)) {
      this.enableAddHorario = !1;

      return;
    };

    this.enableAddHorario = valueHorario.value != this.defHorarioValue;
    this.cdr.detectChanges();
  }

  enableAddHorario: boolean = !1;

  addHorario = (ev: Event) => {
    ev.preventDefault();

    const dayWeek = this.weekDay!.nativeElement as HTMLSelectElement,
      dayI = dayWeek.selectedIndex;

    const valueHorario = this.horarioValue!.nativeElement as HTMLInputElement;

    this.enableAddHorario = !1;

    if (this.builderOptions) {
      this.builderOptions.push({ id: 0, text: `${this.weekDays[dayI]} - ${valueHorario.value}`, status: !1 });
      this.sortBuilderOptions();
      this.form.get(this.controlName)!.setValue(this.builderOptions);

      dayWeek.options[0].selected = !0;
      valueHorario.value = this.defHorarioValue;
    };

    this.cdr.detectChanges();
  }

  sortBuilderOptions = () => {
    if (this.builderOptions) this.builderOptions = this.builderOptions.sort(({ text: textA }, { text: textB }) => {
      const valueA = +(textA.substring(0, 2)) * 60 + +textA.substring(3),
        valueB = +(textB.substring(0, 2)) * 60 + +textB.substring(3);

      return valueA - valueB;
    });
  }

  editHorario = (option: option, ev: Event) => {
    ev.preventDefault();

    const button = this.horarioSubscribe!.nativeElement as HTMLButtonElement;

    const dayWeek = this.weekDay!.nativeElement as HTMLSelectElement;

    const valueHorario = this.horarioValue!.nativeElement as HTMLInputElement;

    option.status = !option.status;

    if (option.status) {
      const [day, horario] = option.text.split(' - ');

      const ind = this.weekDays.indexOf(day as weekDays);
      this.horarioSubText = 'Salvar Horário';
      this.horarioIcon = 'checkmark';
      dayWeek.options[ind].selected = !0;
      valueHorario.value = horario;
      button.onclick = ev => this.saveEdit(option, ev);
    } else {
      this.horarioSubText = 'Criar Horário';
      this.horarioIcon = 'add';
      dayWeek.options[0].selected = !0;
      valueHorario.value = this.defHorarioValue;
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

    const dayWeek = this.weekDay!.nativeElement as HTMLSelectElement,
      dayI = dayWeek.selectedIndex;

    const valueHorario = this.horarioValue!.nativeElement as HTMLInputElement;

    if (this.builderOptions) {
      option.text = `${this.weekDays[dayI]} - ${valueHorario.value}`;
      option.status = !1;

      this.sortBuilderOptions();
      this.form.get(this.controlName)?.setValue(this.builderOptions);

      this.horarioSubText = 'Criar Horário';
      this.horarioIcon = 'add';
      dayWeek.options[0].selected = !0;
      valueHorario.value = this.defHorarioValue;
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