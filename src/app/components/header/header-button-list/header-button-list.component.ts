import { AfterContentInit, Component, ContentChildren, Input, QueryList } from '@angular/core';
import { ButtonListMainComponent } from '../button-list-main/button-list-main.component';
import { HeaderButtonComponent } from '../header-button/header-button.component';

@Component({
  selector: 'header-button-list',
  standalone: true,
  imports: [],
  templateUrl: './header-button-list.component.html',
  styleUrl: './header-button-list.component.scss'
})
export class HeaderButtonListComponent implements AfterContentInit {
  @Input() showing: boolean = !1;
  @Input() leftLevel: number = 1;

  @ContentChildren(ButtonListMainComponent) buttonList?: QueryList<ButtonListMainComponent>;
  @ContentChildren(HeaderButtonComponent) headerButtonList?: QueryList<HeaderButtonComponent>;

  @ContentChildren(HeaderButtonListComponent) headerButtonListList?: QueryList<HeaderButtonListComponent>;

  setLeft = (level: number) => {
    this.leftLevel += level;
  }

  ngAfterContentInit(): void {
    if (this.buttonList) this.buttonList.forEach(el =>
      setTimeout(() => el.setLeft(this.leftLevel))
    );

    if (this.headerButtonList) this.headerButtonList.forEach(el => 
      setTimeout(() => el.setLeft(this.leftLevel + 1))
    );

    if (this.headerButtonListList) this.headerButtonListList.forEach(el => 
      setTimeout(() => el.setLeft(this.leftLevel + 1))
    );
  }
}
