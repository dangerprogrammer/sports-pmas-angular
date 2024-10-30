import { AfterViewInit, Component, ComponentRef, EventEmitter, Input, Output, ViewChild, ViewContainerRef } from '@angular/core';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.scss'
})
export class AlertComponent implements AfterViewInit {
  @Input() index: number = 0;
  @Input() deleting: boolean = !1;

  @Input() title: string = `Alert ${this.index}`;
  @Input() renderComponent!: (content: ViewContainerRef) => ComponentRef<any>;

  @Output() delete = new EventEmitter();
  
  @ViewChild('content', { read: ViewContainerRef }) content!: ViewContainerRef;

  deleteAlert() {
    this.delete.emit();
  }

  ngAfterViewInit(): void {
    this.renderComponent(this.content);
  }
}
