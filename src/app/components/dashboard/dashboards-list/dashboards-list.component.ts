import { Component, Input } from '@angular/core';
import { AlunoDashboardComponent } from '../aluno-dashboard/aluno-dashboard.component';
import { ProfessorDashboardComponent } from '../professor-dashboard/professor-dashboard.component';
import { AdminDashboardComponent } from '../admin-dashboard/admin-dashboard.component';
import { PrismaUser } from '../../../types';

@Component({
  selector: 'dashboards-list',
  standalone: true,
  imports: [AlunoDashboardComponent, ProfessorDashboardComponent, AdminDashboardComponent],
  templateUrl: './dashboards-list.component.html',
  styleUrl: './dashboards-list.component.scss'
})
export class DashboardsListComponent {
  @Input() dashboards!: ('ALUNO' | 'PROFESSOR' | 'ADMIN')[];
  @Input() user!: PrismaUser;
  @Input() createAlert!: Function;
}
