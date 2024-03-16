import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { CadastroService } from '../../../../services/cadastro.service';
import { options } from '../../../../types';

@Component({
  selector: 'form-input',
  standalone: true,
  imports: [ReactiveFormsModule, NgxMaskDirective, NgxMaskPipe],
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
  @Input() textarea: boolean = !1;
  @Input() form!: FormGroup;
  @Input() autocomplete: string = 'on';
  @Input() options?: options;
  @Input() selectedOption: number = 0;
  wrongField: boolean = !1;

  @ViewChildren('options') viewOptions?: QueryList<ElementRef>;

  ngOnInit(): void {
    const reader = this.form.get(this.controlName);

    if (this.controlName == 'cpf') reader?.valueChanges.subscribe((cpf: string) => {
      const searchUser = this.cadastro.searchUser(cpf);

      if (reader.valid) searchUser.subscribe(user => this.wrongField = !!user);
    });
  }

  ngAfterViewInit(): void {
    if (this.options) {
      const htmlOptions = this.viewOptions?.map(({ nativeElement }) => nativeElement) as any[];

      this.options.forEach((option, ind) => {
        if (option.status) {
          const hasActive = htmlOptions.find(opt => opt.checked);
          const checked = !hasActive || this.multiple;

          htmlOptions[ind].checked = checked;
          this.cdr.detectChanges();
        };
      });

      if (this.multiple) {
        const ids = htmlOptions.filter(({ checked }) => checked).map(({ id }) => id);

        this.form.get(this.controlName)?.setValue(ids);
      } else {
        const { id: optionID } = htmlOptions.find(({ checked }) => checked);

        this.form.get(this.controlName)?.setValue(optionID);
        this.cdr.detectChanges();
      };
    }
  }

  emitAction(index: number) {
    const { action } = (this.options as options)[index];

    if (action) action(index);
  }
}