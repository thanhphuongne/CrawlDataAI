import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  Input,
  ViewChild,
  forwardRef
} from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR
} from '@angular/forms';
import { USER_TYPE_SELECT_CONSTANT } from '@app/pages/user-permission/models/user-type.constant';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-user-type-select',
  templateUrl: './user-type-select.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AppUserTypeSelectComponent),
      multi: true
    }
  ],
  standalone: true,
  imports: [CommonModule, NgSelectModule, TranslateModule, FormsModule]
})
export class AppUserTypeSelectComponent implements ControlValueAccessor {
  @ViewChild('timePicker') timeTemplate: ElementRef;
  @ViewChild('datePicker') datePicker;
  @Input() customerId: number;
  @Input() multiple: boolean;
  @Input() placeholder: string;
  @Input() functionKey: string;
  @Input() boxId: number;
  @Input() readonly: boolean;
  @Input() packageType: number;
  @Input() listCameraSelected: Array<number> = [];
  @Input() clearable = true;

  disabled: boolean;
  selectedId: Array<number> = [];
  listUserType: Array<any> = [
    {
      id: USER_TYPE_SELECT_CONSTANT.employees.value,
      name: USER_TYPE_SELECT_CONSTANT.employees.label
    },
    {
      id: USER_TYPE_SELECT_CONSTANT.guest.value,
      name: USER_TYPE_SELECT_CONSTANT.guest.label
    }
  ];
  isLoading = true;

  /**
   * Change event instance
   */
  onChange: (data: Array<number>) => void;

  /**
   * Touched event instance
   */
  onTouched: () => void;

  constructor() {
    this.placeholder = 'Choose camera';
  }

  /**
   * Handle value change from out site
   * @param ids array number
   */
  writeValue(ids: Array<number>) {
    this.selectedId = ids || [];
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
   * Get all camera of system by customer Id
   */

  /**
   * Filter list cameras with type, listCameraSelected
   * @param list Array Camera
   * @returns array
   */

  /**
   * Handle data change select
   */
  changeValue() {
    if (this.onChange) {
      this.onChange(this.selectedId);
    }
  }
}
