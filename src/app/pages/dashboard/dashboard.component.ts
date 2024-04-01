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
import { LogoutButtonComponent } from '../../components/header/logout-button/logout-button.component';
import { HeaderButtonListComponent } from '../../components/header/header-button-list/header-button-list.component';
import { ButtonListMainComponent } from '../../components/header/button-list-main/button-list-main.component';
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
    CreatorContentComponent,
    LogoutButtonComponent,
    HeaderButtonListComponent,
    ButtonListMainComponent
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
    const userByToken = this.cadastro.searchUserByToken();
    const refresh = this.cadastro.refreshToken();

    refresh.subscribe({
      error: this.logoutButton, complete: () => {
        userByToken.subscribe(user => {
          this.user = user as PrismaUser;
          this.loaded = !0;
          this.userRoles = this.user.roles;
        });
      }
    });
  }

  toggleDashboards: boolean = !0;

  onToggleDashboards(toggle?: boolean) {
    this.toggleDashboards = toggle == undefined ? !this.toggleDashboards : toggle;
  }

  logoutButton = () => {
    localStorage.removeItem("auth");
    this.router.navigate(["/login"]);
  }

  goProfile = () => this.router.navigate(["/profile"]);

  goModalidades = () => this.router.navigate(["/modalidades"]);

  toggleSidebar = () => {
    this.showSidebar = !this.showSidebar;
  }

  userRoles: ('ALUNO' | 'PROFESSOR' | 'ADMIN')[] = [];
  loaded: boolean = !1;
  user!: PrismaUser;
}
