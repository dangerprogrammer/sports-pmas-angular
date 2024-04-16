import { AfterContentInit, AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'header-button',
  standalone: true,
  imports: [],
  templateUrl: './header-button.component.html',
  styleUrl: './header-button.component.scss'
})
export class HeaderButtonComponent implements AfterContentInit {
  @Input() click?: Function;
  @Input() iconSide: 'left' | 'right' = 'left';
  @Input() showing: boolean = !1;
  @Output() outputClick = new EventEmitter();

  leftLevel: number = 0;

  constructor(
    private cdr: ChangeDetectorRef
  ) {}

  setLeft = (level: number) => this.leftLevel += level;

  sendEmitter = () => this.outputClick.emit();

  ngAfterContentInit(): void {
    this.cdr.detectChanges();
  }
}