import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';

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
    private cdr: ChangeDetectorRef
  ) {}

  @Output() inputForm: EventEmitter<any> = new EventEmitter();
  @Input() controlName!: string;
  @Input() type?: any;
  @Input() textarea: boolean = !1;
  @Input() form!: FormGroup;
  @Input() autocomplete?: string;
  @Input() options?: options;
  @Input() selectedOption: number = 0;
  radioOption!: string;

  ngOnInit(): void {
    if (this.options) {
      const option = (this.options as options)[this.selectedOption]

      if (!option) return;
      
      this.radioOption = option.id;
      this.cdr.detectChanges();
    }
  }
}
