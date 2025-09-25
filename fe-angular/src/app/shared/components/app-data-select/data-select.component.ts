import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
  forwardRef,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { CredentialsService } from '@app/core';
import { UserModel } from '@app/core/models/user.model';
import { LocalStorageService } from '@app/core/services/local-storage.service';
import { GetListCustomerModel } from '@app/pages/customer/models/customer.model';
import { CustomerServices } from '@app/pages/customer/services/customer.services';
import {
  GetListAreaDeviceModel,
  GetListDeviceModel,
} from '@app/pages/system-devices/devices/models/devices.model';
import { DevicesService } from '@app/pages/system-devices/devices/services/devices.services';
import { GetListEmployeeByDepartmentModel } from '@app/pages/user-permission/models/employees.model';
import { UserTypeEnum } from '@app/pages/user-permission/models/user-type.enum';
import { EmployeesService } from '@app/pages/user-permission/services/employees.services';
import { AppIconComponent } from '@app/shared/components/icon/icon.component';
import { LocalStorageKeyEnum } from '@app/shared/constants/enums/local-storage-key.enum';
import { SvgIcon } from '@app/shared/constants/svg-icon.constant';
import { AppIconDirectiveModule } from '@app/shared/directives/app-icon/app-icon.directive.module';
import { AppInputExtendFeaturesDirectiveModule } from '@app/shared/directives/app-input-extend-features/app-input-extend-features.module';
import { CommonUtils } from '@app/shared/utils/comon.utils';
import { NgSelectComponent, NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-data-select',
  templateUrl: './data-select.component.html',
  styleUrls: ['./data-select.component.scss'],
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AppDataSelectComponent),
      multi: true,
    },
  ],
  imports: [
    AppIconComponent,
    CommonModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    AppIconDirectiveModule,
    AppInputExtendFeaturesDirectiveModule,
  ],
})
export class AppDataSelectComponent
  implements ControlValueAccessor, OnInit, OnChanges
{
  @ViewChild('selectBox') selectBox: NgSelectComponent;
  @Input() type: 'customer' | 'employee' | 'box' = 'customer';
  @Input() listOptionInput: Array<any>;
  @Input() listIdDisabled: Array<number>;
  @Input() isSelectedAll = false;
  @Input() isAllValue = true;
  @Input() customerId: number;
  @Input() departmentId: any;
  @Input() areaId: any;
  @Input() areaIds: any;
  @Input() multiple = false;
  @Input() allowObserable = true;
  @Input() clearable = false;
  @Input() onlyActive = false;
  @Input() readonly = false;
  @Input() functionKey?: string;
  @Input() deviceType: number;
  @Input() allowLoadMore: boolean;
  @Input() defaultSelectFirst = false;
  @Input() bindLabel = 'name';
  @Input() bindValue = 'id';
  @Input() data: any[];

  @Output() afterDataLoaded = new EventEmitter<Array<any>>();

  /**
   * Change event instance
   */
  onChange: (data: Array<number> | number) => void;

  /**
   * Touched event instance
   */
  onTouched: () => void;

  labelType = 'name';
  icons = SvgIcon;
  listBox: any;

  getCustomerparams: GetListCustomerModel = {
    PageIndex: 1,
    PageSize: 20,
    Status: 1,
    IsChild: true,
  };

  getEmployeeparams: GetListEmployeeByDepartmentModel = {
    PageIndex: 1,
    PageSize: 20,
    CustomerId: null,
    DepartmentIdList: null,
  };
  getDeviceparams: GetListAreaDeviceModel = {
    PageIndex: 1,
    PageSize: 20,
    AreaId: null,
    CustomerId: null,
    Status: 1,
  };
  listItems: Array<any> = [];
  getCusIdFromLocalStorage: number;
  titleSelect = '';
  isLoading = false;
  userInfo: UserModel;
  typeGetBox: string;
  selfListAreaIds: Array<number>;
  totalItems: number;
  disabled: boolean;
  selectedId: Array<number> | number;
  textSearch: string;
  constructor(
    private readonly customerService: CustomerServices,
    private readonly deviceService: DevicesService,
    private readonly employeeService: EmployeesService,
    private readonly translate: TranslateService,
    private readonly localStorageService: LocalStorageService,
    private readonly credentialsService: CredentialsService,
  ) {
    this.userInfo = this.credentialsService.getUserInfoFromToken();
    this.getCusIdFromLocalStorage = this.localStorageService.getNumber(
      LocalStorageKeyEnum.CUSTOMER_ID,
    );
  }

  ngOnInit() {
    switch (this.type) {
      case 'customer':
        this.titleSelect = this.translate.instant('Choose customer');
        this.getListCustomer();
        break;
      case 'box':
        this.titleSelect = this.translate.instant('Choose box');
        break;
      case 'employee':
        this.titleSelect = this.translate.instant('Choose employee');
        this.labelType = 'userName';
        break;
      default:
        this.titleSelect = this.translate.instant('Choose customer');
        break;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      !this.areaId &&
      changes.selectedCusId &&
      Object.keys(changes).length === 1
    ) {
      return;
    }
    if (
      Object.prototype.hasOwnProperty.call(changes, 'listOptionInput') &&
      this.listOptionInput.length > 0 &&
      JSON.stringify(this.listOptionInput) === JSON.stringify(this.listItems)
    ) {
      this.listItems = [...this.listOptionInput];
    } else {
      this.getData(changes);
    }
  }

  /**
   * Get data in dropdown
   * @param changes SimpleChanges
   */
  getData(changes: SimpleChanges) {
    switch (this.type) {
      case 'box':
        this.labelType = this.bindLabel;
        this.functionCaseBox();
        if (
          (Object.prototype.hasOwnProperty.call(changes, 'areaIds') ||
            Object.prototype.hasOwnProperty.call(changes, 'areaId')) &&
          this.onChange
        ) {
          this.selectedId = undefined;
          this.onChange(this.multiple ? [] : null);
        }
        break;
      case 'employee':
        this.listItems = [];
        this.getEmployeeparams.FunctionId = this.functionKey;
        this.getEmployeeparams.CustomerId = this.customerId;
        this.getEmployeeparams.DepartmentIdList = this.departmentId?.toString();
        this.getAllEmployeeByDepartment();
        break;
      default:
        this.titleSelect = this.translate.instant('Choose customer');
        break;
    }
  }

  functionCaseBox() {
    if (this.areaIds && this.functionKey) {
      this.getListDeviceByArea(this.areaIds);
    } else if (
      (this.areaId && this.areaId !== this.getDeviceparams.AreaId) ||
      !this.areaId
    ) {
      if (
        this.userInfo.userType === UserTypeEnum.Default ||
        this.userInfo.userType === UserTypeEnum.User
      ) {
        const listTemp = this.areaId || this.areaId === 0 ? [this.areaId] : [0];
        this.getListDeviceByArea(listTemp);
      } else {
        this.typeGetBox = '';
        this.getDeviceparams.AreaId = this.areaId;
        this.getDeviceparams.CustomerId = this.customerId;
        this.getListDevice();
      }
    }
  }

  selectAllForDropdownItems(items: any[]) {
    const allSelect = (item: any) => {
      item.forEach((element) => {
        element['selectedAllGroup'] = -1;
      });
    };
    allSelect(items);
  }

  /**
   * Get list customer
   * @param params getListCustomerModel
   */
  getListCustomer(params: GetListCustomerModel = this.getCustomerparams) {
    if (!this.allowLoadMore) params.PageSize = 100;
    this.isLoading = true;
    this.customerService.getAllCustomer(params).subscribe({
      next: (result: any) => {
        this.afterGetData(result);
      },
      error: () => {
        this.isLoading = false;
        this.listItems = [];
      },
    });
  }

  /**
   * Get list customer
   * @param params getListCustomerModel
   */
  getListDevice(params: GetListDeviceModel = this.getDeviceparams) {
    if (!params?.CustomerId) return;
    this.isLoading = true;
    if (!this.allowLoadMore) params.PageSize = 100;
    this.typeGetBox = undefined;
    this.deviceService.getAllDevice(params).subscribe({
      next: (result: any) => {
        this.afterGetData(result, this.onlyActive, this.isSelectedAll);
      },
      error: () => {
        this.isLoading = false;
        this.listItems = [];
      },
    });
  }

  /**
   * Get list user
   * @param params GetListEmployeeModel
   */
  getListDeviceByArea(listArea: number[]) {
    this.isLoading = true;
    this.typeGetBox = 'list';
    this.selfListAreaIds = [...listArea];
    this.deviceService
      .getListDevcieByArea(this.functionKey, listArea, this.customerId)
      .subscribe({
        next: (result: any) => {
          this.afterGetData(result, this.onlyActive, this.isSelectedAll);
        },
        error: () => {
          this.isLoading = false;
          this.listItems = [];
        },
      });
  }

  /**
   * Get list customer
   * @param params GetListEmployeeByDepartmentModel
   */
  getAllEmployeeByDepartment(
    params: GetListEmployeeByDepartmentModel = this.getEmployeeparams,
  ) {
    if (!params?.DepartmentIdList) {
      this.selectedId = undefined;
      if (this.onChange) this.onChange(this.selectedId);
      this.selectAllForDropdownItems([]);

      this.afterDataLoaded.emit([]);
      return;
    }
    if (!this.allowLoadMore) params.PageSize = 100;
    this.isLoading = true;
    this.employeeService.getAllEmployeeByDepartment(params).subscribe({
      next: (result: any) => {
        this.afterGetData(result, false, this.isSelectedAll);
      },
      error: () => {
        this.isLoading = false;
        this.listItems = [];
      },
    });
  }

  /**
   * Check exist item in department
   * @param id number
   * @returns booleam
   */
  checkExistItemInListItem(id: number) {
    return this.listItems.find((item: any) => item[this.bindValue] === id);
  }

  /**
   * Execute function after data get
   * @param result any
   */
  afterGetData(
    result: any,
    onlyActive: boolean = false,
    isSelectedAll: boolean = false,
  ) {
    const res = JSON.parse(result);
    const data = res?.data || [];
    if (res) {
      this.totalItems = res?.metaData?.totalItems || 0;
      if (onlyActive) {
        this.listItems = data
          .filter((item: any) => item.status === 1)
          .filter(
            (item: any) => !this.deviceType || item.type === this.deviceType,
          );
      } else {
        this.listItems = data.filter(
          (item: any) => !this.deviceType || item.type === this.deviceType,
        );
      }
      if (this.listIdDisabled?.length > 0) {
        if (this.type === 'employee') {
          this.listItems = this.listItems.filter(
            (item: any) => !this.listIdDisabled.includes(item[this.bindValue]),
          );
        } else {
          this.listItems = this.listItems.map((item: any) => {
            item.disabled = this.listIdDisabled.includes(item.id);
            return item;
          });
        }
      }
      if (isSelectedAll) {
        this.selectAllForDropdownItems(data);
      } else if (
        this.listItems.length > 0 &&
        this.defaultSelectFirst &&
        !this.selectedId
      ) {
        const value = this.listItems[0]?.id;
        this.selectedId = this.multiple ? [value] : value;
        this.onChange(this.selectedId);
      }
    }

    if (!this.defaultSelectFirst) {
      if (typeof this.selectedId === 'object') {
        this.selectedId = this.selectedId?.filter((id: number) =>
          this.checkExistItemInListItem(id),
        );
      } else {
        this.selectedId = this.checkExistItemInListItem(this.selectedId)
          ? this.selectedId
          : null;
      }
      this.onChange(this.selectedId);
    }
    this.afterDataLoaded.emit(data);
    this.isLoading = false;
  }

  /**
   * Handle value change from out site
   * @param ids array number | number
   */
  writeValue(ids: Array<number> | number) {
    if (this.type === 'customer' && this.getCusIdFromLocalStorage && !ids) {
      this.selectedId = +this.getCusIdFromLocalStorage;
    } else {
      this.selectedId = ids;
    }
  }

  /**
   * Register change event
   * @param fn function
   */
  registerOnChange(fn: any) {
    if (fn) {
      this.onChange = fn;
    }
  }

  /**
   * Register touched event
   * @param fn function
   */
  registerOnTouched(fn: () => void) {
    if (fn) {
      this.onTouched = fn;
    }
  }

  /**
   * Set component disabled
   * @param isDisabled boolean
   */
  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
  }

  /**
   * Handle data change select
   */
  changeValue(e: any) {
    if (
      this.isAllValue &&
      this.multiple &&
      typeof e === 'object' &&
      e.length === 1 &&
      e[0] === -1
    ) {
      this.onChange(this.listItems.map((item: any) => item.id));
    } else {
      this.onChange(e);
    }
  }

  /**
   * Load more data select
   */
  loadMore() {
    switch (this.type) {
      case 'customer':
        if (this.getCustomerparams.PageIndex >= Math.ceil(this.totalItems / 20))
          break;
        this.getCustomerparams.PageIndex += 1;
        this.getListCustomer();
        break;
      case 'box':
        if (
          this.typeGetBox === 'list' ||
          this.getDeviceparams.PageIndex >= Math.ceil(this.totalItems / 20)
        )
          break;
        this.getDeviceparams.PageIndex += 1;
        this.getListDevice();
        break;
      case 'employee':
        if (this.getEmployeeparams.PageIndex >= Math.ceil(this.totalItems / 20))
          break;
        this.getEmployeeparams.PageIndex += 1;
        this.getAllEmployeeByDepartment();
        break;
      default:
        break;
    }
  }

  /**
   * Search list option
   */
  onSearch() {
    this.selectBox.filter(this.textSearch);
  }

  /**
   * Get label with type employee
   * @param item any
   * @returns string
   */
  getLabelOption(item: any) {
    const displayName =
      item.fullName.trim().length > 0 ? item.fullName : item.userName;
    return CommonUtils.getAvatarText(displayName);
  }
}
