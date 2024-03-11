import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { CadastroService } from '../../services/cadastro.service';
import { subscribeTypes } from '../../types';
import { ActivatedRoute, Router } from '@angular/router';
import { HeaderButtonComponent } from '../../components/header/header-button/header-button.component';
import { MainComponent } from '../../components/main/main.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HeaderComponent, HeaderButtonComponent, MainComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  constructor(
    private cadastro: CadastroService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  setSubscribe = (sub: subscribeTypes) => () => {
    this.cadastro.setSubscribe(sub);
    localStorage.removeItem("cadastro-type");
    this.router.navigate([`/${sub}`], { relativeTo: this.route });
  };
}