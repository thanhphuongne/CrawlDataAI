import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ExtrapagesRoutingModule } from './extrapages-routing.module';

import { Page403Component } from './page403/page403.component';
import { Page404Component } from './page404/page404.component';
import { Page500Component } from './page500/page500.component';
import { AppButtonDirectiveModule } from '@app/shared/directives/app-button/app-button.directive.module';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@NgModule({
  declarations: [Page403Component, Page404Component, Page500Component],
  imports: [
    CommonModule,
    ExtrapagesRoutingModule,
    AppButtonDirectiveModule,
    TranslateModule
  ],
  providers: [TranslateService]
})
export class ExtrapagesModule {}
