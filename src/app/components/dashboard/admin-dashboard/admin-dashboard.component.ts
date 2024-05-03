import { Component, Input, OnInit } from '@angular/core';
import { CadastroService } from '../../../services/cadastro.service';
import { PrismaUser } from '../../../types';
import { forkJoin } from 'rxjs';
import { SolicsListComponent } from '../../solics-list/solics-list.component';
import { LoadingContentComponent } from '../../loading-content/loading-content.component';
import { UsersListComponent } from '../../users-list/users-list.component';

@Component({
  selector: 'admin-dashboard',
  standalone: true,
  imports: [SolicsListComponent, LoadingContentComponent, UsersListComponent],
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
  solicAdmins: PrismaUser[] = [];
  solicProfessores: PrismaUser[] = [];
  solicAlunos: PrismaUser[] = [];

  loadedUnread: boolean = !1;
  loaded: boolean = !1;
  loadedAdmins: boolean = !1;
  loadedProfessores: boolean = !1;
  loadedAlunos: boolean = !1;

  ngOnInit(): void {
    this.onUpdateLimits({ min: 0, max: this.pagesSize, index: 0 }, 'unread');
    this.onUpdateLimits({ min: 0, max: this.pagesSize, index: 0 }, 'read');

    this.onUpdateLimits({ min: 0, max: this.pagesSize, index: 0 }, 'admin');
    this.onUpdateLimits({ min: 0, max: this.pagesSize, index: 0 }, 'professor');
    this.onUpdateLimits({ min: 0, max: this.pagesSize, index: 0 }, 'aluno');
  }

  minSolicUnread!: number;
  minSolic!: number;
  minAdmin!: number;
  minProfessor!: number;
  minAluno!: number;

  maxSolicUnread!: number;
  maxSolic!: number;
  maxAdmin!: number;
  maxProfessor!: number;
  maxAluno!: number;

  indexSolicUnread!: number;
  indexSolic!: number;
  indexAdmin!: number;
  indexProfessor!: number;
  indexAluno!: number;

  sizeUnread!: number;
  size!: number;
  sizeAdmin!: number;
  sizeProfessor!: number;
  sizeAluno!: number;

  pagesSize: 15 | 20 | 25 | 50 | 75 | 100 = 50;

  onUpdateLimits = (
    { min, max, index }: { min: number, max: number, index: number },
    solicType: 'unread' | 'read' | 'admin' | 'professor' | 'aluno') => {
    if (solicType == 'unread') {
      this.minSolicUnread = min;
      this.maxSolicUnread = max;
      this.indexSolicUnread = index;

      this.updateSolics();
    } else if (solicType == 'read') {
      this.minSolic = min;
      this.maxSolic = max;
      this.indexSolic = index;

      this.updateUnreadSolics();
    } else if (solicType == 'admin') {
      this.minAdmin = min;
      this.maxAdmin = max;
      this.indexAdmin = index;

      this.updateAdmins();
    } else if (solicType == 'professor') {
      this.minProfessor = min;
      this.maxProfessor = max;
      this.indexProfessor = index;

      this.updateProfessores();
    } else {
      this.minAluno = min;
      this.maxAluno = max;
      this.indexAluno = index;

      this.updateAlunos();
    };
  }

  refreshSolics = () => {
    this.updateUnreadSolics();
    this.updateSolics();
    this.updateAdmins();
  }

  updateUnreadSolics = () => {
    const solics = this.cadastro.search.searchByAdmin(this.user.id, { min: this.minSolic, max: this.maxSolic }, !1);

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
    const solics = this.cadastro.search.searchByAdmin(this.user.id, { min: this.minSolicUnread, max: this.maxSolicUnread }, !0);

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

  updateAdmins = () => {
    const prismaAdmins = this.cadastro.search.searchUsers('ADMIN', { min: this.minAdmin, max: this.maxAdmin });

    this.loadedAdmins = !1;
    prismaAdmins.subscribe(({ users }) => {
      this.solicAdmins = users;

      this.loadedAdmins = !0;
    });
  }

  updateProfessores = () => {
    const prismaProfessores = this.cadastro.search.searchUsers('PROFESSOR', { min: this.minProfessor, max: this.maxProfessor });

    this.loadedProfessores = !1;
    prismaProfessores.subscribe(({ users }) => {
      this.solicProfessores = users;

      this.loadedProfessores = !0;
    });
  }

  updateAlunos = () => {
    const prismaAlunos = this.cadastro.search.searchUsers('ALUNO', { min: this.minAluno, max: this.maxAluno });

    this.loadedAlunos = !1;
    prismaAlunos.subscribe(({ users }) => {
      this.solicAlunos = users;

      this.loadedAlunos = !0;
    });
  }
}
