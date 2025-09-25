import { FilterMode } from "@app/shared/constants/enums/view-mode.enum";
import { PopupType } from "../../popup/enum/popup.enum";

export interface UserInfoModel {
  date_joined?: string;
  department?: string | null;
  full_name: string;
  id?: string;
  is_active?: boolean;
  is_staff?: boolean;
  username?: string;
}

export interface FilterTagModel {
  type: FilterMode;
  value: string;
  selectedId?: number;
}

export interface PopupModel {
  type: PopupType;
  title: string;
  content: string;
}
