import { NgModule } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { AppIconDirective } from './app-icon.directive';

@NgModule({
  imports: [AngularSvgIconModule],
  declarations: [AppIconDirective],
  exports: [AppIconDirective]
})
export class AppIconDirectiveModule {}
