import {
  AfterViewInit,
  Directive,
  ElementRef,
  EventEmitter,
  HostListener,
  input,
  Input,
  OnInit,
  Output,
} from '@angular/core';

@Directive({
  selector: '[app-sticky]',
})
export class AppStickyDirective implements OnInit, AfterViewInit {
  zIndex = input(10, { alias: 'sticky-zIndex' });
  width = input('auto', { alias: 'sticky-width' });
  offsetTop = input(0, { alias: 'sticky-offset-top' });
  offsetBottom = input(0, { alias: 'sticky-offset-bottom' });
  start = input(0, { alias: 'sticky-start' });
  stickClass = input('sticky', { alias: 'sticky-class' });
  endStickClass = input('sticky-end', { alias: 'sticky-end-class' });
  mediaQuery = input('', { alias: 'sticky-media-query' });
  parentMode = input(true, { alias: 'sticky-parent' });
  orientation = input('none', { alias: 'sticky-orientation' });

  @Output() activated = new EventEmitter();
  @Output() deactivated = new EventEmitter();
  @Output() reset = new EventEmitter();

  isStuck = false;

  private elem: any;
  private container: any;
  private originalCss: any;

  private containerHeight!: number;
  private elemHeight!: number;
  private containerStart!: number;
  private scrollFinish!: number;

  constructor(private element: ElementRef) {}

  ngOnInit(): void {
    this.elem = this.element.nativeElement;
  }

  ngAfterViewInit(): void {
    // define scroll container as parent element
    this.container = this.elem.parentNode;
    this.defineOriginalDimensions();
    this.sticker();
  }

  @HostListener('window:scroll', ['$event'])
  @HostListener('window:resize', ['$event'])
  @HostListener('window:orientationchange', ['$event'])
  onChange(): void {
    this.sticker();
  }

  defineOriginalDimensions(): void {
    this.originalCss = {
      zIndex: this.getCssValue(this.elem, 'zIndex'),
      position: this.getCssValue(this.elem, 'position'),
      top: this.getCssValue(this.elem, 'top'),
      right: this.getCssValue(this.elem, 'right'),
      left: this.getCssValue(this.elem, 'left'),
      bottom: this.getCssValue(this.elem, 'bottom'),
      width: this.getCssValue(this.elem, 'width'),
    };

    if (this.width() === 'auto') {
      this.width = this.originalCss.width;
    }
  }

  defineDimensions(): void {
    const containerTop: number = this.getBoundingClientRectValue(
      this.container,
      'top',
    );
    this.elemHeight = this.getCssNumber(this.elem, 'height');
    this.containerHeight = this.getCssNumber(this.container, 'height');
    this.containerStart =
      containerTop + this.scrollbarYPos() - this.offsetTop() + this.start();
    if (this.parentMode()) {
      this.scrollFinish =
        this.containerStart -
        this.start() -
        this.offsetBottom() +
        (this.containerHeight - this.elemHeight);
    } else {
      this.scrollFinish = document.body.offsetHeight;
    }
  }

  resetElement(): void {
    this.elem.classList.remove(this.stickClass());
    Object.assign(this.elem.style, this.originalCss);
    this.reset.next(this.elem);
  }

  stuckElement(): void {
    this.isStuck = true;

    this.elem.classList.remove(this.endStickClass());
    this.elem.classList.add(this.stickClass());

    Object.assign(this.elem.style, {
      zIndex: this.zIndex(),
      position: 'fixed',
      top: this.offsetTop() + 'px',
      right: 'auto',
      bottom: 'auto',
      left: this.getBoundingClientRectValue(this.elem, 'left') + 'px',
      width: this.width(),
    });

    this.activated.next(this.elem);
  }

  unstuckElement(): void {
    this.isStuck = false;
    this.elem.classList.add(this.endStickClass());
    this.container.style.position = 'relative';

    Object.assign(this.elem.style, {
      position: 'absolute',
      top: 'auto',
      left: 'auto',
      right:
        this.getCssValue(this.elem, 'float') === 'right' ||
        this.orientation() === 'right'
          ? 0
          : 'auto',
      bottom: this.offsetBottom() + 'px',
      width: this.width(),
    });

    this.deactivated.next(this.elem);
  }

  matchMediaQuery(): any {
    if (!this.mediaQuery()) return true;
    return (
      window.matchMedia('(' + this.mediaQuery() + ')').matches ||
      window.matchMedia(this.mediaQuery()).matches
    );
  }

  sticker(): void {
    // check media query
    if (this.isStuck && !this.matchMediaQuery()) {
      this.resetElement();
      return;
    }

    // detecting when a container's height changes
    const currentContainerHeight: number = this.getCssNumber(
      this.container,
      'height',
    );
    if (currentContainerHeight !== this.containerHeight) {
      this.defineDimensions();
    }

    // check if the sticky element is above the container
    if (this.elemHeight >= currentContainerHeight) {
      return;
    }

    const position: number = this.scrollbarYPos();

    // unstick
    if (
      (this.isStuck &&
        (position < this.containerStart || position > this.scrollFinish)) ||
      position > this.scrollFinish
    ) {
      this.resetElement();
      if (position > this.scrollFinish) this.unstuckElement();
      this.isStuck = false;
    }
    // stick
    else if (position > this.containerStart && position < this.scrollFinish) {
      this.stuckElement();
    }
  }

  private scrollbarYPos(): number {
    return window.scrollY || document.documentElement.scrollTop;
  }

  private getBoundingClientRectValue(element: any, property: string): number {
    let result = 0;
    if (element?.getBoundingClientRect) {
      const rect = element.getBoundingClientRect();
      result = typeof rect[property] !== 'undefined' ? rect[property] : 0;
    }
    return result;
  }

  private getCssValue(element: any, property: string): any {
    let result: any = '';
    if (typeof window.getComputedStyle !== 'undefined') {
      result = window.getComputedStyle(element, '').getPropertyValue(property);
    } else if (typeof element.currentStyle !== 'undefined') {
      result = element.currentStyle[property];
    }
    return result;
  }

  private getCssNumber(element: any, property: string): number {
    if (typeof element === 'undefined') return 0;
    return parseInt(this.getCssValue(element, property), 10) || 0;
  }
}
