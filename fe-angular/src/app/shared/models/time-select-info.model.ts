import { SearchDateType } from '../constants/enums/search-date-type.enum';

export interface TimeSelectInfo {
  type: SearchDateType;
  name: string;
  start?: Date;
  end?: Date;
  placeholder?: string;
  dateRangeStr?: string;
  dateStartStr?: string;
  dateEndStr?: string;
}
