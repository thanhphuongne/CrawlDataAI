import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  forwardRef,
  ViewChild,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { SvgIcon } from '@app/shared/constants/svg-icon.constant';
import { AppIconDirectiveModule } from '@app/shared/directives/app-icon/app-icon.directive.module';
import { NgSelectComponent, NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { AppInputExtendFeaturesDirectiveModule } from '@app/shared/directives/app-input-extend-features/app-input-extend-features.module';
import { CredentialsService } from '@app/core';
import { UserModel } from '@app/core/models/user.model';

@Component({
  selector: 'app-control-area-selector',
  templateUrl: './app-control-area-selector.component.html',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AppControlAreaSelectorComponent),
      multi: true,
    },
  ],
  imports: [
    CommonModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    AppIconDirectiveModule,
    AppInputExtendFeaturesDirectiveModule,
  ],
})
export class AppControlAreaSelectorComponent
  implements ControlValueAccessor, OnChanges
{
  @ViewChild('selectBox') selectBox: NgSelectComponent;
  @Input() CustomerId: number;
  @Input() placeholder = 'Choose farm';
  @Input() functionKey: string;
  @Input() deviceId: number;
  @Input() areaId: number;
  @Input() multiple = false;
  @Input() readOnly = false;
  @Input() onlyActive = false;
  @Input() clearable = false;
  @Input() disabled = false;

  @Output() controlAreaSelect = new EventEmitter<any>();
  @Output() afterDataLoaded = new EventEmitter<Array<any>>();
  icons = SvgIcon;
  listBox: any;
  getControlAreaParams: any = {
    PageIndex: 1,
    PageSize: 100,
    Status: 1,
    CustomerId: null,
  };
  controlAreaId: number | Array<number>;
  listControlAreas: any = [];
  getCusIdFromLocalStorage: number;
  userInfo: UserModel;
  isLoading = false;
  textSearch: string;
  /**
   * Change event instance
   */
  onChange: (controlAreaId: Array<number> | number) => void;
  onTouched: () => void;

  constructor(private credentialsService: CredentialsService) {
    this.userInfo = this.credentialsService.getUserInfoFromToken();
  }

  ngOnChanges(changes: SimpleChanges): void {}

  /**
   * Write value
   * @param ids number | Array <number>
   */
  writeValue(ids: number | Array<number>): void {
    this.controlAreaId = ids;
  }

  /**
   * Register onchange
   * @param fn any
   */
  registerOnChange(fn: any): void {
    if (fn) {
      this.onChange = fn;
    }
  }

  /**
   * Register ontouched
   * @param fn any
   */
  registerOnTouched(fn: any): void {
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
   * set group item
   * @param items any
   */
  selectAllForDropdownItems(items: any[]) {
    const allSelect = (item: any) => {
      item.forEach((element) => {
        element['selectedAllGroup'] = 'selectedAllGroup';
      });
    };
    allSelect(items);
  }

  /**
   * Emit event customer select when select customer
   * @param item object customer
   */
  changeControlAreaSelect(item: any) {
    if (this.onChange) {
      this.onChange(this.controlAreaId);
    }
    this.controlAreaSelect.emit(item);
  }

  /**
   * Emit event when data loaded form api
   * @param item object customer
   */
  dataLoaded(data: Array<any>) {
    if (this.onlyActive && data?.length > 0) {
      this.listControlAreas = data.filter((item: any) => item.status === 1);
    } else {
      this.listControlAreas = data;
    }
    this.afterDataLoaded.emit(data);
  }

  /**
   * Search list option
   */
  onSearch() {
    this.selectBox.filter(this.textSearch);
  }
}
