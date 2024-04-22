import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { HeaderButtonComponent } from '../../components/header/header-button/header-button.component';
import { MainComponent } from '../../components/main/main.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [HeaderComponent, HeaderButtonComponent, MainComponent],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.scss'
})
export class NotificationsComponent {
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
