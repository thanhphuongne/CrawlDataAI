import { Injectable } from '@angular/core';
import { CustomRole } from '@app/open-api/common/models/custom-role';
import { UserRoleDataModel } from '@app/open-api/common/models/user-role-data-model';
import { RoleService } from '@app/open-api/common/services/role.service';
import { UserRoleDataService } from '@app/open-api/common/services/user-role-data.service';
@Injectable({
  providedIn: 'root'
})
export class UserRolesService {
  constructor(
    private services: RoleService,
    private userRoleDataService: UserRoleDataService
  ) {}

  /**
   * Get all role of customer by customer id.
   * @param customerId number, id of customer
   * @returns obserable
   */
  getAllRoleByCustomerId(customerId: number = 0) {
    return this.services.userApiV1RoleGetlistrolebycustomeridGet$Plain({
      customerId
    });
  }

  /**
   * Get roles of user by user id
   * @param userId number
   * @returns obserable
   */
  getRoleOfUserById(userId: number) {
    return this.services.userApiV1RoleUserIdRolesGet({ userId });
  }

  /**
   * Get role by role id
   * @param roleId number id of role
   * @returns obserable
   */
  getRoleById(roleId: number) {
    return this.services.userApiV1RoleGetbyidGet$Plain({ roleId });
  }

  /**
   * Get all permission of system
   * @param customerId number, id of customer
   * @returns obserable
   */
  getAllPermissions(customerId: number) {
    return this.services.userApiV1RoleGetfunctionsGet$Plain({ customerId });
  }

  /**
   * Get all permissions of role by role id
   * @param roleId number, id of role
   * @returns obserable
   */
  getAllPermissonsOfRole(roleId: number) {
    return this.services.userApiV1RoleRoleIdClaimsGet({ roleId });
  }

  /**
   * Get detail role of user.
   * @param userId number, user id
   * @returns obserable
   */
  getListRoleOfUserById(userId: number) {
    return this.services.userApiV1RoleGetListRolesDetailGet({ userId });
  }

  /**
   * Get detail role of user.
   * @param userId number, user id
   * @param roleId number, role id
   * @returns obserable
   */
  getRoleDetailOfUserById(userId: number, roleId: number) {
    return this.services.userApiV1RoleGetRolesDetailGet({
      userId,
      roleId
    });
  }

  /**
   * Change permission of role.
   * @param roleId number, id of role
   * @param listPermission Array string, list permission
   * @returns obserable
   */
  updatePermissionForRole(roleId: number, listPermission: Array<string>) {
    return this.services.userApiV1RoleRoleIdClaimsPost({
      roleId,
      body: listPermission
    });
  }

  /**
   * Create and update role
   * @param params object role
   * @returns obserable
   */
  createUpdateRole(params: CustomRole) {
    if (params.id) {
      return this.services.userApiV1RoleIdPut({ id: params.id, body: params });
    } else {
      return this.services.userApiV1RolePost({ body: params });
    }
  }

  /**
   * Delete role by role Id
   * @param id number role id
   * @returns obserable
   */
  deleteRoleById(id: number) {
    return this.services.userApiV1RoleIdDelete({ id });
  }

  /**
   * Set department and area for user with role.
   * @param body object user Role data
   * @returns obserable
   */
  setRoleDataForUser(body: UserRoleDataModel) {
    return this.userRoleDataService.userApiV1UserroledataPost({ body });
  }

  /**
   * Delete role data of user.
   * @param userId number id of user
   * @param roleId number role id
   * @returns obserable
   */
  deleteRoleDataOfUser(userId: number, roleId: number) {
    return this.userRoleDataService.userApiV1UserroledataDelete({
      userId,
      roleId
    });
  }
}
