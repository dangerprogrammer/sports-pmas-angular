import { Component, Input } from '@angular/core';

@Component({
  selector: 'form-link',
  standalone: true,
  imports: [],
  templateUrl: './form-link.component.html',
  styleUrl: './form-link.component.scss'
})
export class FormLinkComponent {
  @Input() link!: string;
}
