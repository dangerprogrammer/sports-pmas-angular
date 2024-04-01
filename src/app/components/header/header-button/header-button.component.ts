import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'header-button',
  standalone: true,
  imports: [],
  templateUrl: './header-button.component.html',
  styleUrl: './header-button.component.scss'
})
export class HeaderButtonComponent implements OnInit {
  @Input() click?: Function;
  @Input() iconSide: 'left' | 'right' = 'left';
  @Input() showing: boolean = !1;
  @Output() outputClick = new EventEmitter();

  sendEmitter = () => this.outputClick.emit();

  ngOnInit(): void {
    if (this.outputClick.observed) this.click ||= this.sendEmitter;
  }
}