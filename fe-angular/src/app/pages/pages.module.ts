import { AppLogTableComponent } from './../shared/components/app-log-table/app-log-table.component';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { PagesRoutingModule } from './pages.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NgSelectModule } from '@ng-select/ng-select';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { AppPaginationComponent } from '@app/shared/components/app-pagination/app-pagination.component';
import { AppDateTimePickerComponent } from '@app/shared/components/date-time-picker/date-time-picker.component';
import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { AppClickOutSideDirectiveModule } from '@app/shared/directives/click-outside/click-outside.directive.module';
import { NzImageModule } from 'ng-zorro-antd/image';
import { PopupComponent } from '@app/shared/components/popup/popup.component';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzSliderModule } from 'ng-zorro-antd/slider';
import { UserManagementComponent } from './user-management/user-management.component';
import { AppUserManagementTableComponent } from '@app/shared/components/app-user-management-table/app-user-management-table.component';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { PermissionDirective } from '@app/core/directives/permission.directive';
import { AppScoreTableComponent } from '@app/shared/components/app-score-table/app-score-table.component';
import { HomeComponent } from './home/home.component';
import { NzCardModule } from 'ng-zorro-antd/card';
import { ScoringComponent } from './scoring/scoring.component';
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';

const commonModule = [
  CommonModule,
  FormsModule,
  TranslateModule,
  PagesRoutingModule,
  ReactiveFormsModule,
  NzModalModule,
  NzDropDownModule,
  NzFormModule,
  NzInputModule,
  NzSelectModule,
  NzButtonModule,
  NzIconModule,
  NzCheckboxModule,
  NzMenuModule,
  NzToolTipModule,
  NzTagModule,
  NgSelectModule,
  NzPaginationModule,
  AppUserManagementTableComponent,
  AppPaginationComponent,
  AppDateTimePickerComponent,
  NzPaginationModule,
  NzSpaceModule,
  NzDatePickerModule,
  AppClickOutSideDirectiveModule,
  PermissionDirective,
  NgTemplateOutlet,
  NzImageModule,
  PopupComponent,
  ReactiveFormsModule.withConfig({ warnOnNgModelWithFormControl: 'never' }),
  NzInputNumberModule,
  NzSliderModule,
  NzTabsModule,
  NzAvatarModule,
  NzSpinModule,
  NzAlertModule,
  AppScoreTableComponent,
  NzCardModule,
  AppLogTableComponent,
  NzAutocompleteModule
];

@NgModule({
  declarations: [UserManagementComponent, HomeComponent, ScoringComponent],
  exports: [commonModule],
  imports: [commonModule],
})
export class PagesModule {}
