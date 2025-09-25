import { UserInfoModel } from '@app/open-api/common/models/user-info-model';

export interface UserInfoModelExt extends UserInfoModel {
  departmentName?: string;
}
export interface GetListEmployeeModel {
  CustomerId?: number;
  DepartmentId?: number;
  Keyword?: string;
  PageIndex?: number;
  PageSize?: number;
  CurrentEmployeeId?: number;
  UserType?: number;
  Status?: number;
}
export interface GetListEmployeeByDepartmentModel {
  CustomerId?: number;
  FunctionId?: string;
  DepartmentIdList?: string;
  Keyword?: string;
  PageIndex?: number;
  PageSize?: number;
  CurrentEmployeeId?: number;
}
