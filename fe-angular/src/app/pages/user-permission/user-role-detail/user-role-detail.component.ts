import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SITE_ROUTE } from '@app/configs/site-route.contants';
import { CustomRole } from '@app/open-api/common/models/custom-role';
import { DepartmentSaveModel } from '@app/open-api/common/models/department-save-model';
import { UserRoleDataModel } from '@app/open-api/common/models/user-role-data-model';
import { ERRORS_CONSTANT } from '@app/shared/constants/error.constants';
import { SvgIcon } from '@app/shared/constants/svg-icon.constant';
import { CommonUtils } from '@app/shared/utils/comon.utils';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { combineLatest } from 'rxjs';
import {
  FunctionApp,
  FunctionGroupApp,
  ListFunctionGroupApp
} from '../models/permission.model';
import { UserRolesService } from '../services/roles.services';
import { PERMISSIONS_DATA } from '@app/configs/permissions-data.constants';
import { confirmDailog } from '@app/shared/utils/confirm-dailog.ultils';

@Component({
  selector: 'app-user-role-detail',
  templateUrl: './user-role-detail.component.html'
})
export class UserRoleDetailComponent implements OnInit {
  pageTitle = 'User Role Detail';
  listError = ERRORS_CONSTANT;
  icons = SvgIcon;
  listUserRoleUrl: string;

  roleId: number;
  userId: number;
  customerId: number;
  roleData: CustomRole;
  selectedData: any;
  isUpdate: boolean;

  selectedDepartment: Array<number> = [];
  listDepartment: Array<DepartmentSaveModel>;

  selectedArea: Array<number> = [];
  listArea: Array<DepartmentSaveModel>;

  errorCreate: string;
  isLoadingPermission = true;
  listSitePermission: Array<FunctionGroupApp> = [];
  listPermissionIdGranted: Array<string> = [];
  listPermission = PERMISSIONS_DATA;

  constructor(
    private activatedRouter: ActivatedRoute,
    private router: Router,
    private roleService: UserRolesService,
    private toastr: ToastrService,
    private translate: TranslateService
  ) {}
  ngOnInit(): void {
    combineLatest([
      this.activatedRouter.paramMap,
      this.activatedRouter.queryParamMap
    ]).subscribe(([paramsMap, queryParamMap]) => {
      if (
        paramsMap.has('id') &&
        paramsMap.has('roleId') &&
        queryParamMap.has('customerId')
      ) {
        this.roleId = +paramsMap.get('roleId');
        this.userId = +paramsMap.get('id');
        this.customerId = +queryParamMap.get('customerId');
        this.listUserRoleUrl = "";

        this.getRoleDetailById(this.userId, this.roleId);
      } else {
        this.router.navigateByUrl('404');
      }
    });
  }

  /**
   * Get list role of current user.
   * @param userId number, id of current user.
   */
  getRoleDetailById(userId: number, roleId: number) {
    this.roleService.getRoleDetailOfUserById(userId, roleId).subscribe({
      next: (result: any) => {
        const res = JSON.parse(result);
        if (res.success) {
          this.selectedData = res.data || null;
          if (this.selectedData) {
            this.selectedArea = this.getListSelected('area');
            this.selectedDepartment = this.getListSelected('department');
          }
        } else {
          this.selectedData = null;
        }
        this.getRole(this.roleId);
      },
      error: () => {
        this.getRole(this.roleId);
      }
    });
  }

  /**
   * Get role by id
   * @param id number role id
   */
  getRole(id: number = this.roleId) {
    this.isLoadingPermission = true;
    this.roleService.getRoleById(id).subscribe({
      next: (result: any) => {
        const res = JSON.parse(result);
        if (res.success) {
          this.roleData = res.data;
          this.getSystemPermissions();
        } else {
          this.toastr.error(this.translate.instant(res.message));
        }
      },
      error: () => {
        this.toastr.error(
          this.translate.instant(this.listError.GENERAL.UNEXPECTED_ERROR)
        );
      }
    });
  }

