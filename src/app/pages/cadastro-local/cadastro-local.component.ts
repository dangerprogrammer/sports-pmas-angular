import { Component } from '@angular/core';
import { CadastroService } from '../../services/cadastro.service';

@Component({
  selector: 'app-cadastro-local',
  standalone: true,
  imports: [],
  templateUrl: './cadastro-local.component.html',
  styleUrl: './cadastro-local.component.scss'
})
export class CadastroLocalComponent {
  constructor(
    private cadastro: CadastroService
  ) {
    const allAlunos = this.cadastro.getAll({ typeName: 'locais' });

    allAlunos.subscribe(alunos => console.log(alunos));
  }
}
