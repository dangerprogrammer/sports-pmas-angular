import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { CadastroService } from '../../services/cadastro.service';
import { token } from '../../interfaces';
import { AdminDashboardComponent } from '../../components/dashboard/admin-dashboard/admin-dashboard.component';
import { AlunoDashboardComponent } from '../../components/dashboard/aluno-dashboard/aluno-dashboard.component';
import { ProfessorDashboardComponent } from '../../components/dashboard/professor-dashboard/professor-dashboard.component';
import { PrismaUser } from '../../types';
import { HeaderButtonComponent } from '../../components/header/header-button/header-button.component';
import { Router } from '@angular/router';
import { MainComponent } from '../../components/main/main.component';
import { DashboardSidebarComponent } from '../../components/dashboard/dashboard-sidebar/dashboard-sidebar.component';
import { DashboardsListComponent } from '../../components/dashboard/dashboards-list/dashboards-list.component';
import { CreatorContentComponent } from '../../components/creator-content/creator-content.component';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    HeaderComponent,
    AlunoDashboardComponent,
    ProfessorDashboardComponent,
    AdminDashboardComponent,
    HeaderButtonComponent,
    MainComponent,
    DashboardSidebarComponent,
    DashboardsListComponent,
    CreatorContentComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  constructor(
    private cadastro: CadastroService,
    private router: Router
  ) { }

  showSidebar: boolean = !0;

  ngOnInit(): void {
    const that = this;
    const userByToken = this.cadastro.searchUserByToken();
    const refresh = this.cadastro.refreshToken();

    refresh.subscribe({
      error: that.logoutButton, complete() {
        userByToken.subscribe(user => {
          that.user = user as PrismaUser;
          that.loaded = !0;
          that.userRoles = that.user.roles;
        });
      }
    });
  }

  logoutButton = () => {
    localStorage.removeItem("auth");
    this.router.navigate(["/login"]);
  }

  goProfile = () => {
    this.router.navigate(["/profile"]);
  };

  toggleSidebar = () => {
    this.showSidebar = !this.showSidebar;
  }

  userRoles: string[] = [];
  loaded: boolean = !1;
  user!: PrismaUser;
}
