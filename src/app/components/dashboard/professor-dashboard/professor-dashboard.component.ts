import { Component, Input } from '@angular/core';
import { CadastroService } from '../../../services/cadastro.service';
import { PrismaUser } from '../../../types';

@Component({
  selector: 'professor-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './professor-dashboard.component.html',
  styleUrl: './professor-dashboard.component.scss'
})
export class ProfessorDashboardComponent {
  constructor(
    private cadastro: CadastroService
  ) {}

  @Input() user!: PrismaUser;

  ngOnInit(): void {
    console.log(this.user);
  }
}
