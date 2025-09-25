import { Injectable } from '@angular/core';
import {
  NgbDateParserFormatter,
  NgbDateStruct
} from '@ng-bootstrap/ng-bootstrap';
import { DateFormatEnum } from './date-times.utils';
import moment from 'moment';

@Injectable()
export class DatePickerFormatter extends NgbDateParserFormatter {
  readonly DT_FORMAT = DateFormatEnum.DEFAULT_FORMAT;
  parse(value: string): NgbDateStruct | null {
    if (value) {
      const dateParts = value.trim().split('/');
      const dateObj: NgbDateStruct = {
        day: null,
        month: null,
        year: null
      };
      const dateLabels = Object.keys(dateObj);

      dateParts.forEach((datePart, idx) => {
        dateObj[dateLabels[idx]] = parseInt(datePart, 10) || null;
      });
      return dateObj;
    }
    return null;
  }

  format(date: NgbDateStruct | null): string {
    if (!date) {
      return '';
    }
    const mdt = moment([date.year, date.month - 1, date.day]);
    if (!mdt.isValid()) {
      return '';
    }
    return mdt.format(this.DT_FORMAT);
  }
}
