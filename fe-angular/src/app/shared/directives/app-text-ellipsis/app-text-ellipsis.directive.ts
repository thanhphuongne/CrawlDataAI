import {
  Directive,
  ElementRef,
  input,
  OnChanges,
  OnInit,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: '[app-text-ellipsis]',
})
export class AppTextEllipsisDirective implements OnChanges, OnInit {
  lineNum = input<number>(1, { alias: 'line' });
  constructor(
    private readonly element: ElementRef,
    private readonly render: Renderer2,
  ) {}
  ngOnInit() {
    this.generateClass();
  }
  ngOnChanges() {
    this.generateClass();
  }

  /**
   * Generate list class css.
   */
  private generateClass() {
    const listClass: Array<string> =
      this.lineNum() === 1
        ? [
            'app-text-ellipsis',
            'inline-block',
            'text-ellipsis',
            'wp-nowrap',
            'max-w-p-12',
          ]
        : ['text-ellipsis-multi-line'];
    listClass.push('overflow-hidden');

    listClass.forEach((item: string) => {
      this.render.addClass(this.element.nativeElement, `${item}`);
    });
    if (this.lineNum() > 1) {
      this.element.nativeElement.style['-webkit-line-clamp'] = this.lineNum;
    }
  }
}
