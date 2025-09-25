import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppCheckBoxComponent } from './check-box.component';
import { AppIconDirectiveModule } from '@app/shared/directives/app-icon/app-icon.directive.module';

@NgModule({
  imports: [CommonModule, FormsModule, AppIconDirectiveModule],
  declarations: [AppCheckBoxComponent],
  exports: [AppCheckBoxComponent]
})
export class CheckBoxModule {}
