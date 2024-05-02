import { AfterViewInit, Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { CadastroService } from '../../services/cadastro.service';
import { AdminDashboardComponent } from '../../components/dashboard/admin-dashboard/admin-dashboard.component';
import { AlunoDashboardComponent } from '../../components/dashboard/aluno-dashboard/aluno-dashboard.component';
import { ProfessorDashboardComponent } from '../../components/dashboard/professor-dashboard/professor-dashboard.component';
import { PrismaUser, role } from '../../types';
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
import { AlertService } from '../../services/alert.service';

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
export class DashboardComponent implements OnInit, AfterViewInit {
  constructor(
    private cadastro: CadastroService,
    private router: Router
  ) { }

  @ViewChild('alerts', { read: ViewContainerRef }) alerts!: ViewContainerRef;

  alert!: AlertService;

  showSidebar: boolean = !1;
  dashboardsList?: Element;

  ngOnInit(): void {
    const userByToken = this.cadastro.search.searchUserByToken();
    const refresh = this.cadastro.auth.refreshToken();

    refresh.subscribe({
      error: this.logoutButton, complete: () => userByToken.subscribe({
        error: this.logoutButton, next: user => {
          this.user = user;
          this.userRoles = this.user.roles;
        }, complete: () => {
          this.loaded = !0;

          setTimeout(() => {
            const dashList = document.querySelector('dashboards-list');

            if (dashList) {
              this.dashboardsList = dashList;

              dashList.addEventListener('wheel', ev => ev.preventDefault());

              dashList.addEventListener('touchmove', ev => ev.preventDefault());
            };
          });
        }
      })
    });
  }

  ngAfterViewInit(): void {
    this.alert = new AlertService(this.alerts);
  }

  createAlert = (data?: any) => {
    this.alert.createAlert(data);
  }

  toggleDashboards: boolean = !0;

  onToggleDashboards(toggle?: boolean) {
    this.toggleDashboards = toggle == undefined ? !this.toggleDashboards : toggle;
  }

  toggleAdmins: boolean = !0;

  onToggleAdmins(toggle?: boolean) {
    this.toggleAdmins = toggle == undefined ? !this.toggleAdmins : toggle;
  }

  toggleUsers: boolean = !1;

  onToggleUsers(toggle?: boolean) {
    this.toggleUsers = toggle == undefined ? !this.toggleUsers : toggle;
  }

  logoutButton = () => {
    localStorage.removeItem("auth");
    this.router.navigate(["/login"]);
  }

  goProfile = () => this.router.navigate(["/profile"]);

  goNotifs = () => this.router.navigate(["/notifications"]);

  goModalidades = () => this.router.navigate(["/modalidades"]);

  toggleSidebar = () => this.showSidebar = !this.showSidebar;

  goDashAdmin = () => {
    const dashAdmin = document.querySelector('admin-dashboard') as HTMLElement;

    this.dashboardsList?.scrollTo(dashAdmin.offsetLeft || 0, dashAdmin.offsetTop || 0);
    
    this.toggleSidebar();
  }

  goAdminSolicsUnread = () => {
    const dashRow = document.querySelector('admin-dashboard')?.firstChild as Element;
    const solicsUnread = dashRow.children[0] as HTMLElement;

    dashRow.scrollTo(solicsUnread.offsetLeft, solicsUnread.offsetTop || 0);
  }

  goAdminSolics = () => {
    const dashRow = document.querySelector('admin-dashboard')?.firstChild as Element;
    const solics = dashRow.children[1] as HTMLElement;

    dashRow.scrollTo(solics.offsetLeft, solics.offsetTop || 0);
  }

  goSolicsUnread = () => {
    this.goDashAdmin();
    this.goAdminSolicsUnread();
  };

  goSolics = () => {
    this.goDashAdmin();
    this.goAdminSolics();
  }

  goDashProfessor = () => {
    const dashProfessor = document.querySelector('professor-dashboard') as HTMLElement;

    this.dashboardsList?.scrollTo(dashProfessor.offsetLeft || 0, dashProfessor.offsetTop || 0);
    this.toggleSidebar();
  }

  goDashAluno = () => {
    const dashAluno = document.querySelector('aluno-dashboard') as HTMLElement;

    this.dashboardsList?.scrollTo(dashAluno.offsetLeft || 0, dashAluno.offsetTop || 0);
    this.toggleSidebar();
  }

  userRoles: role[] = [];
  loaded: boolean = !1;
  user!: PrismaUser;
}
