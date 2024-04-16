import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { HeaderButtonComponent } from '../header-button/header-button.component';

@Component({
  selector: 'button-list-main',
  standalone: true,
  imports: [HeaderButtonComponent],
  templateUrl: './button-list-main.component.html',
  styleUrl: './button-list-main.component.scss'
})
export class ButtonListMainComponent implements AfterViewInit {
  @Input() title!: string;
  @Input() showing: boolean = !1;
  @Output() outputClick = new EventEmitter();

  leftLevel: number = 1;

  @ViewChild('button') button!: HeaderButtonComponent;

  sendEmitter = () => this.outputClick.emit();

  setLeft!: Function;

  ngAfterViewInit(): void {
    this.setLeft = this.button.setLeft;
  }
}
