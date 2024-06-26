import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { PrismaUser } from '../../types';
import { SolicContentComponent } from '../solic-content/solic-content.component';
import { DateTools, StringTools } from '../../tools';
import { JsonPipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'users-list',
  standalone: true,
  imports: [JsonPipe, SolicContentComponent],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss'
})
export class UsersListComponent extends StringTools implements OnInit, AfterViewInit {
  @Input() users!: PrismaUser[];
  @Input() size: number = 0;
  @Input() refresh!: Function;
  @Input() pageIndex: number = 0;
  @Input() pagesSize: number = 25;

  constructor(
    private router: Router
  ) {
    super();
  }

  @ViewChild('listUsers') listUsers!: ElementRef;

  @Output() updateLimits = new EventEmitter();

  pagesNumber!: number;
  accepting: boolean = !1;

  date = new DateTools();

  ngOnInit(): void {
    this.pagesNumber = Math.ceil(this.size / this.pagesSize);
  }

  updatePageSolics = () => this.updateLimits.emit({
    min: this.pageIndex * this.pagesSize,
    max: (this.pageIndex + 1) * this.pagesSize,
    index: this.pageIndex
  });

  ngAfterViewInit(): void {
    const user = this.listUsers.nativeElement;

    user.addEventListener('wheel', (ev: Event) => ev.stopPropagation());

    user.addEventListener('touchmove', (ev: Event) => ev.stopPropagation());
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

  goTo = (cpf: string) => {
    this.router.navigate([`users/${cpf}`]);
  }

  min = Math.min;
}
