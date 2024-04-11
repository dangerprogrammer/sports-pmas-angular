import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { CadastroService } from '../../services/cadastro.service';
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
import { LoadingContentComponent } from '../../components/loading-content/loading-content.component';

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
    ButtonListMainComponent,
    LoadingContentComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  constructor(
    private cadastro: CadastroService,
    private router: Router
  ) { }

  showSidebar: boolean = !1;
  dashboardsList?: Element;

  ngOnInit(): void {
    const userByToken = this.cadastro.searchUserByToken();
    const refresh = this.cadastro.refreshToken();

    refresh.subscribe({
      error: this.logoutButton, complete: () => userByToken.subscribe(user => {
        this.user = user;
        this.loaded = !0;
        this.userRoles = this.user.roles;


        setTimeout(() => {
          const dashList = document.querySelector('dashboards-list');
          
          if (dashList) {
            this.dashboardsList = dashList;

            dashList.addEventListener('wheel', ev => ev.preventDefault());

            dashList.addEventListener('touchmove', ev => ev.preventDefault());
          };
        });
      })
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

  toggleSidebar = () => this.showSidebar = !this.showSidebar;

  goDashAdmin = () => {
    const dashAdmin = document.querySelector('admin-dashboard') as any;

    this.dashboardsList?.scrollTo(0, dashAdmin.offsetTop || 0);
    this.toggleSidebar();
  }

  goDashProfessor = () => {
    const dashProfessor = document.querySelector('professor-dashboard') as any;

    this.dashboardsList?.scrollTo(0, dashProfessor.offsetTop || 0);
    this.toggleSidebar();
  }

  goDashAluno = () => {
    const dashAluno = document.querySelector('aluno-dashboard') as any;

    this.dashboardsList?.scrollTo(0, dashAluno.offsetTop || 0);
    this.toggleSidebar();
  }

  userRoles: ('ALUNO' | 'PROFESSOR' | 'ADMIN')[] = [];
  loaded: boolean = !1;
  user!: PrismaUser;
}
