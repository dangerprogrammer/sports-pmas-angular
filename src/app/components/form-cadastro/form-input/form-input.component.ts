import { Component, Input } from '@angular/core';

@Component({
  selector: 'form-input',
  standalone: true,
  imports: [],
  templateUrl: './form-input.component.html',
  styleUrl: './form-input.component.scss'
})
export class FormInputComponent {
  @Input() activeTitle!: string;
}
