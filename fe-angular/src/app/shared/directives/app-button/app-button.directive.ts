import {
  Directive,
  ElementRef,
  input,
  Input,
  OnChanges,
  OnInit,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: '[app-button]',
})
export class AppButtonDirective implements OnChanges, OnInit {
  type = input<'filled' | 'outline' | 'subtle' | 'text'>('filled', {
    alias: 'btn-type',
  });
  size = input<'xs' | 'sm' | 'md' | 'lg'>('md', { alias: 'btn-size' });
  squake = input<boolean>(false, { alias: 'btn-squake' });
  variant = input<
    'primary' | 'secondary' | 'tertiary' | 'success' | 'danger' | 'warning'
  >('primary', { alias: 'btn-variant' });

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
    const listClass: Array<string> = [
      'app-btn',
      'br-2',
      'inline-flex',
      'gap-2',
      'align-items-center',
      'justify-center',
    ];
    // For size
    if (this.type() !== 'text') {
      if (!this.squake()) {
        listClass.push('px-4');
      } else {
        listClass.push('px-1');
      }
      switch (this.size()) {
        case 'xs':
          listClass.push('py-1');
          if (this.squake()) {
            listClass.push('w-8');
            listClass.push('h-8');
          }
          listClass.push('font-sm');
          break;
        case 'sm':
          listClass.push('py-2');
          if (this.squake()) {
            listClass.push('w-9');
            listClass.push('h-9');
          }
          listClass.push('font-sm');
          break;
        case 'md':
          listClass.push('py-2');
          if (this.squake()) {
            listClass.push('w-10');
            listClass.push('h-10');
          }
          listClass.push('font-md');
          break;
        case 'lg':
          listClass.push('py-3');
          if (this.squake()) {
            listClass.push('w-12');
            listClass.push('h-12');
          }
          listClass.push('font-md');
          break;
      }
    } else {
      listClass.push('p-0');
    }
    listClass.push('font-bold');
    listClass.push('btn-' + this.type());
    listClass.push('btn-' + this.variant());
    listClass.forEach((item: string) => {
      this.render.addClass(this.element.nativeElement, `${item}`);
    });
  }
}
