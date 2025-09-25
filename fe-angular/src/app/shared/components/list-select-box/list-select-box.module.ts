import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppInputExtendFeaturesDirectiveModule } from '@app/shared/directives/app-input-extend-features/app-input-extend-features.module';
import { AppLoaderDirectiveModule } from '@app/shared/directives/app-loader/app-loader.directive.module';
import { AppClickOutSideDirectiveModule } from '@app/shared/directives/click-outside/click-outside.directive.module';
import { ListSelectBoxComponent } from './list-select-box.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AppClickOutSideDirectiveModule,
    AppLoaderDirectiveModule,
    AppInputExtendFeaturesDirectiveModule,
    TranslateModule,
  ],
  declarations: [ListSelectBoxComponent],
  exports: [ListSelectBoxComponent],
})
export class ListSelectBoxModule {}
