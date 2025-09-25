import { Component, OnInit, signal } from '@angular/core';
import { CredentialsService } from '@app/core';
import { UserModel } from '@app/core/models/user.model';
import { ERRORS_CONSTANT } from '@app/shared/constants/error.constants';
import { SvgIcon } from '@app/shared/constants/svg-icon.constant';
import { CommonUtils } from '@app/shared/utils/comon.utils';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { UserTypeEnum } from '../models/user-type.enum';
import { GetListUserModel } from '../models/users.model';
import { UserRolesService } from '../services/roles.services';
import { UsersService } from '../services/users.services';
import { confirmDailog } from '@app/shared/utils/confirm-dailog.ultils';
import { checkPermissionRow } from '@app/shared/utils/permission.utils';
import { GROUP_PERMISSIONS_DATA } from '@app/configs/group-permissions-data.constants';
import { UserInfoModel } from '@app/open-api/common/models/user-info-model';
import { RoleInfoModel } from '@app/open-api/common/models/role-info-model';
import { PERMISSIONS_DATA } from '@app/configs/permissions-data.constants';
import { PaginationModel } from '@app/shared/components/app-pagination/model/app-pagination.model';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
  isLoading = signal<boolean>(false);
  listUsers = signal<UserInfoModel[]>([]);
  totalUsers = signal<number>(0);
  icons = SvgIcon;
  selectedCustomerId = signal<number>(0);
  listErrors = ERRORS_CONSTANT;
  getUserparams = signal<GetListUserModel>({
    CustomerId: 0,
    PageIndex: 1,
  });
  listOptionFilter = signal<any[]>([]);
  selectedUser = signal<UserInfoModel>(undefined);
  listInActions = signal<number[]>([]);
  changingCustomerAdmin = signal<number[]>([]);
  userType = UserTypeEnum;
  selectedRoles = signal<number[]>([]);
  listRole = signal<RoleInfoModel[]>([]);
  prevCustomerId = signal<number>(0);
  isAddingRole = signal<boolean>(false);
  userInfo = signal<UserModel>(undefined);
  groupPermision = GROUP_PERMISSIONS_DATA;
  permissionList = PERMISSIONS_DATA.user;
  colSpan = 8;
  
  constructor(
    private readonly modalService: NgbModal,
    private readonly toastr: ToastrService,
    private readonly translate: TranslateService,
    private readonly userService: UsersService,
    private readonly credentialService: CredentialsService,
    private readonly roleService: UserRolesService,
  ) {}

  ngOnInit(): void {
    this.userInfo.set(this.credentialService.getUserInfoFromToken());
    this.selectedCustomerId.set(+this.userInfo().customerId);

    this.listOptionFilter.set([
      {
        type: 'keyword',
        name: 'keyword',
        placeholder: 'Enter user name',
      },
    ]);
  }

  /**
   * Execute search user
   */
  onSearch(value: any) {
    this.selectedCustomerId.set(value.customerId);
    if (value?.pageSize) this.getUserparams().PageSize = value.pageSize;
    this.getUserparams.set({
      ...this.getUserparams,
      CustomerId: value.customerId || 0,
      Keyword: value.keyword || null,
      PageIndex: +value.page || 1,
    });
    this.getListUser();
  }

  /**
   * Get list user
   * @param params getListUserModel
   */
  getListUser(params: GetListUserModel = this.getUserparams()) {
    if (!params.CustomerId || params.CustomerId === 0) {
      return;
    }
    this.isLoading.set(true);
    this.userService
      .getAllUser({ ...params, UserType: this.userType.User })
      .subscribe({
        next: (result: any) => {
          this.isLoading.set(false);
          const res = JSON.parse(result);
          if (res) {
            this.listUsers.set(res.data || []);
            this.totalUsers.set(res?.metaData?.totalItems || 0);
            this.getUserparams().PageIndex = res?.metaData?.currentPage || 1;
          }
        },
        error: () => {
          this.isLoading.set(false);
          this.listUsers.set([]);
          this.totalUsers.set(0);
        },
      });
  }
  /**
   * Enable/disable user as customer admin.
   * @param element current element
   * @param user current model of user
   */
  changeCustomerAdmin(element: any, user: UserInfoModel) {
    this.changingCustomerAdmin.update((items) => {
      items.push(user.id);
      return [...items];
    });
    const isCustomerAdmin = element.checked;
    this.userService
      .changeUserAsCustomerAdmin(user.id, isCustomerAdmin)
      .subscribe({
        next: (res: any) => {
          const result = JSON.parse(res);
          if (result.success) {
            this.toastr.success(
              this.translate.instant(
                'Customer admin status changed successfully!',
              ),
            );
            element.checked = isCustomerAdmin;
            this.listUsers.set([
              ...this.listUsers().map((item: UserInfoModel) => {
                if (item.id === user.id) {
                  item.userType = isCustomerAdmin
                    ? UserTypeEnum.CustomerAdmin
                    : UserTypeEnum.User;
                }
                return item;
              }),
            ]);
          } else {
            this.toastr.error(result.message);
          }
          this.changingCustomerAdmin.set(
            this.changingCustomerAdmin().filter(
              (item: number) => item !== user.id,
            ),
          );
        },
        error: () => {
          this.toastr.success(
            this.translate.instant(this.listErrors.GENERAL.UNEXPECTED_ERROR),
          );
          this.changingCustomerAdmin.set(
            this.changingCustomerAdmin().filter(
              (item: number) => item !== user.id,
            ),
          );
        },
      });
  }

  /**
   * Handle update, add role for user
   * @param userId number, id of user
   * @returns void
   */
  addRoleForUser(userId?: number) {
    if (this.isAddingRole()) {
      return;
    }
    this.isAddingRole.set(true);
    this.userService.addRolesForUser(userId, this.selectedRoles()).subscribe({
      next: (result: any) => {
        const res = JSON.parse(result);
        this.isAddingRole.set(false);
        if (res.success) {
          this.toastr.success(
            this.translate.instant('Role updated successfully!'),
          );
          this.getListUser();
          this.modalService.dismissAll();
        } else {
          const message = CommonUtils.getErrorMessage(
            this.listErrors.USERS,
            res.message,
            'Unable update role, please try again!',
          );
          this.toastr.error(this.translate.instant(message));
        }
      },
      error: () => {
        this.isAddingRole.set(false);
        this.toastr.error(
          this.translate.instant(this.listErrors.GENERAL.UNEXPECTED_ERROR),
        );
      },
    });
  }

  /**
   * Execute change page
   * @param ev page number
   */
  changeNumberPage(ev: PaginationModel) {
    this.getUserparams().PageIndex = ev.pageIndex;
    this.getUserparams().PageSize = ev.pageSize;
    this.getListUser();
  }

  /**
   *
   * @param modal element
   * @param user selected user model data
   */
  openRoleModal(modal: any, user?: UserInfoModel) {
    if (user) {
      this.selectedUser.set(user);
    }
    if (user.listRoleInfo) {
      this.selectedRoles.set([]);
      user.listRoleInfo.forEach((item: any) => {
        this.selectedRoles.update((items) => {
          items.push(item.roleId);
          return [...items];
        });
      });
    } else {
      this.selectedRoles.set(undefined);
    }
    if (this.prevCustomerId() !== this.selectedCustomerId()) {
      this.prevCustomerId.set(this.selectedCustomerId());
      this.roleService
        .getAllRoleByCustomerId(this.selectedCustomerId())
        .subscribe((result: any) => {
          const res = JSON.parse(result);
          if (res.success && res?.data) {
            this.listRole.set(res.data);
          }
        });
    }
    this.modalService.open(modal, {
      centered: true,
      backdrop: 'static',
    });
  }
  /**
   * Close set role model
   */
  closeRoleModal() {
    this.selectedUser.set(undefined);
    this.selectedRoles.set(undefined);
    this.modalService.dismissAll();
  }

  /**
   * Add or remove package in processing
   * @param id number
   * @param add state add or remove
   */
  setInAction(id: number, add: boolean = true) {
    if (add) {
      this.listInActions.update((items) => {
        items.push(id);
        return [...items];
      });
    } else {
      this.listInActions.set(
        this.listInActions().filter((item) => item !== id),
      );
    }
  }
  /**
   * Check current package in processing or not
   * @param id number
   * @returns boolean
   */
  isInAction(id: number): boolean {
    return this.listInActions().findIndex((item) => item === id) >= 0;
  }

  /**
   * Create url assign role for redirect to assign role for user page.
   * @param id number id of user
   * @returns string url of user
   */
  createAssignRoleUrl(id: number): string {
    return (
      id + '/' + ""
    );
  }

  /**
   * Clear role of user by id
   * @param userId number id of user
   * @param roleId number id of role
   */
  onClearRole(userId: number, roleId: number, userType: number) {
    confirmDailog(
      {
        cancelButtonText: this.translate.instant('Cancel'),
        confirmButtonText: this.translate.instant('Delete'),
        html: this.translate.instant(
          "Permission with role of this user will remove. User can't access to this data after that.",
        ),
      },
      'danger',
      () => {
        this.userService.deleteUserRole(userId, roleId).subscribe({
          next: (result: any) => {
            const res = JSON.parse(result);
            if (res.success) {
              this.toastr.success(
                this.translate.instant('Role deleted successfully!'),
              );
              this.getListUser();
            } else {
              this.toastr.error(this.translate.instant('Role delete fail'));
            }
          },
          error: (err: any) => {
            this.toastr.error(this.translate.instant(err));
          },
        });
      },
    );
  }

  /**
   * check permission of item in table
   * @returns boolean
   */
  checkPermission(allowUpdate: boolean) {
    return checkPermissionRow(this.userInfo().userType, allowUpdate);
  }
}
