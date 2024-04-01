import { Component, Input } from '@angular/core';

@Component({
  selector: 'header-button-list',
  standalone: true,
  imports: [],
  templateUrl: './header-button-list.component.html',
  styleUrl: './header-button-list.component.scss'
})
export class HeaderButtonListComponent {
  @Input() showing: boolean = !1;
}
