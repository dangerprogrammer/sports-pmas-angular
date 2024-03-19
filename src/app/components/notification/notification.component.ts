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
  @Input() duration: number = 1e3;
  @Output() delete = new EventEmitter<any>();
  @Input() actionClick?: any;
  @Input() text?: string;

  spawn: boolean = !1;
  hide: boolean = !1;
  deleteTimeout: any;

  spawnDuration: number = 300;
  unspawnDuration: number = this.spawnDuration * 1.6;

  ngOnInit(): void {
    this.spawn = !0;
    if (!this.text) this.text = `Notificação ${this.index}`;

    setTimeout(() => this.hide = !0, (this.duration + .2) * 1e3 + this.spawnDuration);
    this.deleteTimeout = this.deleteNotif({
      timeout: (this.duration + .2) * 1e3 + this.spawnDuration + this.unspawnDuration,
      index: this.index
    });
  }

  deleteNotif({ timeout, index, message }: any = { timeout: 0, index: this.index }) {
    this.delete.emit({ timeout, index, message });
  }
}