import { Component } from '@angular/core';
import { CadastrosHeaderComponent } from '../../../components/cadastros-header/cadastros-header.component';
import { MainComponent } from '../../../components/main/main.component';
import { FormCadastroComponent } from '../../../components/form-cadastro/form-cadastro.component';
import { FormInputComponent } from '../../../components/form-cadastro/form-input/form-input.component';
import { formTitle } from '../../../types';

@Component({
  selector: 'app-funcionario',
  standalone: true,
  imports: [CadastrosHeaderComponent, MainComponent, FormCadastroComponent, FormInputComponent],
  templateUrl: './funcionario.component.html'
})
export class FuncionarioComponent {
  protected switchForms: formTitle[] = [
    { title: 'Admin' },
    { title: 'Professor' }
  ];
  protected activeState: string = this.switchForms[0].title;
}