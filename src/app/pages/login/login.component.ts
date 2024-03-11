import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { BackButtonComponent } from '../../components/back-button/back-button.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [HeaderComponent, BackButtonComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

}
