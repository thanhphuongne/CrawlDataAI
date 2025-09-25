import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  Renderer2,
} from '@angular/core';

@Directive({ selector: '[chartWrapper]' })
export class AppChartWrapperDirective implements AfterViewInit {
  resize = new EventEmitter();
  resizing: any;
  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
  ) {}

  ngAfterViewInit() {
    this.restructureLayout();
  }

  /**
   * Update layout for support scroll x
   * @param isUpdate boolean, allow update layout or not
   */
  restructureLayout(isUpdate: boolean = false) {
    const target = this.el.nativeElement;
    const wrapper = this.renderer.createElement('div');
    target.classList.add('resizing');
    if (!isUpdate) target.classList.add('app-chart-layout');
    wrapper.classList.add('wrap-chart-display');
    target.style.setProperty('--offset', '0px');
    this.renderer.listen(wrapper, 'scroll', (ev: any) => {
      target.style.setProperty('--offset', '-' + ev.target.scrollLeft + 'px');
    });
    setTimeout(() => {
      const wrapperChart = target.querySelector('.apexcharts-canvas');
      const svg = target.querySelector('svg');
      const legend = target.querySelector('.apexcharts-legend');
      if (svg) {
        if (+svg.getAttribute('width') > target.offsetWidth) {
          if (legend?.firstChild) {
            this.renderer.removeChild(
              svg,
              svg.querySelector('.apexcharts-legend'),
            );
            this.renderer.insertBefore(wrapperChart, legend, svg);
          }

          this.renderer.insertBefore(wrapperChart, wrapper, svg);
          this.renderer.appendChild(wrapper, svg);
        }
      }
      target.classList.remove('resizing');
    }, 0);
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    const target = this.el.nativeElement;
    target.classList.add('resizing');
    clearTimeout(this.resizing);
    this.resizing = setTimeout(() => this.restructureLayout(true), 150);
  }
}
