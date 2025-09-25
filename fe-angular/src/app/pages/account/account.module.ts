import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppFormLabelComponent } from '@app/shared/components/form-label/form-label.component';
import { AppIconComponent } from '@app/shared/components/icon/icon.component';
import { AppValidatorMessageComponent } from '@app/shared/components/validator-message/validator-message.component';
import { AppButtonDirectiveModule } from '@app/shared/directives/app-button/app-button.directive.module';
import { AppCardDirectiveModule } from '@app/shared/directives/app-card/app-card.directive.module';
import { AppIconDirectiveModule } from '@app/shared/directives/app-icon/app-icon.directive.module';
import { AppInputExtendFeaturesDirectiveModule } from '@app/shared/directives/app-input-extend-features/app-input-extend-features.module';
import { AppLoaderDirectiveModule } from '@app/shared/directives/app-loader/app-loader.directive.module';
import { AppTextEllipsisDirectiveModule } from '@app/shared/directives/app-text-ellipsis/app-text-ellipsis.directive.module';
import {
  NgbDatepickerModule,
  NgbModalModule,
  NgbNavModule,
  NgbTooltipModule
} from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { AccountRoutingModule } from './account-routing.module';
import { LoginComponent } from './login/login.component';

@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AccountRoutingModule,
    AppButtonDirectiveModule,
    AppInputExtendFeaturesDirectiveModule,
    AppValidatorMessageComponent,
    AppCardDirectiveModule,
    AppTextEllipsisDirectiveModule,
    AppLoaderDirectiveModule,
    AppIconComponent,
    AppIconDirectiveModule,
    AppFormLabelComponent,
    NgbModalModule,
    NgbNavModule,
    NgxDropzoneModule,
    NgbDatepickerModule,
    NgbTooltipModule,
    TranslateModule,
    FormsModule
  ]
})
export class AccountModule {}
