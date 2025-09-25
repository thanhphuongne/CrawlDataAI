import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppFormLabelComponent } from '@app/shared/components/form-label/form-label.component';
import { AppIconComponent } from '@app/shared/components/icon/icon.component';
import { AppSkeletonComponent } from '@app/shared/components/skeleton/skeleton.component';
import { AppValidatorMessageComponent } from '@app/shared/components/validator-message/validator-message.component';
import { AppButtonDirectiveModule } from '@app/shared/directives/app-button/app-button.directive.module';
import { AppCardDirectiveModule } from '@app/shared/directives/app-card/app-card.directive.module';
import { AppIconDirectiveModule } from '@app/shared/directives/app-icon/app-icon.directive.module';
import { AppInputExtendFeaturesDirectiveModule } from '@app/shared/directives/app-input-extend-features/app-input-extend-features.module';
import { AppLoaderDirectiveModule } from '@app/shared/directives/app-loader/app-loader.directive.module';
import { AppSwitchDirectiveModule } from '@app/shared/directives/app-switch/app-switch.directive.module';
import { AppTagDirectiveModule } from '@app/shared/directives/app-tag/app-tag.directive.module';
import { AppTextEllipsisDirectiveModule } from '@app/shared/directives/app-text-ellipsis/app-text-ellipsis.directive.module';
import {
  NgbAccordionModule,
  NgbDatepickerModule,
  NgbTooltipModule
} from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { RoleDetailComponent } from './role-detail/role-detail.component';
import { RolesComponent } from './roles/roles.component';
import { UsersComponent } from './users/users.component';
import { UsersPermissionRoutingModule } from './user-permission.routing';
import { UserRoleDataComponent } from './user-role-data/user-role-data.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { PermissionDirective } from '@app/core/directives/permission.directive';
import { UserRoleDetailComponent } from './user-role-detail/user-role-detail.component';
import { AppTreeSelectComponent } from '@app/shared/components/app-tree-select/tree-select.component';
import { EmployeesComponent } from './employees/employees.component';
import { AppUserTypeSelectComponent } from '@app/shared/components/user-type-select/user-type-select.component';
import { AppDateTimePickerComponent } from '@app/shared/components/date-time-picker/date-time-picker.component';
import { AppPaginationComponent } from '@app/shared/components/app-pagination/app-pagination.component';
import { AppNoDataComponent } from '@app/shared/components/app-no-data/app-no-data.component';
import { LicenseDirective } from '@app/core/directives/license.directive';

@NgModule({
  declarations: [
    UsersComponent,
    RolesComponent,
    RoleDetailComponent,
    UserRoleDataComponent,
    UserRoleDetailComponent,
    EmployeesComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AppButtonDirectiveModule,
    AppInputExtendFeaturesDirectiveModule,
    AppValidatorMessageComponent,
    AppFormLabelComponent,
    FormsModule,
    TranslateModule,
    AppSkeletonComponent,
    AppSwitchDirectiveModule,
    AppIconDirectiveModule,
    AppIconComponent,
    AppCardDirectiveModule,
    AppTextEllipsisDirectiveModule,
    AppTagDirectiveModule,
    NgbTooltipModule,
    NgbDatepickerModule,
    NgbAccordionModule,
    NgSelectModule,
    AppLoaderDirectiveModule,
    AppValidatorMessageComponent,
    NgxDropzoneModule,
    UsersPermissionRoutingModule,
    PermissionDirective,
    LicenseDirective,
    AppTreeSelectComponent,
    AppUserTypeSelectComponent,
    AppDateTimePickerComponent,
    AppPaginationComponent,
    AppNoDataComponent
  ]
})
export class UsersPermissionModule {}
