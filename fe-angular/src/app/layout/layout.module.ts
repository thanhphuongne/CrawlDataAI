import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PermissionDirective } from '@app/core/directives/permission.directive';
import { AppIconComponent } from '@app/shared/components/icon/icon.component';
import { AppIconDirectiveModule } from '@app/shared/directives/app-icon/app-icon.directive.module';
import { AppClickOutSideDirectiveModule } from '@app/shared/directives/click-outside/click-outside.directive.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LayoutComponent } from './layout.component';
import { TopBarComponent } from './topbar/topbar.component';
import { AppButtonDirectiveModule } from '@app/shared/directives/app-button/app-button.directive.module';
import { AppNotifyDetailComponent } from '@app/shared/components/app-notification-content/app-notification-detail/app-notification-detail.component';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzImageModule } from 'ng-zorro-antd/image';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { PopupComponent } from '@app/shared/components/popup/popup.component';
import { NzButtonModule } from 'ng-zorro-antd/button';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    AppIconDirectiveModule,
    AppIconComponent,
    AppClickOutSideDirectiveModule,
    PopupComponent,
    PermissionDirective,
    AppNotifyDetailComponent,
    AppButtonDirectiveModule,
    NzLayoutModule,
    NzIconModule,
    NzMenuModule,
    NzListModule,
    NzImageModule,
    NzAvatarModule,
    AngularSvgIconModule,
    NzBadgeModule,
    NzSelectModule,
    NzDropDownModule,
    NzButtonModule
  ],
  declarations: [LayoutComponent, TopBarComponent],
  providers: [TranslateService],
})
export class LayoutModule {}
