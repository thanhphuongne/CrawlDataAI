import {
  Directive,
  ElementRef,
  Input,
  OnInit,
  OnDestroy,
  Renderer2,
  input,
} from '@angular/core';
import { generateColorByStr } from '@app/shared/utils/color.utils';
import { getFirstNameInitials } from '@app/shared/utils/string.utils';

@Directive({
  selector: '[user-avatar]',
})
export class AppUserAvatarDirective implements OnInit, OnDestroy {
  userInfo = input<any>(null, { alias: 'user-avatar' });

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2,
  ) {}

  ngOnInit(): void {
    const nameIconDiv = this.renderer.createElement('div');
    const nameColor = generateColorByStr(this.userInfo().account);
    const givenNameChar = getFirstNameInitials(this.userInfo().account);
    this.renderer.setStyle(nameIconDiv, 'border', '1px solid ' + nameColor);
    this.renderer.setStyle(nameIconDiv, 'color', nameColor);
    const nameCharText = this.renderer.createText(givenNameChar);
    this.renderer.addClass(nameIconDiv, 'lbl-name-icon');
    this.renderer.appendChild(nameIconDiv, nameCharText);
    this.renderer.appendChild(this.elementRef.nativeElement, nameIconDiv);

    const nameStrDiv = this.renderer.createElement('div');
    this.renderer.addClass(nameStrDiv, 'lbl-user-info');
    const nameText = this.renderer.createText(this.userInfo().account);
    this.renderer.appendChild(nameStrDiv, nameText);
    this.renderer.appendChild(this.elementRef.nativeElement, nameStrDiv);
  }

  ngOnDestroy(): void {}
}
