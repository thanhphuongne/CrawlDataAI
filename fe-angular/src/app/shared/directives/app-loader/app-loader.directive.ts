import {
  Directive,
  ElementRef,
  input,
  Input,
  OnChanges,
  Renderer2,
} from '@angular/core';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[app-loader]',
})
export class AppLoaderDirective implements OnChanges {
  isLoading = input<boolean>(false, { alias: 'app-loader' });
  size = input<'xl' | 'lg' | 'md' | 'sm'>('md', { alias: 'loader-size' });
  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
  ) {}

  ngOnChanges() {
    if (this.isLoading()) {
      const div = this.renderer.createElement('div');
      this.renderer.addClass(div, 'app-loading');
      this.renderer.addClass(div, this.size());
      for (let i = 0; i < 3; i++) {
        const ispan: Element = this.renderer.createElement('i');
        this.renderer.appendChild(div, ispan);
      }
      this.renderer.insertBefore(
        this.el.nativeElement,
        div,
        this.el.nativeElement.firstChild,
      );
    } else {
      Array.from(this.el.nativeElement.children).forEach((child) => {
        if (child['classList'] && child['classList'].contains('app-loading')) {
          this.renderer.removeChild(this.el.nativeElement, child);
        }
      });
    }
  }
}
