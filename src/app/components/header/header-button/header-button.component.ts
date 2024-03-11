import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-header-button',
  standalone: true,
  imports: [],
  templateUrl: './header-button.component.html',
  styleUrl: './header-button.component.scss'
})
export class HeaderButtonComponent {
  @Input() click?: Function;
}