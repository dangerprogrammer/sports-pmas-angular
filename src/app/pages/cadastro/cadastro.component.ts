import { Component, OnInit } from '@angular/core';
import { CadastroService } from '../../services/cadastro.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { BackButtonComponent } from '../../components/back-button/back-button.component';
import { MainComponent } from '../../components/main/main.component';
import { MainButtonComponent } from '../../components/main/main-button/main-button.component';
import { cadastroTypes, PrismaUser } from '../../types';
import { CadastroSidebarComponent } from '../../components/cadastro-sidebar/cadastro-sidebar.component';
import { CadastroLogoComponent } from '../../components/cadastro-logo/cadastro-logo.component';
import { HeaderButtonComponent } from '../../components/header/header-button/header-button.component';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [HeaderComponent, BackButtonComponent, HeaderButtonComponent, MainComponent, MainButtonComponent, CadastroSidebarComponent, CadastroLogoComponent],
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.scss'
})
export class CadastroComponent implements OnInit {
  constructor(
    private cadastro: CadastroService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  user?: PrismaUser;

  ngOnInit(): void {
    if (!this.cadastro.token) return;
    
    const userByToken = this.cadastro.search.searchUserByToken();
    const refresh = this.cadastro.auth.refreshToken();

    refresh.subscribe({
      error: this.logout, complete: () => userByToken.subscribe({
        error: this.logout, next: user => this.user = user
      })
    })
  }

  logout = () => {
    localStorage.removeItem("auth");
    this.router.navigate(["/login"]);
  }

  setCadastro = (type: cadastroTypes) => () => {
    this.cadastro.cadastroType = type;
    this.router.navigate(['/cadastro', type], { relativeTo: this.route });
  }

  goDashboard = () => this.router.navigate(["/dashboard"]);
}
