import { Component, Input } from '@angular/core';
import { NotificationsListComponent } from '../notifications-list/notifications-list.component';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [NotificationsListComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {
  @Input() cadastro: boolean = !1;
  @Input() dashboard: boolean = !1;
  @Input() mainStyles?: {};
}
