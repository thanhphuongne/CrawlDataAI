import {
  Directive,
  ElementRef,
  input,
  Input,
  OnChanges,
  OnInit,
  Renderer2,
} from '@angular/core';
import { isTypeAliasDeclaration } from 'typescript';

@Directive({
  selector: '[app-card]',
})
export class AppCardDirective implements OnChanges, OnInit {
  type = input<'out-line' | 'boxed' | undefined>('boxed', {
    alias: 'app-card',
  });
  customSpace = input<string | undefined>('px-6 py-5 br-5', {
    alias: 'customSpace',
  });
  constructor(
    private element: ElementRef,
    private render: Renderer2,
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
      this.type() === 'boxed'
        ? [
            'app-card',
            'border-solid',
            'border-white-1',
            'card-' + this.type(),
            ...this.customSpace().split(' '),
          ]
        : [
            'app-card',
            'card-' + this.type(),
            'border-solid',
            'border-white-1',
            'br-2',
            'pd-x-3',
            'pd-y-s',
            'pd-lg-x-4',
            'pd-lg-y-3',
          ];
    listClass.forEach((item: string) => {
      this.render.addClass(this.element.nativeElement, `${item}`);
    });
  }
}
