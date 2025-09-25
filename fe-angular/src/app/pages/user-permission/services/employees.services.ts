import { Injectable } from '@angular/core';
import { ChangeStatusModel } from '@app/open-api/common/models/change-status-model';
import { UserImageUpdateFromFwModel } from '@app/open-api/common/models/user-image-update-from-fw-model';
import { UserSaveModel } from '@app/open-api/common/models/user-save-model';
import { AuthenticateService } from '@app/open-api/common/services/authenticate.service';
import { UserService } from '@app/open-api/common/services/user.service';
import {
  GetListEmployeeByDepartmentModel,
  GetListEmployeeModel
} from '../models/employees.model';
import { DeleteModel } from '@app/open-api/common/models';
@Injectable({
  providedIn: 'root'
})
export class EmployeesService {
  constructor(
    private services: UserService,
    private authService: AuthenticateService
  ) {}

  syncData(payloadData: any) {
    return this.services.userApiV1UserSyncdataPost({
      body: payloadData
    });
  }
  /**
   * Change allow login of employee.
   * @param employee object change allow login model
   * @returns obserable
   */
  changeEnableLogin(employee: any) {
    return this.authService.userApiV1AuthenticateChangeEnableLoginPut$Plain(
      employee
    );
  }

  /**
   * Change allow login of employee.
   * @param employee object change allow login model
   * @returns obserable
   */
  changePassword(employee: any) {
    return this.authService.userApiV1AuthenticateChangePasswordPut$Plain({
      body: employee
    });
  }
  resetPassword(employee: any) {
    return this.authService.userApiV1AuthenticateResetPasswordPut$Plain({
      body: employee
    });
  }
  /**
   * Get list employee of system.
   * @param params object getListUserModel
   * @returns obserable
   */
  getAllEmployeeByDepartment(params: GetListEmployeeByDepartmentModel) {
    return this.services.userApiV1UserGetListEmployeeByDepartmentsGet(params);
  }

  /**
   * Get list employee of system.
   * @param params object getListUserModel
   * @returns obserable
   */
  getAllEmployee(params: GetListEmployeeModel) {
    return this.services.userApiV1UserGetListEmployeeGet$Plain(params);
  }

  /**
   * Get info of employee by id
   * @param employeeId number, id of employee
   * @returns obserable
   */
  getEmployeeById(userId: number) {
    return this.services.userApiV1UserGetuserbyidGet$Plain({ userId });
  }

  /**
   * Get infor of employee by citizenIdentityCard
   * @param citizenIdentityCard card id no
   * @returns Obserable
   */
  getEmployeeByCID(citizenIdentityCard: string) {
    return this.services.userApiV1UserGetByCitizenIdentityCardGet$Plain({
      citizenIdentityCard
    });
  }
  /**
   * Add, update employee
   * @param employee object employee save model
   * @returns obserable
   */
  addUpdateEmployee(employee: UserSaveModel) {
    if (employee.id) {
      return this.authService.userApiV1AuthenticateUpdatePut$Plain({
        body: employee
      });
    }
    return this.authService.userApiV1AuthenticateRegisterPost$Plain({
      body: employee
    });
  }

  /**
   * Delete employee
   * @param id number
   * @param name string
   */
  deleteEmployee(body: DeleteModel) {
    return this.authService.userApiV1AuthenticateDeleteDelete$Plain({ body });
  }

  /**
   * Change status of employee.
   * @param employee object change status model
   * @returns obserable
   */
  changeEmployeeStatus(employee: ChangeStatusModel) {
    return this.authService.userApiV1AuthenticateChangeStatusPut$Plain({
      body: employee
    });
  }
  /**
   * Import list employee from file.
   * @param employees list employee
   * @returns obserable
   */
  importEmployeeFromFile(employees: UserSaveModel[]) {
    return this.services.userApiV1UserCreateusersPost({ body: employees });
  }

  /**
   *
   * @param employeeId number, id of employee
   * @param files Blob array
   * @returns obserable.
   */
  uploadEmployeeImages(userId: number, files: Blob[]) {
    return this.services.userApiV1UserCreateimagesPost({
      userId,
      body: { files }
    });
  }

  /**
   * Update list image of employee
   * @param params object EmployeeImageUpdateModel
   * @returns obserable.
   */
  updateEmployeeImages(params: {
    employeeId: number;
    fileCreates: Array<any>;
    fileDeletes: Array<any>;
  }) {
    return this.services.userApiV1UserUpdateimagesPost({
      body: {
        UserId: params.employeeId,
        FileCreates: params.fileCreates,
        FileDeletes: params.fileDeletes
      }
    });
  }
  /**
   * Get all images of employee
   * @param employeeId number - id of employee
   * @returns obserable
   */
  getImagesOfEmployee(userId: number) {
    return this.services.userApiV1UserGetlistimagesGet({ userId });
  }

  /**
   * Delete image of employee by employee id
   * @param employeeId number - id of employee
   * @returns obserable
   */
  deleteImagesOfEmployee(userId: number) {
    return this.services.userApiV1UserDeleteimagePost({ userId });
  }

  /**
   * Update image
   * @param param UserImageUpdateFromFwModel
   * @returns obserable
   */
  updateImageFromFW(param: UserImageUpdateFromFwModel) {
    return this.services.userApiV1UserUpdateimagesfromfwPost({ body: param });
  }
}
