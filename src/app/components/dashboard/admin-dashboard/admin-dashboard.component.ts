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
  solicUnreadUsers: PrismaUser[] = [];
  solicUsers: PrismaUser[] = [];
  loadedUnread: boolean = !1;
  loaded: boolean = !1;

  ngOnInit(): void {
    this.onUpdateLimits({ min: 0, max: this.pagesSize, index: 0 });
  }

  min!: number;
  max!: number;
  index!: number;
  sizeUnread!: number;
  size!: number;
  pagesSize: 15 | 20 | 25 | 50 | 75 | 100 = 50;

  onUpdateLimits = ({ min, max, index }: { min: number, max: number, index: number }) => {
    this.min = min;
    this.max = max;
    this.index = index;

    this.updateUnreadSolics();
    this.updateSolics();
  }

  refreshSolics = () => {
    this.updateUnreadSolics();
    this.updateSolics();
  }

  updateUnreadSolics = () => {
    const solics = this.cadastro.search.searchByAdmin(this.user.id, { min: this.min, max: this.max }, !1);

    this.loadedUnread = !1;
    solics.subscribe(({ solics, size }) => {
      this.solicUnreadUsers = [];

      this.sizeUnread = size;
      const usersSolic = solics.map(({ userId }) => userId).map(this.cadastro.search.searchUserById);

      if (!usersSolic.length) this.loadedUnread = !0;
      forkJoin(usersSolic).subscribe(users => {
        this.solicUnreadUsers = users.sort(({ id: idA }, { id: idB }) => idB - idA);
        this.loadedUnread = !0;
      });
    });
  }

  updateSolics = () => {
    const solics = this.cadastro.search.searchByAdmin(this.user.id, { min: this.min, max: this.max }, !0);

    this.loaded = !1;
    solics.subscribe(({ solics, size }) => {
      this.solicUsers = [];

      this.size = size;
      const usersSolic = solics.map(({ userId }) => userId).map(this.cadastro.search.searchUserById);

      if (!usersSolic.length) this.loaded = !0;
      forkJoin(usersSolic).subscribe(users => {
        this.solicUsers = users.sort(({ id: idA }, { id: idB }) => idB - idA);
        this.loaded = !0;
      });
    });
  }
}
