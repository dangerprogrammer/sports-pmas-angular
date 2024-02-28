import { Component } from '@angular/core';
import { CadastroService } from '../../services/cadastro.service';

@Component({
  selector: 'app-cadastro-horario',
  standalone: true,
  imports: [],
  templateUrl: './cadastro-horario.component.html',
  styleUrl: './cadastro-horario.component.scss'
})
export class CadastroHorarioComponent {
  constructor(
    private cadastro: CadastroService
  ) {
    const allAlunos = this.cadastro.getAll({ typeName: 'horarios' });

    allAlunos.subscribe(alunos => console.log(alunos));
  }
}
