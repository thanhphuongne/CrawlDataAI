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
  selector: '[app-switch]',
})
export class AppSwitchDirective implements OnChanges, OnInit {
  type = input<
    'primary' | 'secondary' | 'tertiary' | 'success' | 'danger' | 'warning'
  >('primary', { alias: 'app-switch' });

  enabledLabel = input<string>('', { alias: 'enabled-label' });
  disabledLabel = input<string>('', { alias: 'disabled-label' });
  wrapClass = input<string>('', { alias: 'wrapClass' });
  isLoading = input<boolean>(false, { alias: 'isLoading' });
  constructor(
    private element: ElementRef,
    private renderer: Renderer2,
  ) {}
  ngOnInit() {
    this.renderElement();
  }
  ngOnChanges() {
    const element = this.element.nativeElement;
    const parent = element.parentNode;
    if (parent.classList.contains('app-switch')) {
      parent.setAttribute(
        'class',
        `app-switch ${this.type()}  ${this.wrapClass() || ''}`,
      );
      if (parent.getElementsByClassName('active-label')[0]) {
        parent.getElementsByClassName('active-label')[0].textContent =
          this.enabledLabel() || '';
      }
      if (parent.getElementsByClassName('deactive-label')[0]) {
        parent.getElementsByClassName('deactive-label')[0].textContent =
          this.disabledLabel() || '';
      }
      if (this.isLoading()) {
        const loadingElement = this.renderer.createElement('span');
        this.renderer.addClass(loadingElement, 'app-loading');
        this.renderer.addClass(loadingElement, 'md');
        for (let i = 0; i < 3; i++) {
          const ispan: Element = this.renderer.createElement('i');
          this.renderer.appendChild(loadingElement, ispan);
        }
        this.renderer.appendChild(parent, loadingElement);
      } else {
        Array.from(parent.children).forEach((child) => {
          if (child['classList']?.contains('app-loading')) {
            this.renderer.removeChild(parent, child);
          }
        });
      }
    }
  }

  renderElement() {
    const wrapper = this.renderer.createElement('div');
    const element = this.element.nativeElement;
    wrapper.classList.add('app-switch');
    wrapper.classList.add(this.type());
    if (this.wrapClass()) {
      this.wrapClass()
        .split(' ')
        .forEach((item) => {
          wrapper.classList.add(item);
        });
    }
    const parent = element.parentNode; // back to parent node
    this.renderer.insertBefore(parent, wrapper, element); // add wrapper to inside parent node
    this.renderer.appendChild(wrapper, element); // Move element to inside wrapper
    if (this.isLoading()) {
      const loadingElement = this.renderer.createElement('span');
      this.renderer.addClass(loadingElement, 'app-loading');
      this.renderer.addClass(loadingElement, 'md');
      for (let i = 0; i < 3; i++) {
        const ispan: Element = this.renderer.createElement('i');
        this.renderer.appendChild(loadingElement, ispan);
      }
      this.renderer.appendChild(wrapper, loadingElement);
    }
    if (this.enabledLabel()) {
      const enableElement = this.renderer.createElement('span');
      enableElement.classList.add('switch-label');
      enableElement.classList.add('active-label');
      enableElement.classList.add('pl-1');
      this.renderer.setProperty(
        enableElement,
        'innerHTML',
        this.enabledLabel(),
      );
      this.renderer.appendChild(wrapper, enableElement);
    }
    if (this.disabledLabel()) {
      const disableElement = this.renderer.createElement('span');
      disableElement.classList.add('switch-label');
      disableElement.classList.add('deactive-label');
      disableElement.classList.add('pl-1');
      this.renderer.setProperty(
        disableElement,
        'innerHTML',
        this.disabledLabel(),
      );
      this.renderer.appendChild(wrapper, disableElement);
    }
  }
}
