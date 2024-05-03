import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { PrismaUser } from '../../types';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'users-list',
  standalone: true,
  imports: [JsonPipe],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss'
})
export class UsersListComponent implements AfterViewInit {
  @Input() users!: PrismaUser[];

  @ViewChild('listUsers') listUsers!: ElementRef;

  ngAfterViewInit(): void {
    const user = this.listUsers.nativeElement;

    user.addEventListener('wheel', (ev: Event) => ev.stopPropagation());

    user.addEventListener('touchmove', (ev: Event) => ev.stopPropagation());
  }
}
