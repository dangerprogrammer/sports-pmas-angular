import { Component } from '@angular/core';
import { CadastroService } from '../../services/cadastro.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { BackButtonComponent } from '../../components/back-button/back-button.component';
import { MainComponent } from '../../components/main/main.component';
import { MainButtonComponent } from '../../components/main/main-button/main-button.component';
import { cadastroTypes } from '../../types';
import { CadastroSidebarComponent } from '../../components/cadastro-sidebar/cadastro-sidebar.component';
import { CadastroLogoComponent } from '../../components/cadastro-logo/cadastro-logo.component';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [HeaderComponent, BackButtonComponent, MainComponent, MainButtonComponent, CadastroSidebarComponent, CadastroLogoComponent],
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.scss'
})
export class CadastroComponent {
  constructor(
    private cadastro: CadastroService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  setCadastro = (type: cadastroTypes) => () => {
    this.cadastro.setCadastroType(type);
    this.router.navigate(['/cadastro', type], { relativeTo: this.route });
  }
}
