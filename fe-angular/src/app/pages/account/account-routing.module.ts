import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthenticationGuard } from '@app/core';
import { LayoutComponent } from '@app/layout/layout.component';
import { ValidateAccountSettingGuard } from '@app/core/guards/validateAccountSetting.guard';
import { RoutePath } from '@app/configs/models/route.enum';

const routes: Routes = [
  {
    path:'',
    component: LoginComponent,
  },
  // {
  //   path: '',
  //   component: LayoutComponent,
  //   canActivate: [AuthenticationGuard],
  //   children: [
  //     {
  //       path: '',
  //       component: AccountSettingsComponent,
  //       canActivate: [ValidateAccountSettingGuard],
  //     },
  //   ],
  // },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountRoutingModule {}
