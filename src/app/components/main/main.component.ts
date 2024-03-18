import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {
  @Input() cadastro?: boolean = !1;
  @Input() dashboard?: boolean = !1;
  @Input() mainStyles?: {};
}
