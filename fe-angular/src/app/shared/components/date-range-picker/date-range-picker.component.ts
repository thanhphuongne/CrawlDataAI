import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  forwardRef,
  input,
  signal,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { SvgIcon } from '@app/shared/constants/svg-icon.constant';
import { AppButtonDirectiveModule } from '@app/shared/directives/app-button/app-button.directive.module';
import { AppIconDirectiveModule } from '@app/shared/directives/app-icon/app-icon.directive.module';
import { DateRangeStruct } from '@app/shared/models/date-range-struct.model';
import {
  DateFormatEnum,
  DateTimeUtils,
} from '@app/shared/utils/date-times.utils';

import {
  NgbDate,
  NgbDateStruct,
  NgbDatepickerModule,
  NgbTimepickerModule,
} from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NzIconModule } from 'ng-zorro-antd/icon';

@Component({
  selector: 'app-date-range-picker',
  templateUrl: './date-range-picker.component.html',
  styleUrls: ['./date-range-picker.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AppDateRangePickerComponent),
      multi: true,
    },
  ],
  standalone: true,
  imports: [
    CommonModule,
    NgbDatepickerModule,
    NgbTimepickerModule,
    AppButtonDirectiveModule,
    TranslateModule,
    AppIconDirectiveModule,
    FormsModule,
    NzIconModule,
  ],
})
export class AppDateRangePickerComponent implements ControlValueAccessor {
  @Output() dateCleared: EventEmitter<string> = new EventEmitter<string>();

  @ViewChild('datePicker') datePicker;

  displayFormat = input<string>(DateFormatEnum.SYSTEM_FORMAT, {
    alias: 'displayFormat',
  });
  enableTimePicker = input<boolean>(false, { alias: 'enableTimePicker' });
  minDate = input<NgbDateStruct>(
    {
      year: 1900,
      month: 1,
      day: 1,
    },
    { alias: 'minDate' },
  );
  maxDate = input<NgbDateStruct>(null, { alias: 'maxDate' });
  placeholder = input<string>('From date - to date', { alias: 'placeholder' });

  disabled: boolean;
  date: NgbDateStruct;
  listIcons = SvgIcon;
  dateTimeUtils = new DateTimeUtils();
  selfValue: DateRangeStruct;

  fromDate: NgbDate | null;
  toDate: NgbDate | null;
  hoveredDate: NgbDate | null = null;
  startDate = signal<string>('');
  endDate = signal<string>('');
  dateRangeDisplay: string;
  /**
   * Change event instance
   */
  onChange: (data: DateRangeStruct) => void;

  /**
   * Touched event instance
   */
  onTouched: () => void;

  constructor(private translate: TranslateService) {}

