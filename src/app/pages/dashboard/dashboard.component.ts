import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { CadastroService } from '../../services/cadastro.service';
import { token } from '../../interfaces';
import { AdminDashboardComponent } from '../../components/dashboard/admin-dashboard/admin-dashboard.component';
import { AlunoDashboardComponent } from '../../components/dashboard/aluno-dashboard/aluno-dashboard.component';
import { ProfessorDashboardComponent } from '../../components/dashboard/professor-dashboard/professor-dashboard.component';
import { PrismaUser } from '../../types';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [HeaderComponent, AlunoDashboardComponent, ProfessorDashboardComponent, AdminDashboardComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  constructor(
    private cadastro: CadastroService
  ) { }

  ngOnInit(): void {
    const userByToken = this.cadastro.searchUserByToken();
    const refresh = this.cadastro.refreshToken();

    refresh.subscribe((_token: token) => userByToken.subscribe(user => {
      this.user = user as PrismaUser;
      this.userRoles = this.user.roles;
    }));
  }

  userRoles: string[] = [];
  user!: PrismaUser;
}
