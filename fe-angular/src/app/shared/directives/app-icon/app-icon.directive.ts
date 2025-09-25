import {
  ChangeDetectorRef,
  Directive,
  ElementRef,
  input,
  OnChanges,
  OnDestroy,
  OnInit,
  Renderer2,
  SimpleChanges,
} from '@angular/core';
import { SvgIconRegistryService } from 'angular-svg-icon';
import { Subscription } from 'rxjs';

class SvgIconHelper {
  svg!: any;
  icnSub!: Subscription;
  loaded = false;
}

@Directive({
  selector: '[app-icon]',
})
export class AppIconDirective implements OnInit, OnDestroy, OnChanges {
  name = input(null, { alias: 'app-icon' });
  iconSize = input('20', { alias: 'icon-size' });
  class = input<any>('', { alias: 'icon-class' });
  applyClass = input<boolean>(false, { alias: 'applyClass' });
  icnSub!: Subscription;
  private helper = new SvgIconHelper();
  
  constructor(
    private element: ElementRef,
    private renderer: Renderer2,
    private iconReg: SvgIconRegistryService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.init();
  }

  ngOnDestroy() {
    this.destroy();
  }

  ngOnChanges(changeRecord: SimpleChanges) {
    if (changeRecord['name']) {
      if (this.helper.loaded) {
        this.destroy();
      }
      this.init();
    }

    if (changeRecord.class) {
      const elem = this.element.nativeElement;
      this.setClass(
        elem,
        changeRecord.class.previousValue,
        changeRecord.class.currentValue,
      );
    }
  }

  private init() {
    if (this.name()) {
      const svgObs = this.iconReg.getSvgByName(this.name());
      if (svgObs) {
        this.helper.icnSub = svgObs.subscribe((svg) => this.initSvg(svg));
      }
    } else {
      const elem = this.element.nativeElement;
      elem.innerHTML = '';
      this.cdr.markForCheck();
    }
  }

  private initSvg(svg: SVGElement | undefined): void {
    if (!this.helper.loaded && svg) {
      this.setSvg(svg);
    }
  }

  private setSvg(svg: SVGElement) {
    if (!this.helper.loaded && svg) {
      const icon = svg.cloneNode(true) as any;
      this.helper.svg = icon;
      this.renderer.setAttribute(icon, 'width', this.iconSize());
      this.renderer.setAttribute(icon, 'height', this.iconSize());
      const elem = this.element.nativeElement;
      this.renderer.insertBefore(elem, icon, elem.firstChild);
      this.helper.loaded = true;

      if (this.class() || this.applyClass()) {
        if (this.class()) {
          this.setClass(icon, null, this.class());
        }
      } else if (icon.getAttribute('fill') !== 'none') {
        this.renderer.setAttribute(icon, 'fill', 'currentColor');
      }
      this.cdr.markForCheck();
    }
  }

  private destroy() {
    if (this.helper.icnSub) {
      this.helper.icnSub.unsubscribe();
    }
    if (this.helper.loaded) {
      this.renderer.removeChild(this.element.nativeElement, this.helper.svg);
    }
    this.helper = new SvgIconHelper();
  }

  private setClass(
    target: HTMLElement | SVGSVGElement,
    previous: string | string[] | null,
    current: string | string[] | null,
  ) {
    if (target) {
      if (previous) {
        const classes = (
          Array.isArray(previous) ? previous : previous.split(' ')
        ).filter((c) => c);
        for (const k of classes) {
          this.renderer.removeClass(target, k);
        }
      }
      if (current) {
        const classes = (
          Array.isArray(current) ? current : current.split(' ')
        ).filter((klass) => klass);
        for (const k of classes) {
          this.renderer.addClass(target, k);
        }
      }
    }
  }
}
