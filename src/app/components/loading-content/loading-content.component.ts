import { AfterViewInit, ChangeDetectorRef, Component, Input } from '@angular/core';
import { ColorTools } from '../../tools';

@Component({
  selector: 'loading-content',
  standalone: true,
  imports: [],
  templateUrl: './loading-content.component.html',
  styleUrl: './loading-content.component.scss'
})
export class LoadingContentComponent extends ColorTools implements AfterViewInit {
  constructor(
    private cdr: ChangeDetectorRef
  ) {
    super();
  }

  @Input() loaded: boolean = !1;
  @Input() loadingMsg: string = "Loading...";

  globalColor!: string;
  rgb1!: string;
  rgb2!: string;
  rgb3!: string;

  ngAfterViewInit(): void {
    const loader = document.querySelector('.loader-container');

    if (loader) {
      const { color } = getComputedStyle(loader),
        formattedColor = color.slice(4, color.length - 1).split(', '),
        rgbData = { r: +formattedColor[0], g: +formattedColor[1], b: +formattedColor[2] },
        lighten1 = this.lighten(rgbData, 60),
        rgb1 = `rgb(${lighten1.r}, ${lighten1.g}, ${lighten1.b})`,
        lighten2 = this.lighten(rgbData, 30),
        rgb2 = `rgb(${lighten2.r}, ${lighten2.g}, ${lighten2.b})`;

      this.rgb1 = rgb1;
      this.rgb2 = rgb2;
      this.rgb3 = color;
      this.cdr.detectChanges();
    };
  }
}
