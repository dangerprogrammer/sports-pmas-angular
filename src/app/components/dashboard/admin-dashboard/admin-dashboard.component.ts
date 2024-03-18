import { Component, Input, OnInit } from '@angular/core';
import { CadastroService } from '../../../services/cadastro.service';
import { PrismaSolic, PrismaUser } from '../../../types';
import { Observable } from 'rxjs';
import { SolicsListComponent } from '../../solics-list/solics-list.component';

@Component({
  selector: 'admin-dashboard',
  standalone: true,
  imports: [SolicsListComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent implements OnInit {
  constructor(
    private cadastro: CadastroService
  ) {}

  @Input() user!: PrismaUser;
  solicUsers: PrismaUser[] = [];

  ngOnInit(): void {
    this.updateSolics();
  }

  updateSolics = () => {
    const solics = this.cadastro.searchByAdmin(this.user.id);

    solics.subscribe(res => {
      const listSolics = res as PrismaSolic[];
      this.solicUsers = [];

      listSolics.forEach(solic => {
        const userSolic = this.cadastro.searchUserById(solic.userId);

        (userSolic as Observable<PrismaUser>).subscribe(solicUser => 
          this.solicUsers.push(solicUser)
        );
      });
    });
  }
}