  /**
   * Handle value change from out site
   * @param dateTimeVal object DateRangeStruct
   */
  writeValue(dateTimeVal: DateRangeStruct) {
    this.selfValue = dateTimeVal;
    this.fromDate = dateTimeVal?.fromDate
      ? new NgbDate(
          dateTimeVal.fromDate.year,
          dateTimeVal.fromDate.month,
          dateTimeVal.fromDate.day,
        )
      : undefined;
    this.toDate = dateTimeVal?.toDate
      ? new NgbDate(
          dateTimeVal.toDate.year,
          dateTimeVal.toDate.month,
          dateTimeVal.toDate.day,
        )
      : undefined;

    this.setDateRangeDisplay();
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
   *  Update value of date time
   * @param isUpdate boolean, send data change to out site or not
   */
  updateValue(isUpdate: boolean = true) {
    this.selfValue = {
      fromDate: this.fromDate,
      toDate: this.toDate,
    };
    if (isUpdate) {
      this.onChange(this.selfValue);
    }

    this.setDateRangeDisplay();
  }

  /**
   * Set date range display in view
   * @returns void
   */
  setDateRangeDisplay() {
    if (this.fromDate && this.toDate) {
      this.dateRangeDisplay =
        this.dateTimeUtils.dateObjectToDateString(
          this.fromDate,
          this.displayFormat(),
        ) +
        ' - ' +
        this.dateTimeUtils.dateObjectToDateString(
          this.toDate,
          this.displayFormat(),
        );
    } else {
      this.dateRangeDisplay = this.translate.instant(this.placeholder());
    }
  }
  /**
   * Handle date selected
   * @param date object NgbDate, date item
   * @returns boolean
   */
  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
      this.startDate.set(
        this.dateTimeUtils.dateObjectToDateString(
          this.fromDate,
          this.displayFormat(),
        ),
      );
      this.endDate.set(null);
    } else if (this.fromDate && !this.toDate && date) {
      this.setToDate(date);
    } else if (this.toDate && !this.fromDate && date) {
      this.setFromDate(date);
    } else {
      this.toDate = null;
      this.fromDate = date;
      this.startDate.set(
        this.dateTimeUtils.dateObjectToDateString(
          this.fromDate,
          this.displayFormat(),
        ),
      );
      this.endDate.set(null);
    }
  }

  /**
   * Set to date
   * @param date NgbDate
   */
  setToDate(date: NgbDate) {
    if (date.before(this.fromDate)) {
      this.toDate = this.fromDate;
      this.endDate.set(
        this.dateTimeUtils.dateObjectToDateString(
          this.toDate,
          this.displayFormat(),
        ),
      );

      this.fromDate = date;
      this.startDate.set(
        this.dateTimeUtils.dateObjectToDateString(
          this.fromDate,
          this.displayFormat(),
        ),
      );
    } else {
      this.toDate = date;
      this.endDate.set(
        this.dateTimeUtils.dateObjectToDateString(
          this.toDate,
          this.displayFormat(),
        ),
      );
    }
    this.updateValue();
  }

  /**
   * Set from date
   * @param date NgbDate
   */
  setFromDate(date: NgbDate) {
    if (date.after(this.toDate)) {
      this.fromDate = this.toDate;
      this.startDate.set(
        this.dateTimeUtils.dateObjectToDateString(
          this.fromDate,
          this.displayFormat(),
        ),
      );

      this.toDate = date;
      this.endDate.set(
        this.dateTimeUtils.dateObjectToDateString(
          this.toDate,
          this.displayFormat(),
        ),
      );
    } else {
      this.fromDate = date;
      this.startDate.set(
        this.dateTimeUtils.dateObjectToDateString(
          this.fromDate,
          this.displayFormat(),
        ),
      );
    }
    this.updateValue();
  }

  setHoveredDate(date: NgbDate) {
    this.hoveredDate = date;
  }
  /**
   * Check is hover
   * @param date object NgbDate, date item
   * @returns boolean
   */
  isHovered(date: NgbDate) {
    return (
      this.fromDate &&
      !this.toDate &&
      this.hoveredDate &&
      ((date.after(this.fromDate) && date.before(this.hoveredDate)) ||
        (date.after(this.hoveredDate) && date.before(this.fromDate)))
    );
  }
  /**
   * Check is inside range
   * @param date object NgbDate, date item
   * @returns boolean
   */
  isInside(date: NgbDate) {
    return (
      this.toDate &&
      ((date.after(this.fromDate) && date.before(this.toDate)) ||
        (date.after(this.toDate) && date.before(this.fromDate)))
    );
  }

  /**
   * Check is belong range
   * @param date object NgbDate, date item
   * @returns boolean
   */
  isRange(date: NgbDate) {
    return (
      date.equals(this.fromDate) ||
      (this.toDate && date.equals(this.toDate)) ||
      this.isInside(date) ||
      this.isHovered(date)
    );
  }
  /**
   * Check is first date
   * @param date object NgbDate, date item
   * @returns boolean
   */
  isFirst(date: NgbDate) {
    return (
      (this.toDate && date.equals(this.fromDate) && date.before(this.toDate)) ||
      (date.equals(this.fromDate) &&
        date.before(this.hoveredDate) &&
        this.toDate === null) ||
      (this.fromDate &&
        this.toDate === null &&
        date.equals(this.hoveredDate) &&
        date.before(this.fromDate))
    );
  }
  /**
   * Check is last date
   * @param date object NgbDate, date item
   * @returns boolean
   */
  isLast(date: NgbDate) {
    return (
      (this.fromDate &&
        date.after(this.fromDate) &&
        date.equals(this.toDate)) ||
      (this.fromDate &&
        this.toDate === null &&
        ((date.after(this.fromDate) && date.equals(this.hoveredDate)) ||
          (date.after(this.hoveredDate) && date.equals(this.fromDate))))
    );
  }

  /**
   * Check is to day
   * @param date object NgbDate, date item
   * @returns boolean
   */
  isToday(date: NgbDate) {
    return (
      this.toDate && date.equals(this.fromDate) && date.equals(this.toDate)
    );
  }
  /**
   * Check date is belong current month
   * @param date object NgbDate, date item
   * @param currentMonth number, current month
   * @returns boolean
   */
  isCurrentMonth(date: NgbDate, currentMonth: number) {
    return date.month === currentMonth;
  }

  /**
   * Handle open dialog date picker
   */
  handleToggle() {
    this.fromDate = this.selfValue?.fromDate
      ? new NgbDate(
          this.selfValue.fromDate.year,
          this.selfValue.fromDate.month,
          this.selfValue.fromDate.day,
        )
      : undefined;
    this.startDate.set(
      this.selfValue?.fromDate
        ? this.dateTimeUtils.dateObjectToDateString(
            this.selfValue.fromDate,
            this.displayFormat(),
          )
        : undefined,
    );

    this.toDate = this.selfValue?.toDate
      ? new NgbDate(
          this.selfValue.toDate.year,
          this.selfValue.toDate.month,
          this.selfValue.toDate.day,
        )
      : undefined;
    this.endDate.set(
      this.selfValue?.toDate
        ? this.dateTimeUtils.dateObjectToDateString(
            this.selfValue.toDate,
            this.displayFormat(),
          )
        : undefined,
    );

    this.datePicker.toggle();
  }

  /**
   * Handle clear date in header of dialog date picker
   * @param type string
   */
  handleClearDate(type: string) {
    switch (type) {
      case 'all':
        this.startDate = null;
        this.endDate = null;
        this.fromDate = null;
        this.toDate = null;
        break;
      case 'start':
        this.startDate = null;
        this.fromDate = null;
        break;
      case 'end':
        this.endDate = null;
        this.toDate = null;
        break;
      default:
        break;
    }
    this.dateCleared.emit(type);
  }
}
