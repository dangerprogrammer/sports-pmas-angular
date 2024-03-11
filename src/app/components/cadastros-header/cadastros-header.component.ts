import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { HomeButtonComponent } from '../header/home-button/home-button.component';
import { BackButtonComponent } from '../back-button/back-button.component';

@Component({
  selector: 'app-cadastros-header',
  standalone: true,
  imports: [HeaderComponent, HomeButtonComponent, BackButtonComponent],
  templateUrl: './cadastros-header.component.html',
  styleUrl: './cadastros-header.component.scss'
})
export class CadastrosHeaderComponent {
  removeCadastroType() {
    localStorage.removeItem("cadastro-type");
  }
}
