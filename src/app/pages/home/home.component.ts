import { Component } from '@angular/core';
import { CadastroService } from '../../services/cadastro.service';
import { subscribeTypes } from '../../types';
import { ActivatedRoute, Router } from '@angular/router';
import { MainComponent } from '../../components/main/main.component';
import { MainButtonComponent } from '../../components/main/main-button/main-button.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MainComponent, MainButtonComponent],
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
    this.cadastro.subscribe = sub;
    localStorage.removeItem("cadastro-type");
    this.router.navigate([`/${sub}`], { relativeTo: this.route });
  };
}