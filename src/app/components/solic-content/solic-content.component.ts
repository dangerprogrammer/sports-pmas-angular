import { Component, Input } from '@angular/core';

@Component({
  selector: 'solic-content',
  standalone: true,
  imports: [],
  templateUrl: './solic-content.component.html',
  styleUrl: './solic-content.component.scss'
})
export class SolicContentComponent {
  @Input() title!: string;
}
