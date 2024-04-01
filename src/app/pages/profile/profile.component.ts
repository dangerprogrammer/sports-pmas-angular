import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { HeaderButtonComponent } from '../../components/header/header-button/header-button.component';
import { Router } from '@angular/router';
import { MainComponent } from '../../components/main/main.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [HeaderComponent, HeaderButtonComponent, MainComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  constructor(
    private router: Router
  ) {}

  goDashboard = () => {
    this.router.navigate(["/dashboard"]);
  }

  logoutButton = () => {
    localStorage.removeItem("auth");
    this.router.navigate(["/login"]);
  }
}
