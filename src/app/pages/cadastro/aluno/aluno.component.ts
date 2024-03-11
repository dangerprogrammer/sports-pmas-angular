import { Component } from '@angular/core';
import { CadastrosHeaderComponent } from '../../../components/cadastros-header/cadastros-header.component';
import { MainComponent } from '../../../components/main/main.component';
import { FormCadastroComponent } from '../../../components/form-cadastro/form-cadastro.component';
import { FormInputComponent } from '../../../components/form-cadastro/form-input/form-input.component';

@Component({
  selector: 'app-aluno',
  standalone: true,
  imports: [CadastrosHeaderComponent, MainComponent, FormCadastroComponent, FormInputComponent],
  templateUrl: './aluno.component.html'
})
export class AlunoComponent {
}
