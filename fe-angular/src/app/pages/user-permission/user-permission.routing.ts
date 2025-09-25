import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationGuard } from '@app/core';
import { UsersComponent } from './users/users.component';

const routes: Routes = [
  {
    path: '',
    component: UsersComponent,
    // canActivate: [AuthenticationGuard]
  },
  // {
  //   path: "",
  //   component: UsersComponent,
  //   canActivate: [AuthenticationGuard]
  // },
  // {
  //   path: "",
  //   component: RolesComponent,
  //   canActivate: [AuthenticationGuard]
  // },
  // {
  //   path: "",
  //   component: RoleDetailComponent,
  //   canActivate: [AuthenticationGuard]
  // },
  // {
  //   path: "",
  //   component: UserRoleDataComponent,
  //   canActivate: [AuthenticationGuard]
  // },
  // {
  //   path: "",
  //   component: UserRoleDetailComponent,
  //   canActivate: [AuthenticationGuard]
  // },
  // {
  //   path: ':type',
  //   canActivate: [AuthenticationGuard],
  //   component: EmployeesComponent
  // }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersPermissionRoutingModule {}
