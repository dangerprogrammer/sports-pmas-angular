import { Component } from '@angular/core';
import { BackButtonComponent } from '../../../components/back-button/back-button.component';

@Component({
  selector: 'app-funcionario',
  standalone: true,
  imports: [BackButtonComponent],
  templateUrl: './funcionario.component.html',
  styleUrl: './funcionario.component.scss'
})
export class FuncionarioComponent {
  removeCadastroType() {
    localStorage.removeItem("cadastro-type");
  }
}
