import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SITE_ROUTE} from '@app/configs/site-route.contants';
import { ERRORS_CONSTANT } from '@app/shared/constants/error.constants';
import { SvgIcon } from '@app/shared/constants/svg-icon.constant';
import { CommonUtils } from '@app/shared/utils/comon.utils';
import { confirmDailog } from '@app/shared/utils/confirm-dailog.ultils';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { UserRolesService } from '../services/roles.services';
import { UsersService } from '../services/users.services';
import { UserInfoModel } from '@app/open-api/common/models/user-info-model';
import { RoleInfoModel } from '@app/open-api/common/models/role-info-model';
@Component({
  selector: 'app-user-role-data',
  templateUrl: './user-role-data.component.html',
  styleUrls: ['./user-role-data.component.scss']
})
export class UserRoleDataComponent implements OnInit {
  userId: number;
  userInfo: UserInfoModel;
  displayName: string;
  listUserUrl = "";
  listUserParam = {};
  pageTitle = "";
  icons = SvgIcon;
  listErrors = ERRORS_CONSTANT;
  customerId: number;

  isLoading = false;
  listRoleData: Array<RoleInfoModel>;

  isDeleting: Array<number> = [];
  constructor(
    private translate: TranslateService,
    private userService: UsersService,
    private rolesService: UserRolesService,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: any) => {
      if (params.id) {
        this.userId = +params.id;
        this.getUserInfo(+params.id);
      }
    });
  }

  /**
   * Get info of user by id
   * @param id number user id
   */
  getUserInfo(id: number) {
    this.isLoading = true;
    this.userService.getUserById(id).subscribe((result: any) => {
      const res = JSON.parse(result);
      if (res.success) {
        this.userInfo = res.data;
        this.displayName = this.userInfo.fullName.trim()
          ? this.userInfo.fullName
          : this.userInfo.userName;
        this.customerId = this.userInfo.customerId;
        this.listUserParam = { customerId: this.customerId };
        this.getRoleDataOfUser(id);
      } else {
        this.isLoading = false;
      }
    });
  }

  /**
   * Get list role of current user.
   * @param userId number, id of current user.
   */
  getRoleDataOfUser(userId: number) {
    this.isLoading = true;
    this.rolesService.getListRoleOfUserById(userId).subscribe((result: any) => {
      const res = JSON.parse(result);
      if (res.success) {
        this.listRoleData = res.data || [];
      } else {
        this.listRoleData = [];
      }
      this.isLoading = false;
    });
  }

  handleNavigateUserRoleDetail(dataRole: any) {
    const url = "";
    this.router.navigate([url], {
      queryParams: { customerId: this.customerId }
    });
  }

  /**
   * Confirm delete before delete role data
   * @param role Current role data
   */
  deleteRoleData(role: RoleInfoModel) {
    confirmDailog(
      {
        cancelButtonText: this.translate.instant('Cancel'),
        confirmButtonText: this.translate.instant('Delete'),
        html: this.translate.instant(
          "All data of this role will remove. User can't access to this data after that."
        )
      },
      'danger',
      () => {
        this.isDeleting.push(role.roleId);
        this.rolesService
          .deleteRoleDataOfUser(this.userInfo.id, role.roleId)
          .subscribe({
            next: (result: any) => {
              const res = JSON.parse(result);
              if (res.success) {
                this.toastr.success(
                  this.translate.instant('Role data deleted successfully!')
                );
                this.getRoleDataOfUser(this.userInfo.id);
              } else {
                const err = CommonUtils.getErrorMessage(
                  this.listErrors.ROLE_DATA,
                  res.message,
                  'Unable delete this role data, please try again!'
                );
                this.toastr.error(this.translate.instant(err));
              }
              this.isDeleting = this.isDeleting.filter(
                item => role.roleId !== item
              );
            },
            error: () => {
              this.isDeleting = this.isDeleting.filter(
                item => role.roleId !== item
              );
              this.toastr.error(
                this.translate.instant(this.listErrors.GENERAL.UNEXPECTED_ERROR)
              );
            }
          });
      }
    );
  }
}
