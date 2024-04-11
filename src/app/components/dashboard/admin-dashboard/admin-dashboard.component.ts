import { Component, Input, OnInit } from '@angular/core';
import { CadastroService } from '../../../services/cadastro.service';
import { PrismaSolic, PrismaUser } from '../../../types';
import { forkJoin, Observable } from 'rxjs';
import { SolicsListComponent } from '../../solics-list/solics-list.component';
import { LoadingContentComponent } from '../../loading-content/loading-content.component';

@Component({
  selector: 'admin-dashboard',
  standalone: true,
  imports: [SolicsListComponent, LoadingContentComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent implements OnInit {
  constructor(
    private cadastro: CadastroService
  ) { }

  @Input() user!: PrismaUser;
  solicUsers: PrismaUser[] = [];
  loaded: boolean = !1;
  msg: string = 'Não há solicitações!';

  ngOnInit(): void {
    this.updateSolics();
  }

  updateSolics = () => {
    const solics = this.cadastro.searchByAdmin(this.user.id);

    this.loaded = !1;
    solics.subscribe(listSolics => {
      this.solicUsers = [];

      const usersSolic = listSolics.map(({ userId }) => userId).map(this.cadastro.searchUserById);

      if (!usersSolic.length) this.loaded = !0;
      forkJoin(usersSolic).subscribe(users => {
        this.solicUsers = users.sort(({ id: idA }, { id: idB }) => idB - idA);
        this.loaded = !0;
      });
    });
  }
}
