import {
  FunctionGroup as apiModelFunctionGroup,
  FunctionAppModel as apiModelFunctionApp
} from '@app/open-api/common/models';

export interface ListFunctionGroupApp extends apiModelFunctionGroup {
  activatedRole?: boolean;
  checkedAll?: boolean;
  listFunctionApp: null | Array<FunctionApp>;
}

export interface FunctionApp extends apiModelFunctionApp {
  activatedRole?: boolean;
}

export interface FunctionGroupApp {
  groupName?: string;
  description?: string;
  setted?: boolean;
  listFunctionGroup: null | Array<ListFunctionGroupApp>;
}

export interface FunctionGroup extends apiModelFunctionGroup {
  activatedRole?: boolean;
  listFunctionApp: null | Array<FunctionApp>;
}
