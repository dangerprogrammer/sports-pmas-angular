import { Component, Input } from '@angular/core';
import { HeaderButtonComponent } from '../header-button/header-button.component';

@Component({
  selector: 'logout-button',
  standalone: true,
  imports: [HeaderButtonComponent],
  templateUrl: './logout-button.component.html',
  styleUrl: './logout-button.component.scss'
})
export class LogoutButtonComponent {
  @Input() click?: Function;
}
