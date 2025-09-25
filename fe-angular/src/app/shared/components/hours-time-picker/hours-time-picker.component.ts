import { CommonModule } from '@angular/common';
import { Component, Input, forwardRef, input } from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  NgbCalendar,
  NgbDatepickerModule,
  NgbTimeStruct,
  NgbTimepicker,
} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-hours-time-picker',
  templateUrl: './hours-time-picker.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AppHoursTimePickerComponent),
      multi: true,
    },
  ],
  standalone: true,
  imports: [
    CommonModule,
    NgbDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    NgbTimepicker,
  ],
})
export class AppHoursTimePickerComponent implements ControlValueAccessor {
  placeholder = input('', { alias: 'placeholder' });
  readOnly = input<boolean>(false, { alias: 'readOnly' });
  spinners = input<boolean>(false, { alias: 'spinners' });

  time: NgbTimeStruct = {
    hour: 0,
    second: 0,
    minute: 0,
  };
  /**
   * Change event instance
   */
  onChange: (time: any) => void;

  /**
   * Touched event instance
   */
  onTouched: () => void;

  constructor(private calendar: NgbCalendar) {}

  /**
   * Handle value change from out site
   * @param time object any
   */
  writeValue(time: any) {
    this.time = time;
  }

  /**
   * Register change event
   * @param fn function
   */
  registerOnChange(fn: any) {
    this.onChange = fn;
  }

  /**
   * Register touched event
   * @param fn function
   */
  registerOnTouched(fn: () => void) {
    this.onTouched = fn;
  }

  changeTime(e: any) {
    this.onChange(e);
  }
}
