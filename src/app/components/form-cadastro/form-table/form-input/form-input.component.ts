import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';
import { CadastroService } from '../../../../services/cadastro.service';

type options = { id: string, text: string }[];

@Component({
  selector: 'form-input',
  standalone: true,
  imports: [ReactiveFormsModule, NgxMaskDirective, NgxMaskPipe],
  templateUrl: './form-input.component.html',
  styleUrl: './form-input.component.scss'
})
export class FormInputComponent implements OnInit {
  constructor(
    private cdr: ChangeDetectorRef,
    private cadastro: CadastroService
  ) { }

  @Output() inputForm: EventEmitter<any> = new EventEmitter();
  @Input() controlName!: string;
  @Input() type?: any;
  @Input() textarea: boolean = !1;
  @Input() form!: FormGroup;
  @Input() autocomplete?: string;
  @Input() options?: options;
  @Input() selectedOption: number = 0;
  radioOption!: string;
  wrongField: boolean = !1;

  ngOnInit(): void {
    const reader = this.form.get(this.controlName);

    if (this.controlName == 'cpf') reader?.valueChanges.subscribe((cpf: string) => {
      const searchUser = this.cadastro.searchUser(cpf);

      if (reader.valid) searchUser.subscribe(user => this.wrongField = !!user);
    });

    if (this.options) {
      const option = this.options[this.selectedOption];

      if (!option) return;

      this.radioOption = option.id;
      this.cdr.detectChanges();
    }
  }
}
