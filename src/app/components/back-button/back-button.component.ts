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
  @Input() text?: string;
  @Input() link?: string;
  @Input() buttonClick?: any;

  constructor(
    private router: Router
  ) {}

  defText: string = "Voltar";
  defLink: string = "/";

  redirect(link?: string, buttonClick?: any) {
    buttonClick();
    this.router.navigate([link || this.defLink]);
  }
}
