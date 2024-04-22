import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'notification',
  standalone: true,
  imports: [],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss'
})
export class NotificationComponent implements OnInit {
  @Input() index: number = 0;
  @Input() duration: number = 10;
  @Input() noDuration: boolean = !1;
  @Output() delete = new EventEmitter();
  @Input() actionClick?: Function;
  @Input() text?: string;
  @Input() error: boolean = !1;
  @Input() hide: boolean = !1;
  @Input() showIndex: boolean = !1;
  @Input() spawnDuration: number = 300;
  @Input() headerText?: string;

  spawn: boolean = !1;

  unspawnDuration: number = this.spawnDuration * 1.6;

  ngOnInit(): void {
    this.spawn = !0;
    if (!this.text) this.text = `Notificação ${this.index + 1}`;

    setTimeout(() => this.hide = !0, (this.duration + .2) * 1e3 + this.spawnDuration);
    if (!this.noDuration) this.deleteNotif((this.duration + .2) * 1e3 + this.spawnDuration + this.unspawnDuration);
  }

  deleteNotif(delay: number = 0, clear: boolean = !1, ev?: Event) {
    ev?.stopPropagation();

    this.delete.emit({ delay, clear });
  }
}