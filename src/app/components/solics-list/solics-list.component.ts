import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { PrismaUser } from '../../types';
import { SolicButtonComponent } from '../solic-button/solic-button.component';

@Component({
  selector: 'solics-list',
  standalone: true,
  imports: [SolicButtonComponent],
  templateUrl: './solics-list.component.html',
  styleUrl: './solics-list.component.scss'
})
export class SolicsListComponent implements OnInit, AfterViewInit {
  constructor(
    private cdr: ChangeDetectorRef
  ) { }

  @Input() admin!: PrismaUser;
  @Input() solics!: PrismaUser[];
  @Input() refresh!: Function;

  @ViewChild('solicsList') solicsList!: ElementRef;
  @ViewChild('listSolics', { read: ViewContainerRef }) listSolics!: ViewContainerRef;

  pagesSize: 10 | 15 | 20 | 25 = 25;
  pagesNumber!: number;
  pageIndex = 0;

  pageSolics!: PrismaUser[];

  ngOnInit(): void {
    this.pagesNumber = Math.ceil(this.solics.length / this.pagesSize);
  }

  updatePageSolics = () => {
    this.pageSolics = this.solics.slice(this.pageIndex * this.pagesSize, (this.pageIndex + 1) * this.pagesSize);

    this.listSolics.clear();
    
    for (let solicUser of this.pageSolics) {
      const buttonRef = this.listSolics.createComponent(SolicButtonComponent);

      buttonRef.setInput('refresh', this.refresh);
      buttonRef.setInput('adminUser', this.admin);
      buttonRef.setInput('solicUser', solicUser);
    };
  };

  ngAfterViewInit(): void {
    const solic = this.solicsList.nativeElement;

    solic.addEventListener('wheel', (ev: Event) => ev.stopPropagation());

    solic.addEventListener('touchmove', (ev: Event) => ev.stopPropagation());

    this.updatePageSolics();
    this.cdr.detectChanges();
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
