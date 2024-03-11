import { Component } from '@angular/core';
import { BackButtonComponent } from '../../../components/back-button/back-button.component';

@Component({
  selector: 'app-aluno',
  standalone: true,
  imports: [BackButtonComponent],
  templateUrl: './aluno.component.html',
  styleUrl: './aluno.component.scss'
})
export class AlunoComponent {
  removeCadastroType() {
    localStorage.removeItem("cadastro-type");
  }
}
