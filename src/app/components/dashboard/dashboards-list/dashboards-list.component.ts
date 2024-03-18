import { Component, Input } from '@angular/core';

@Component({
  selector: 'dashboards-list',
  standalone: true,
  imports: [],
  templateUrl: './dashboards-list.component.html',
  styleUrl: './dashboards-list.component.scss'
})
export class DashboardsListComponent {
  @Input() dashboards: any[] = [];
}
