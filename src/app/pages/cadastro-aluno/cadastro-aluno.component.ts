import { Component } from '@angular/core';
import { CadastroService } from '../../services/cadastro.service';

@Component({
  selector: 'app-cadastro-aluno',
  standalone: true,
  imports: [],
  templateUrl: './cadastro-aluno.component.html',
  styleUrl: './cadastro-aluno.component.scss'
})
export class CadastroAlunoComponent {
  constructor(
    private cadastro: CadastroService
  ) {
  }
}
