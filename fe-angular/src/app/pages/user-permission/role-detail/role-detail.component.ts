import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ERRORS_CONSTANT } from '@app/shared/constants/error.constants';
import { SvgIcon } from '@app/shared/constants/svg-icon.constant';
import { CommonUtils } from '@app/shared/utils/comon.utils';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import {
  FunctionApp,
  FunctionGroupApp,
  ListFunctionGroupApp,
} from '../models/permission.model';
import { UserRolesService } from '../services/roles.services';
import { SITE_ROUTE} from '@app/configs/site-route.contants';
import { CustomRole } from '@app/open-api/common/models/custom-role';
import { CredentialsService } from '@app/core';

@Component({
  selector: 'app-role-detail',
  templateUrl: './role-detail.component.html',
  styleUrls: ['./role-detail.component.scss'],
})
export class RoleDetailComponent implements OnInit {
  pageTitle = 'Management permissions';
  roleId = signal<number>(0);
  roleData = signal<CustomRole>(undefined);
  listError = ERRORS_CONSTANT;
  icons = SvgIcon;
  isLoadingPermission = signal<boolean>(true);
  listSitePermission = signal<FunctionGroupApp[]>([]);
  listPermissionIdGranted = signal<string[]>([]);
  savingChanges = signal<boolean>(false);
  isCollapsed = signal<boolean>(true);
  latestPermission = signal<string[]>([]);
  customerId = signal<number>(0);
  listRoleUrl = "";
  constructor(
    private readonly activatedRouter: ActivatedRoute,
    private readonly credentialsService: CredentialsService,
    private readonly router: Router,
    private readonly roleService: UserRolesService,
    private readonly toastr: ToastrService,
    private readonly translate: TranslateService,
  ) {}
  ngOnInit(): void {
    this.customerId.set(this.credentialsService.activeCustomerId);
    this.activatedRouter.params.subscribe((params: any) => {
      if (params.id && !isNaN(params.id)) {
        this.roleId.set(+params.id);
        this.getRole(this.roleId());
      } else {
        this.router.navigateByUrl('404');
      }
    });
  }

  /**
   * Get role by id
   * @param id number role id
   */
  getRole(id: number = this.roleId()) {
    this.roleService.getRoleById(id).subscribe({
      next: (result: any) => {
        const res = JSON.parse(result);
        if (res.success) {
          this.roleData.set(res.data);
          this.getSystemPermissions();
        } else {
          this.toastr.error(this.translate.instant(res.message));
        }
      },
      error: () => {
        this.toastr.error(
          this.translate.instant(this.listError.GENERAL.UNEXPECTED_ERROR),
        );
      },
    });
  }

  /**
   * Get all permissions of system.
   */
  getSystemPermissions() {
    this.isLoadingPermission.set(true);
    this.roleService.getAllPermissions(this.customerId()).subscribe({
      next: (result: any) => {
        const res = JSON.parse(result);
        if (res.success) {
          this.listSitePermission.set(res.data);
          this.getPermissionsOfRole();
        } else {
          this.isLoadingPermission.set(false);
          const message = CommonUtils.getErrorMessage(
            this.listError.ROLES,
            res.message,
            'Unable get permission of system!',
          );
          this.toastr.error(this.translate.instant(message));
        }
      },
      error: () => {
        this.isLoadingPermission.set(false);
      },
    });
  }
  /**
   * Get all permissions of role by id
   * @param id number, role id
   */
  getPermissionsOfRole(id: number = this.roleId()) {
    this.roleService.getAllPermissonsOfRole(id).subscribe({
      next: (result: any) => {
        const res = JSON.parse(result);
        if (res.success) {
          this.listPermissionIdGranted.set(res.data.map((item) => item.value));
          this.updateListSystemPermission();
        } else {
          this.listPermissionIdGranted.set([]);
          const message = CommonUtils.getErrorMessage(
            this.listError.ROLES,
            res.message,
            'Unable get permission of this role!',
          );
          this.toastr.error(this.translate.instant(message));
        }
        this.isLoadingPermission.set(false);
      },
      error: () => {
        this.isLoadingPermission.set(false);
      },
    });
  }

