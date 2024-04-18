import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild, ViewContainerRef } from '@angular/core';
import { PrismaUser } from '../../types';
import { SolicButtonComponent } from '../solic-button/solic-button.component';
import { CadastroService } from '../../services/cadastro.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'solics-list',
  standalone: true,
  imports: [SolicButtonComponent],
  templateUrl: './solics-list.component.html',
  styleUrl: './solics-list.component.scss'
})
export class SolicsListComponent implements OnInit, AfterViewInit {
  constructor(
    private cadastro: CadastroService
  ) { }

  @Input() admin!: PrismaUser;
  @Input() solics!: PrismaUser[];
  @Input() size: number = 0;
  @Input() refresh!: Function;
  @Input() pageIndex: number = 0;
  @Input() pagesSize: number = 25;
  @Input() onlyRead: boolean = !1;
  @Input() titleMsg?: string;

  @ViewChild('solicsList') solicsList!: ElementRef;
  @ViewChild('listSolics', { read: ViewContainerRef }) listSolics!: ViewContainerRef;

  @Output() updateLimits = new EventEmitter();

  pagesNumber!: number;
  accepting: boolean = !1;

  ngOnInit(): void {
    this.pagesNumber = Math.ceil(this.size / this.pagesSize);
  }

  acceptAll = (accepted: boolean) => {
    this.accepting = !0;
    this.cadastro.searchByAdmin(this.admin.id, { min: 0, max: this.size }, !1).subscribe(({ solics }) => {
      const usersSolic = solics.map(({ userId }) => userId).map(this.cadastro.searchUserById);

      forkJoin(usersSolic).subscribe(users => {
        const acceptsListPrisma = users
          .map(({ cpf }) => { return { cpf, accepted } })
          .map(this.cadastro.acceptUser);

        forkJoin(acceptsListPrisma).subscribe(() => this.refresh());
      });
    });
  }

  updatePageSolics = () => this.updateLimits.emit({
    min: this.pageIndex * this.pagesSize,
    max: (this.pageIndex + 1) * this.pagesSize,
    index: this.pageIndex
  });

  ngAfterViewInit(): void {
    const solic = this.solicsList.nativeElement;

    solic.addEventListener('wheel', (ev: Event) => ev.stopPropagation());

    solic.addEventListener('touchmove', (ev: Event) => ev.stopPropagation());
  }

  switchPage = (i: number = 0) => {
    this.pageIndex = (this.pageIndex + i) % this.pagesNumber;

    if (this.pageIndex < 0) this.pageIndex += this.pagesNumber;

    this.updatePageSolics();
  }

  switchFirst = () => {
    this.pageIndex = 0;

    this.updatePageSolics();
  }

  switchLast = () => {
    this.pageIndex = this.pagesNumber - 1;

    this.updatePageSolics();
  }

  min = Math.min;
}
