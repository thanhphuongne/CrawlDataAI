import {
  Directive,
  ElementRef,
  EventEmitter,
  input,
  Input,
  OnChanges,
  OnInit,
  Output,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: '[app-tag]',
})
export class AppTagDirective implements OnChanges, OnInit {
  tag = input<'info' | 'general' | 'success' | 'danger' | 'late' | 'warning'>(
    'info',
    { alias: 'app-tag' },
  );
  size = input<'md' | 'lg'>('md', { alias: 'size' });
  type = input<'filled' | 'outline' | 'soft'>('filled', { alias: 'type' });
  allowRemove = input<boolean>(false, { alias: 'allow-remove' });
  @Output('onRemove') onRemove = new EventEmitter<any>();
  icon = `<svg width="10" height="10" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M15 15L5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M15 5L5 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
  `;
  constructor(
    private element: ElementRef,
    private renderer: Renderer2,
  ) {}
  ngOnInit() {
    this.generateClass();
    if (this.allowRemove()) {
      this.createButton();
    }
  }
  ngOnChanges() {
    this.generateClass();
  }

  /**
   * Generate list class css.
   */
  private generateClass() {
    const sizeClass = this.size() === 'md' ? 'font-sm' : 'font-md';
    const listClass =
      'app-tag br-5 gap-1 inline-flex align-items-center border-solid border-1 py-1 px-3 font-medium tag-' +
      this.tag() +
      ' type-' +
      this.type() +
      ' ' +
      sizeClass;
    listClass.split(' ').forEach((item: string) => {
      this.renderer.addClass(this.element.nativeElement, `${item}`);
    });
  }

  /**
   * Create button
   * @returns button object
   */
  private createButton() {
    const button = this.renderer.createElement('span');
    button.innerHTML = this.icon;
    button.classList.add(
      'flex',
      'align-items-center',
      'justify-center',
      'clear-tag',
    );
    button.style.width = '14px';
    button.style.height = '14px';
    this.renderer.listen(button, 'click', (ev) => {
      this.onRemove.emit(ev);
    });
    const element = this.element.nativeElement;
    this.renderer.appendChild(element, button);
  }
}