  /**
   *
   *  Update list system permission for change and display
   */
  updateListSystemPermission() {
    this.listSitePermission.set(
      this.listSitePermission().map((item: FunctionGroupApp) => {
        let setted = false;
        item.listFunctionGroup.forEach((funcItem: ListFunctionGroupApp) => {
          let totalPermissionGranted = 0;
          funcItem.listFunctionApp = funcItem.listFunctionApp.map(
            (subItem: FunctionApp) => {
              subItem.activatedRole =
                this.listPermissionIdGranted().findIndex(
                  (permissionId: string) => permissionId === subItem.functionId,
                ) !== -1;
              if (subItem.activatedRole) {
                funcItem.activatedRole = true;
                totalPermissionGranted = totalPermissionGranted + 1;
                setted = true;
              } else if (totalPermissionGranted === 0) {
                funcItem.activatedRole = false;
              }
              return subItem;
            },
          );

          return funcItem;
        });
        item.setted = setted;
        return item;
      }),
    );
  }
  /**
   * Add/Remove group permission to role permissions
   * Granted all child permission of that group to list permission granted.
   * @param groupIndex selected index
   * @param index selected index
   * @param isAdd function option add or remove
   */
  addRemoveRole(groupIndex: number, index: any, isAdd: boolean = true) {
    let indexPermission;
    this.latestPermission.set([]);
    if (isAdd) {
      this.isCollapsed.set(true);
    }
    for (
      let i = 0;
      i < this.listSitePermission()[groupIndex].listFunctionGroup.length;
      i++
    ) {
      if (index === -1) {
        indexPermission = i;
      } else {
        indexPermission = index;
      }
      const selectedGroup: ListFunctionGroupApp =
        this.listSitePermission()[groupIndex].listFunctionGroup[
          indexPermission
        ];
      selectedGroup.listFunctionApp = selectedGroup.listFunctionApp.map(
        (permission: FunctionApp) => {
          permission.activatedRole = isAdd;
          if (isAdd) {
            this.listPermissionIdGranted.update((items) => {
              items.push(permission.functionId);
              return [...items];
            });
            this.latestPermission.update((items) => {
              items.push(permission.functionId);
              return [...items];
            });
          } else {
            this.listPermissionIdGranted.set(
              this.listPermissionIdGranted().filter(
                (permissionFucntionId) =>
                  permissionFucntionId !== permission.functionId,
              ),
            );
          }
          return permission;
        },
      );
      selectedGroup.activatedRole = isAdd;
      this.listSitePermission.update((arr) => {
        const newArr = [...arr];
        newArr[groupIndex] = {
          ...newArr[groupIndex],
          setted: isAdd,
        };
        return newArr;
      });
      if (isAdd) {
        this.listSitePermission.update((arr) => {
          const newArr = [...arr];
          newArr[groupIndex] = {
            ...newArr[groupIndex],
            [indexPermission]: selectedGroup,
          };
          return newArr;
        });
      }
      if (index !== -1) {
        break;
      }
    }

    this.listSitePermission.set([...this.listSitePermission()]);
  }
  checkLatestPermission(permission: any) {
    let result;
    permission.forEach((item: any) => {
      if (!this.latestPermission().includes(item.functionId)) {
        result = true;
        return;
      } else {
        result = false;
        return;
      }
    });
    return result;
  }
  expandAll() {
    if (this.latestPermission().length > 0) {
      this.latestPermission.set([]);
      this.isCollapsed.set(false);
    } else {
      this.isCollapsed.set(!this.isCollapsed());
    }
  }
  /**
   * Update list system permission for display and change list permission id granted
   * @param event object click event
   * @param permission functionApp object
   * @param groupIndex number, index of group
   * @param parentIndex number, index of group permission
   */
  changePermission(
    event: any,
    permission: FunctionApp,
    groupIndex: number,
    parentIndex: number,
  ) {
    const isChecked = event?.target.checked;
    if (!isChecked) {
      this.listPermissionIdGranted.set(
        this.listPermissionIdGranted().filter((item: string) => {
          return item !== permission.functionId;
        }),
      );
    } else {
      this.listPermissionIdGranted.update((items) => {
        items.push(permission.functionId);
        return [...items];
      });
    }
    const selectedGroup: ListFunctionGroupApp =
      this.listSitePermission()[groupIndex].listFunctionGroup[parentIndex];
    selectedGroup.listFunctionApp = selectedGroup.listFunctionApp.map(
      (item: FunctionApp) => {
        if (item.functionId === permission.functionId) {
          permission.activatedRole = isChecked;
        }
        return item;
      },
    );
    selectedGroup.activatedRole = true;
    this.listSitePermission.update((arr) => {
      const newArr = [...arr];
      newArr[groupIndex] = {
        ...newArr[groupIndex],
        [groupIndex]: selectedGroup,
      };
      return newArr;
    });
  }

