import { Component } from '@angular/core';
import { CadastroService } from '../../services/cadastro.service';

@Component({
  selector: 'app-cadastro-modalidade',
  standalone: true,
  imports: [],
  templateUrl: './cadastro-modalidade.component.html',
  styleUrl: './cadastro-modalidade.component.scss'
})
export class CadastroModalidadeComponent {
  constructor(
    private cadastro: CadastroService
  ) {
    const allAlunos = this.cadastro.getAll({ typeName: 'modalidades' });

    allAlunos.subscribe(alunos => console.log(alunos));
  }
}
