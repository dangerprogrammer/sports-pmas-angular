import { Component } from '@angular/core';
import { CadastroService } from '../../services/cadastro.service';
import { Router } from '@angular/router';
import { cadastroTypes } from '../../interfaces';

@Component({
  selector: 'app-cadastro',
  standalone: true,
  imports: [],
  templateUrl: './cadastro.component.html',
  styleUrl: './cadastro.component.scss'
})
export class CadastroComponent {
  constructor(
    private cadastro: CadastroService,
    private route: Router
  ) {}

  setCadastro(type: cadastroTypes) {
    this.cadastro.setCadastroType(type);
    this.route.navigate([`/cadastro/${type}`]);
  }
}
