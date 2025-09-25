import {
  Directive,
  ElementRef,
  EventEmitter,
  input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
  SimpleChanges,
  ViewContainerRef,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { InputExtendHtmlConstant } from './app-input-extend-features.directive.constant';
import { AppIconComponent } from '@app/shared/components/icon/icon.component';

@Directive({
  selector: '[appInputExtendFeatures]',
})
export class AppInputExtendFeaturesDirective
  implements OnInit, OnDestroy, OnChanges
{
  ngModel = input<string>('', { alias: 'ngModel' });
  @Output() ngModelChange = new EventEmitter<string>();

  inputControl = input(null, { alias: 'inputControl' });
  icon = input(null, { alias: 'icon' });
  iconSize = input(null, { alias: 'icon-size' });
  iconClass = input(null, { alias: 'icon-class' });
  showPass = input<any>(null, { alias: 'showPassword' });
  clearInput = input<any>(null, { alias: 'clearInput' });
  wrapClass = input<string>(null, { alias: 'wrapClass' });

  private wrapToggleButtons: any;
  private textChangeSubs: Subscription;
  private isShowPw: boolean;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    public vcRef: ViewContainerRef,
  ) {}

  ngOnInit() {
    const wrapper = this.renderer.createElement('div');
    const element = this.el.nativeElement;
    element.classList.add('w-full');
    wrapper.classList.add('app-input');
    wrapper.classList.add('relative');
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

    // Create wrap list buttons
    this.wrapToggleButtons = this.renderer.createElement('div');
    const wrapButtons = this.wrapToggleButtons;
    wrapButtons.classList.add(
      'flex',
      'align-items-center',
      'justify-center',
      'gap-2',
      'absolute',
    );
    wrapButtons.style.right = '12px';
    wrapButtons.style.top = '50%';
    wrapButtons.style.height = '24px';
    wrapButtons.style.transform = 'translateY(-50%)';
    this.renderer.appendChild(element.parentNode, wrapButtons);

    // Check icon and create icon by ViewContainerRef
    if (this.icon()) {
      this.vcRef.clear();
      const iconElement = this.vcRef.createComponent(AppIconComponent);

      iconElement.instance.icon.set(this.icon());
      iconElement.instance.size.set(this.iconSize());
      iconElement.instance.customClass.set(this.iconClass());
      this.renderer.appendChild(wrapper, iconElement.location.nativeElement);
      wrapper.classList.add('has-icon');
    }
    // Create button
    if (this.showPass()) {
      const showPassButton = this.createButton(
        InputExtendHtmlConstant.hidePass,
        (button) => {
          this.isShowPw = !this.isShowPw;
          this.renderer.setProperty(
            button,
            'innerHTML',
            this.isShowPw
              ? InputExtendHtmlConstant.showPass
              : InputExtendHtmlConstant.hidePass,
          );
          if (element.hasAttribute('type')) {
            this.renderer.setAttribute(
              element,
              'type',
              this.isShowPw ? 'text' : 'password',
            );
          }
        },
      );
      this.renderer.appendChild(wrapButtons, showPassButton);
    }
    if (this.clearInput()) {
      const clearInput = this.createButton(
        InputExtendHtmlConstant.clearField,
        (button) => {
          this.inputControl().reset();
        },
      );
      clearInput.classList.add('input-btn-clear-text');
      this.renderer.appendChild(wrapButtons, clearInput);
    }
    // show/hide list buttons
    this.textChangeSubs = this.inputControl()?.valueChanges.subscribe(() => {
      this.toggleShowButtons(wrapButtons);
    });

    this.toggleShowButtons(wrapButtons);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.ngModel && this.wrapToggleButtons) {
      this.toggleShowButtons(this.wrapToggleButtons);
    }
  }

  /**
   * Create button
   * @param innerHtml html inside button
   * @param clickEvent function excute when button click
   * @returns button object
   */
  createButton(innerHtml: any, clickEvent: any) {
    const button = this.renderer.createElement('div');
    button.innerHTML = innerHtml;
    button.classList.add('flex', 'align-items-center', 'justify-center');
    button.style.width = '24px';
    button.style.height = '24px';
    button.style.cursor = 'pointer';
    this.renderer.listen(button, 'click', (ev) => {
      clickEvent(button, ev);
    });
    return button;
  }

  /**
   * Show/hide list button
   * @param wrapButtons object wrap button
   */
  toggleShowButtons(wrapButtons: any) {
    const element = this.el.nativeElement;
    if ((this.inputControl()?.value || this.ngModel()) && !element.disabled) {
      this.renderer.setStyle(wrapButtons, 'display', 'inline-flex');
    } else {
      this.renderer.setStyle(wrapButtons, 'display', 'none');
    }
  }

  ngOnDestroy(): void {
    if (this.textChangeSubs) {
      this.textChangeSubs.unsubscribe();
    }
  }
}
