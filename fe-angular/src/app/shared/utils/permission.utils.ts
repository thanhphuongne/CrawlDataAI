import { UserTypeEnum } from '@app/pages/user-permission/models/user-type.enum';

export function checkPermissionRow(type: number, allowUpdate: boolean) {
  if (
    type === UserTypeEnum.SuperAdmin ||
    type === UserTypeEnum.CustomerAdmin ||
    allowUpdate
  ) {
    return true;
  }
  return false;
}
