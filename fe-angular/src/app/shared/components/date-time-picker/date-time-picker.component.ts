import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  ViewChild,
  forwardRef,
  input,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { SvgIcon } from '@app/shared/constants/svg-icon.constant';
import { AppButtonDirectiveModule } from '@app/shared/directives/app-button/app-button.directive.module';
import { AppIconDirectiveModule } from '@app/shared/directives/app-icon/app-icon.directive.module';
import {
  DateFormatEnum,
  DateTimeUtils,
} from '@app/shared/utils/date-times.utils';
import {
  NgbCalendar,
  NgbDateStruct,
  NgbDatepickerModule,
  NgbTimeStruct,
} from '@ng-bootstrap/ng-bootstrap';
import { DateTimeStruct } from '../../models/date-time-struct.model';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-date-time-picker',
  templateUrl: './date-time-picker.component.html',
  styleUrls: ['./date-time-picker.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AppDateTimePickerComponent),
      multi: true,
    },
  ],
  standalone: true,
  imports: [
    CommonModule,
    NgbDatepickerModule,
    AppButtonDirectiveModule,
    AppIconDirectiveModule,
    FormsModule,
    NgSelectModule,
  ],
})
export class AppDateTimePickerComponent implements ControlValueAccessor {
  @ViewChild('timePicker') timeTemplate: ElementRef;
  @ViewChild('datePicker') datePicker;
  displayFormat = input<string>(DateFormatEnum.DATE_TIME_24_FORMAT, {
    alias: 'displayFormat',
  });
  enableTimePicker = input<boolean>(false, { alias: 'enableTimePicker' });
  allowClear = input<boolean>(true, { alias: 'allowClear' });
  minDate = input<NgbDateStruct>(
    {
      year: 1900,
      month: 1,
      day: 1,
    },
    { alias: 'minDate' },
  );
  maxDate = input<NgbDateStruct>(null, { alias: 'maxDate' });
  placeholder = input<string>('', { alias: 'placeholder' });

  disabled: boolean;
  time: NgbTimeStruct = {
    hour: 0,
    second: 0,
    minute: 0,
  };
  date: NgbDateStruct;
  listIcons = SvgIcon;
  dateTimeDisplay: string;
  dateTimeUtils = new DateTimeUtils();
  selfValue: DateTimeStruct;
  listHours = Array.from({ length: 24 }, (_, index) => ({
    id: index,
    name: `${index}`,
  }));
  listMinutes = Array.from({ length: 60 }, (_, index) => ({
    id: index,
    name: `${index}`,
  }));
  lastTagSearchedHour: string;
  lastTagSearchedMinute: string;
  /**
   * Change event instance
   */
  onChange: (data: DateTimeStruct) => void;

  /**
   * Touched event instance
   */
  onTouched: () => void;

  constructor(private calendar: NgbCalendar) {}

  /**
   * Handle value change from out site
   * @param dateTimeVal object DateTimeStruct
   */
  writeValue(dateTimeVal: DateTimeStruct) {
    this.selfValue = dateTimeVal;
    if (this.selfValue) {
      this.parseDateTime(dateTimeVal);
      this.updateValue(false);
    } else {
      this.dateTimeDisplay = null;
    }
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

  /**
   * Set component disabled
   * @param isDisabled boolean
   */
  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
  }

  /**
   * Parse data to date and time for display in picker
   * @param dateTimeVal DateTimeStruct object
   */
  parseDateTime(dateTimeVal: DateTimeStruct) {
    this.time = {
      hour: dateTimeVal.hour,
      minute: dateTimeVal.minute,
      second: dateTimeVal.second,
    };
    this.date = {
      day: dateTimeVal.day,
      year: dateTimeVal.year,
      month: dateTimeVal.month,
    };
  }

  /**
   * Handle date change
   */
  onDateChange() {
    if (this.enableTimePicker) {
      const timeTemplate = this.timeTemplate.nativeElement;
      setTimeout(() => {
        timeTemplate.querySelector('input').focus();
      }, 0);
    }
    this.updateValue();
  }

  /**
   * Handle time change.
   */
  onTimeChange(type: string) {
    if (this.time && type === 'minute' && typeof this.time.hour === 'number') {
      this.datePicker.toggle();
      if (!this.date) {
        this.date = this.calendar.getToday();
      }
      this.updateValue();
    }
  }

  /**
   * On set tag search
   * @param inputEvent any
   * @param type string
   */
  onTagSearch(inputEvent: any, type: string) {
    if (type === 'hour') {
      this.lastTagSearchedHour = inputEvent.term;
    } else {
      this.lastTagSearchedMinute = inputEvent.term;
    }
  }

  /**
   * On blur time
   * @param type string
   */
  onTimeBlur(type: string) {
    if (
      type === 'hour' &&
      this.listHours
        .map((item: { id: number; name: string }) => item.name)
        .find((name: string) => name === this.lastTagSearchedHour)
    ) {
      this.time.hour =
        this.listHours[
          this.listHours
            .map((item: { id: number; name: string }) => item.name)
            .findIndex((name: string) => name === this.lastTagSearchedHour)
        ].id;
    }

    if (
      type === 'minute' &&
      this.listMinutes
        .map((item: { id: number; name: string }) => item.name)
        .find((name: string) => name === this.lastTagSearchedMinute)
    ) {
      this.time.minute =
        this.listMinutes[
          this.listMinutes
            .map((item: { id: number; name: string }) => item.name)
            .findIndex((name: string) => name === this.lastTagSearchedMinute)
        ].id;
      this.onTimeChange('minute');
    }
  }

  /**
   *  Update value of date time
   * @param isUpdate boolean, send data change to out site or not
   */
  updateValue(isUpdate: boolean = true) {
    if (!this.enableTimePicker) {
      this.time = {
        hour: 0,
        second: 0,
        minute: 0,
      };
    }
    if (this.date && this.time) {
      this.selfValue = { ...this.date, ...this.time };
      if (isUpdate && this.onChange) {
        this.onChange(this.selfValue);
      }
      this.dateTimeDisplay = this.dateTimeUtils.dateTimeObjectToDateTimeString(
        this.selfValue,
        this.displayFormat(),
      );
    }
  }

  /**
   * Handle update value when input change
   */
  onTextValueChange() {
    const date = this.dateTimeUtils.dateTimeStringToObject(
      this.dateTimeDisplay,
      this.displayFormat(),
    );
    if (date) {
      this.selfValue = date;
      this.parseDateTime(date);
      if (this.onChange) {
        this.onChange(date);
      }
    }
  }

  /**
   * Handle clear date
   */
  handleClearDate() {
    this.date = null;
    this.time = null;
    this.selfValue = null;
    this.dateTimeDisplay = null;
    if (this.onChange) {
      this.onChange(this.selfValue);
    }
  }
}
