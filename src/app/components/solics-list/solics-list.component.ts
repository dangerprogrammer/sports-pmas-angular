import { Component, Input } from '@angular/core';
import { PrismaUser } from '../../types';
import { SolicButtonComponent } from '../solic-button/solic-button.component';

@Component({
  selector: 'solics-list',
  standalone: true,
  imports: [SolicButtonComponent],
  templateUrl: './solics-list.component.html',
  styleUrl: './solics-list.component.scss'
})
export class SolicsListComponent {
  @Input() refresh?: any;
  @Input() admin!: PrismaUser;
  @Input() solics!: PrismaUser[];
}
