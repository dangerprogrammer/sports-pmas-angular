import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-back-button',
  standalone: true,
  imports: [],
  templateUrl: './back-button.component.html',
  styleUrl: './back-button.component.scss'
})
export class BackButtonComponent {
  @Input() link?: string;
  @Input() click?: Function;

  constructor(
    private router: Router
  ) {}

  redirect(link?: string, click?: Function) {
    if (click) click();
    this.router.navigate([link || "/"]);
  }
}
