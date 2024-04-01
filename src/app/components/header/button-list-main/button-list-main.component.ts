import { Component, EventEmitter, Input, Output } from '@angular/core';
import { HeaderButtonComponent } from '../header-button/header-button.component';

@Component({
  selector: 'button-list-main',
  standalone: true,
  imports: [HeaderButtonComponent],
  templateUrl: './button-list-main.component.html',
  styleUrl: './button-list-main.component.scss'
})
export class ButtonListMainComponent {
  @Input() title!: string;
  @Input() showing: boolean = !1;
  @Output() outputClick = new EventEmitter();

  sendEmitter = () => this.outputClick.emit();
}
