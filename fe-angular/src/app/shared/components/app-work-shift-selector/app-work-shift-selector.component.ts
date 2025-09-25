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

@Component({
  selector: 'app-work-shift-selector-component',
  templateUrl: './app-work-shift-selector.component.html',
  styleUrls: ['./app-work-shift-selector.component.scss'],
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => WorkShiftSelectorComponent),
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
export class WorkShiftSelectorComponent
  implements ControlValueAccessor, OnChanges
{
  @ViewChild('selectBox') selectBox: NgSelectComponent;
  @Input() workShiftData: Array<any>;
  @Input() CustomerId: number;
  @Input() placeholder = 'Choose workshift';
  @Input() ControlArea: number;
  @Input() multiple = false;
  @Input() readOnly = false;
  @Input() functionKey: string;
  @Input() clearable = false;
  @Input() disabled = false;

  @Output() workShiftSelect = new EventEmitter<any>();
  @Output() afterDataLoaded = new EventEmitter<Array<any>>();
  icons = SvgIcon;
  workshiftId: number;
  getWorkShiftparams: any = {
    PageIndex: 1,
    PageSize: 100,
    Status: 1,
    CustomerId: null,
    DeviceId: null,
    ControlZoneId: null,
  };

  listWorkShifts: any = [];
  isLoading = false;
  textSearch: string;
  /**
   * Change event instance
   */
  onChange: (workshiftIds: Array<number> | number) => void;
  onTouched: () => void;

  constructor() {}

  ngOnChanges(changes: SimpleChanges): void {
    if (this.workShiftData) {
      this.listWorkShifts = [...this.workShiftData];
    } else if (
      changes?.CustomerId?.currentValue !==
        changes?.CustomerId?.previousValue ||
      changes?.ControlArea?.currentValue !== changes?.ControlArea?.previousValue
    ) {
      this.getWorkShiftparams.CustomerId = this.CustomerId;
      this.getWorkShiftparams.ControlZoneId = this.ControlArea;
    }
  }

  writeValue(workshift: number): void {
    this.workshiftId = workshift;
  }

  registerOnChange(fn: any): void {
    if (fn) {
      this.onChange = fn;
    }
  }

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
  changeWorkShiftSelect(item: any) {
    if (this.onChange) {
      this.onChange(this.workshiftId);
    }
    this.workShiftSelect.emit(item);
  }

  /**
   * Emit event when data loaded form api
   * @param item object customer
   */
  dataLoaded(data: Array<any>) {
    this.afterDataLoaded.emit(data);
  }

  /**
   * Search list option
   */
  onSearch() {
    this.selectBox.filter(this.textSearch);
  }
}
