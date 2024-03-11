import { Component, Input } from '@angular/core';
import { formTitle } from '../../types';

@Component({
  selector: 'app-form-cadastro',
  standalone: true,
  imports: [],
  templateUrl: './form-cadastro.component.html',
  styleUrl: './form-cadastro.component.scss'
})
export class FormCadastroComponent {
  @Input() titleForm?: string;
  @Input() titlesSwitch?: formTitle[];

  logTitles() {
    console.log(this.titlesSwitch);
  }

  selectTitle(title: formTitle) {}
}
