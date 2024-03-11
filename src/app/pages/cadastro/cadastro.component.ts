import { Component } from '@angular/core';
import { CadastroService } from '../../services/cadastro.service';
import { ActivatedRoute, Router } from '@angular/router';
import { cadastroTypes } from '../../interfaces';
import { HeaderComponent } from '../../components/header/header.component';
import { BackButtonComponent } from '../../components/back-button/back-button.component';
import { MainComponent } from '../../components/main/main.component';
import { MainButtonComponent } from '../../components/main/main-button/main-button.component';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [HeaderComponent, BackButtonComponent, MainComponent, MainButtonComponent],
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
