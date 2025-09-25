import { Injectable } from '@angular/core';
import { GetListUserModel } from '../models/users.model';
import { UserService } from '@app/open-api/common/services/user.service';
import { AuthenticateService } from '@app/open-api/common/services/authenticate.service';
import { UserSaveModel } from '@app/open-api/common/models/user-save-model';
import { ChangeStatusModel } from '@app/open-api/common/models/change-status-model';
@Injectable({
  providedIn: 'root'
})
export class UsersService {
  constructor(
    private services: UserService,
    private authService: AuthenticateService
  ) {}

  /**
   * Get list user of system.
   * @param params object getListUserModel
   * @returns obserable
   */
  getAllUser(params: GetListUserModel) {
    return this.services.userApiV1UserGetListUserGet(params);
  }

  /**
   * Get info of user by id
   * @param userId number, id of user
   * @returns obserable
   */
  getUserById(userId: number) {
    return this.services.userApiV1UserGetuserbyidGet$Plain({ userId });
  }
  /**
   * Add, update user
   * @param user object user save model
   * @returns obserable
   */
  addUpdateUser(user: UserSaveModel) {
    if (user.id) {
      return this.authService.userApiV1AuthenticateUpdatePut$Plain({ body: user });
    }
    return this.authService.userApiV1AuthenticateRegisterPost$Plain({ body: user });
  }

  /**
   * Change status of user.
   * @param user object change status model
   * @returns obserable
   */
  changeUserStatus(user: ChangeStatusModel) {
    return this.authService.userApiV1AuthenticateChangeStatusPut$Plain({
      body: user
    });
  }

  /**
   * Change user as Customer admin
   * @param userId number, userid
   * @param isCustomerAdmin boolean set is customer admin true/false
   * @returns obserable
   */

  changeUserAsCustomerAdmin(userId: number, isCustomerAdmin: boolean) {
    return this.authService.userApiV1AuthenticateChangeCustomerAdminPut$Plain({
      userId,
      isCustomerAdmin
    });
  }
  /**
   * Import list user from file.
   * @param users list user
   * @returns obserable
   */
  importUserFromFile(users: UserSaveModel[]) {
    return this.services.userApiV1UserCreateusersPost({ body: users });
  }

  /**
   *
   * @param userId number, id of user
   * @param files Blob array
   * @returns obserable.
   */
  uploadUserImages(userId: number, files: Blob[]) {
    return this.services.userApiV1UserCreateimagesPost({ userId, body: { files } });
  }

  /**
   * Update list image of user
   * @param params object UserImageUpdateModel
   * @returns obserable.
   */
  updateUserImages(params: {
    userId: number;
    fileCreates: Array<any>;
    fileDeletes: Array<any>;
  }) {
    return this.services.userApiV1UserUpdateimagesPost({
      body: {
        UserId: params.userId,
        FileCreates: params.fileCreates,
        FileDeletes: params.fileDeletes
      }
    });
  }
  /**
   * Get all images of user
   * @param userId number - id of user
   * @returns obserable
   */
  getImagesOfUser(userId: number) {
    return this.services.userApiV1UserGetlistimagesGet({ userId });
  }

  /**
   * Delete image of user by user id
   * @param userId number - id of user
   * @returns obserable
   */
  deleteImagesOfUser(userId: number) {
    return this.services.userApiV1UserDeleteimagePost({ userId });
  }

  /**
   * Add update roles for user
   * @param userId number, user id
   * @param roles array number, list role.
   * @returns obserable
   */
  addRolesForUser(userId: number, roles: Array<number>) {
    return this.services.userApiV1UserUserIdRolesPost({ userId, body: roles });
  }

  /**
   * Delete roles for user
   * @param userId number, user id
   * @param roles array number, list role.
   * @returns obserable
   */
  deleteUserRole(userId: number, roleId: number) {
    return this.services.userApiV1UserDeleteUserRoleDelete({ userId, roleId });
  }
}
