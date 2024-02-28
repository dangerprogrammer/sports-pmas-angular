import { Component } from '@angular/core';
import { CadastroService } from '../../services/cadastro.service';

@Component({
  selector: 'app-cadastro-professor',
  standalone: true,
  imports: [],
  templateUrl: './cadastro-professor.component.html',
  styleUrl: './cadastro-professor.component.scss'
})
export class CadastroProfessorComponent {
  constructor(
    private cadastro: CadastroService
  ) {
    const allAlunos = this.cadastro.getAll({ typeName: 'professores' });

    allAlunos.subscribe(alunos => console.log(alunos));
  }
}
