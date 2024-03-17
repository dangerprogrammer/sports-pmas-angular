import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { CadastroService } from '../../services/cadastro.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [HeaderComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  constructor(
    private cadastro: CadastroService
  ) {}

  ngOnInit(): void {
    const userByToken = this.cadastro.searchUserByToken();

    userByToken.subscribe(user => {
      console.log(user);
    });
  }
}
