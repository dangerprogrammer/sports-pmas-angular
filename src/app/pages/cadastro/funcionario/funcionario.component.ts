import { Component } from '@angular/core';
import { CadastrosHeaderComponent } from '../../../components/cadastros-header/cadastros-header.component';
import { MainComponent } from '../../../components/main/main.component';
import { FormCadastroComponent } from '../../../components/form-cadastro/form-cadastro.component';
import { FormInputComponent } from '../../../components/form-cadastro/form-input/form-input.component';
import { formTitle } from '../../../types';
import { FormTableComponent } from '../../../components/form-cadastro/form-table/form-table.component';

@Component({
  selector: 'app-funcionario',
  standalone: true,
  imports: [CadastrosHeaderComponent, MainComponent, FormCadastroComponent, FormInputComponent, FormTableComponent],
  templateUrl: './funcionario.component.html',
  styleUrl: './funcionario.component.scss'
})
export class FuncionarioComponent {
  protected switchForms: formTitle[] = [
    { id: 'professor', title: 'Professor' },
    { id: 'admin', title: 'Admin' }
  ];

  admin = this.switchForms[0];
  professor = this.switchForms[1];
  
  protected activeState: string = this.switchForms[0].title;
}