  /**
   * Get all permissions of system.
   */
  getSystemPermissions() {
    this.roleService.getAllPermissions(this.customerId).subscribe({
      next: (result: any) => {
        const res = JSON.parse(result);
        if (res.success) {
          this.listSitePermission = res.data;
          this.getPermissionsOfRole();
        } else {
          this.isLoadingPermission = false;
          const message = CommonUtils.getErrorMessage(
            this.listError.ROLES,
            res.message,
            'Unable get permission of system!'
          );
          this.toastr.error(this.translate.instant(message));
        }
      },
      error: () => {
        this.isLoadingPermission = false;
      }
    });
  }

  /**
   * Get all permissions of role by id
   * @param id number, role id
   */
  getPermissionsOfRole(id: number = this.roleId) {
    this.roleService.getAllPermissonsOfRole(id).subscribe({
      next: (result: any) => {
        const res = JSON.parse(result);
        if (res.success) {
          this.listPermissionIdGranted = res.data.map(item => item.value);
          this.updateListSystemPermission();
        } else {
          this.listPermissionIdGranted = [];
          const message = CommonUtils.getErrorMessage(
            this.listError.ROLES,
            res.message,
            'Unable get permission of this role!'
          );
          this.toastr.error(this.translate.instant(message));
        }
        this.isLoadingPermission = false;
      },
      error: () => {
        this.isLoadingPermission = false;
      }
    });
  }

  /**
   *
   *  Update list system permission for change and display
   */
  updateListSystemPermission() {
    this.listSitePermission = this.listSitePermission.map(
      (item: FunctionGroupApp) => {
        let setted = false;
        item.listFunctionGroup.map((funcItem: ListFunctionGroupApp) => {
          let totalPermissionGranted = 0;
          funcItem.listFunctionApp = funcItem.listFunctionApp.map(
            (subItem: FunctionApp) => {
              subItem.activatedRole =
                this.listPermissionIdGranted.findIndex(
                  (permissionId: string) => permissionId === subItem.functionId
                ) !== -1;
              if (subItem.activatedRole) {
                funcItem.activatedRole = true;
                totalPermissionGranted = totalPermissionGranted + 1;
                setted = true;
              } else if (totalPermissionGranted === 0) {
                funcItem.activatedRole = false;
              }
              return subItem;
            }
          );

          return funcItem;
        });
        item.setted = setted;
        return item;
      }
    );
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
   * Store department data to variable for decrease load data
   * @param data array deparment data
   */
  setListDepartment(data: Array<DepartmentSaveModel>) {
    this.listDepartment = data;
  }
  /**
   * Store area data to variable for decrease load data
   * @param data array area data
   */
  setListArea(data: Array<DepartmentSaveModel>) {
    this.listArea = data;
  }

  /**
   * Get list selected Ids
   * @param type  'department' | 'area'
   * @returns array number
   */
  getListSelected(type: 'department' | 'area' = 'department') {
    const selectedIds = [];
    if (type === 'department') {
      this.selectedData?.listDepartment?.forEach((item: any) => {
        selectedIds.push(item.id);
      });
    } else {
      this.selectedData?.listArea?.forEach((item: any) => {
        selectedIds.push(item.id);
      });
    }
    return selectedIds;
  }

  /**
   * Add or update role  data for user with department and area
   */
  updateUserInRole() {
    confirmDailog(
      {
        cancelButtonText: this.translate.instant('Cancel'),
        confirmButtonText: this.translate.instant('Continue'),
        html:
          this.translate.instant("All permissions will override and effect to access of this account! Are you sure continue!")
      },
      'primary',
      () => {
        this.isUpdate = true;
        const areaIds: Array<number> = this.selectedArea || [];
        const departmentIds: Array<number> = this.selectedDepartment || [];
    
        if (areaIds.length === 0 && departmentIds.length === 0) {
          this.errorCreate = this.translate.instant(
            this.listError.ROLE_DATA.REQUIRE_DEPARTMENT_AREA
          );
          this.isUpdate = false;
          return;
        }
    
        const params: UserRoleDataModel = {
          userId: this.userId,
          roleId: this.roleId,
          areaIds,
          departmentIds
        };
    
        this.roleService.setRoleDataForUser(params).subscribe((result: any) => {
          const res = JSON.parse(result);
          if (res.success) {
            this.toastr.success(
              this.translate.instant('Role data updated successfully!')
            );
            // get data user role detail
          } else {
            this.toastr.error(this.translate.instant('Unable updated role data'));
          }
          this.isUpdate = false;
        });
      }
    )
  }
}
