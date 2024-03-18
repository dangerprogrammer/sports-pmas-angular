import { Component, Input } from '@angular/core';
import { HeaderButtonComponent } from '../../header/header-button/header-button.component';
import { CreatorContentComponent } from '../../creator-content/creator-content.component';

@Component({
  selector: 'dashboard-sidebar',
  standalone: true,
  imports: [HeaderButtonComponent, CreatorContentComponent],
  templateUrl: './dashboard-sidebar.component.html',
  styleUrl: './dashboard-sidebar.component.scss'
})
export class DashboardSidebarComponent {
  @Input() roles!: string[];
  @Input() hiddenSidebar!: boolean;
  @Input() toggle?: any;
}