  /**
   * Grant all permission for current permission group.
   * @param  groupIndex number, index of group
   * @param index number current index of permission group
   */
  grantAll(groupIndex: number, index: number) {
    const selectedGroup: ListFunctionGroupApp =
      this.listSitePermission()[groupIndex].listFunctionGroup[index];
    if (selectedGroup.checkedAll) {
      selectedGroup.listFunctionApp = selectedGroup.listFunctionApp.map(
        (item: FunctionApp) => {
          if (this.listPermissionIdGranted().includes(item.functionId)) {
            this.listPermissionIdGranted.set(
              this.listPermissionIdGranted().filter(
                (id: string) => id !== item.functionId,
              ),
            );
            item.activatedRole = false;
          }
          return item;
        },
      );
    } else {
      selectedGroup.listFunctionApp = selectedGroup.listFunctionApp.map(
        (item: FunctionApp) => {
          if (!this.listPermissionIdGranted().includes(item.functionId)) {
            this.listPermissionIdGranted.update((items) => {
              items.push(item.functionId);
              return [...items];
            });
            item.activatedRole = true;
          }
          return item;
        },
      );
    }
    selectedGroup.activatedRole = true;
    this.listSitePermission.update((arr) => {
      const newArr = [...arr];
      newArr[groupIndex] = {
        ...newArr[groupIndex],
        [groupIndex]: selectedGroup,
      };
      return newArr;
    });
  }
  /**
   * Count total permission granted in current group permission
   * @param group current group permission
   * @returns string count totalgranted/total permission
   */
  countPermissionsGranted(group: ListFunctionGroupApp) {
    const total = group.listFunctionApp.length;
    const totalGranted = group.listFunctionApp.filter((item: FunctionApp) => {
      return item.activatedRole;
    }).length;
    group.checkedAll = totalGranted === total;
    return totalGranted + '/' + total;
  }
  /**
   * Add or remove permission from temp list.
   * @param id number role Id
   * @param listPermission array list permissions
   */
  updatePermissionsOfRole(
    id: number = this.roleId(),
    listPermission: Array<string> = this.listPermissionIdGranted(),
  ) {
    if (this.savingChanges()) {
      return;
    }
    this.savingChanges.set(true);
    this.roleService.updatePermissionForRole(id, listPermission).subscribe({
      next: (result: any) => {
        this.savingChanges.set(false);
        const res = JSON.parse(result);
        if (res.success) {
          this.toastr.success(
            this.translate.instant('Permissions changed successfully!'),
          );
          this.updateListSystemPermission();
        } else {
          this.toastr.error(this.translate.instant(res.message));
        }
      },
      error: () => {
        this.savingChanges.set(false);
        this.toastr.error(
          this.translate.instant(this.listError.GENERAL.UNEXPECTED_ERROR),
        );
      },
    });
  }

  /**
   * Check show messeage no permission setted for role.
   * @returns boolean, true if not permission setted
   */
  checkShowNoPermissionSetted() {
    return (
      this.listSitePermission().findIndex((item: FunctionGroupApp) => {
        return item.setted;
      }) === -1
    );
  }
  /**
   * Check if group permission setted all to disable Add all.
   * @returns boolean, true if not permission setted
   */
  checkGroupPermissionSettedAll(groupIndex: number) {
    return this.listSitePermission()[groupIndex].listFunctionGroup.every(
      (item: any) => item?.activatedRole,
    );
  }
}
