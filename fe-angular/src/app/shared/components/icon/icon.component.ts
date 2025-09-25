import { CommonModule } from '@angular/common';
import { Component, model } from '@angular/core';
import { AppIconDirectiveModule } from '@app/shared/directives/app-icon/app-icon.directive.module';

@Component({
  selector: 'app-icon',
  templateUrl: './icon.component.html',
  standalone: true,
  imports: [CommonModule, AppIconDirectiveModule],
})
export class AppIconComponent {
  icon = model('', { alias: 'icon' });
  size = model('20', { alias: 'size' });
  customClass = model('', {
    alias: 'customClass',
  });
  constructor() {
    this.customClass.set(this.customClass() + ' flex align-items-center');
  }
}
