import { AfterViewInit, Component, ElementRef, Input, ViewChild, ViewChildren } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective, NgxMaskPipe } from 'ngx-mask';

@Component({
  selector: 'form-input',
  standalone: true,
  imports: [ReactiveFormsModule, NgxMaskDirective, NgxMaskPipe],
  templateUrl: './form-input.component.html',
  styleUrl: './form-input.component.scss'
})
export class FormInputComponent implements AfterViewInit {
  @Input() controlName!: string;
  @Input() type?: any;
  @Input() textarea: boolean = !1;
  @Input() form!: FormGroup;
  @Input() options?: { id: string, text: string }[];
  @Input() selectedOption: number = 0;

  @ViewChild('optionsList') optionsList?: ElementRef;
  @ViewChildren('options') checkOptions!: ElementRef[];

  ngAfterViewInit(): void {
    if (this.optionsList) {
      const select = this.optionsList.nativeElement;

      select.options[this.selectedOption].selected = !0;
    };

    if (this.checkOptions.length) {
      const checkboxes = this.checkOptions.map(({ nativeElement }) => nativeElement);

      checkboxes[this.selectedOption].checked = !0;
    };
  }
}
