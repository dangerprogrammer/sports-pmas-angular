import { Component, Input } from '@angular/core';
import { CadastroService } from '../../../services/cadastro.service';
import { PrismaUser } from '../../../types';

@Component({
  selector: 'aluno-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './aluno-dashboard.component.html',
  styleUrl: './aluno-dashboard.component.scss'
})
export class AlunoDashboardComponent {
  constructor(
    private cadastro: CadastroService
  ) {}

  @Input() user!: PrismaUser;

  ngOnInit(): void {
    console.log(this.user);
  }
}
