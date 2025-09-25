export interface AppResponseModel {
  data?: any;
  message?: string;
  success?: boolean;
  statusCode?: number;
  metaData?: {
    currentPage?: number;
    totalPages?: number;
    pageSize?: number;
    totalItems?: number;
    hasPrevious?: boolean;
    hasNext?: boolean;
    firstRowOnPage?: number;
    lastRowOnPage?: number;
  };
}
