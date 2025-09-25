import { Pipe, PipeTransform } from '@angular/core';
import { DateTimeUtils } from '../utils/date-times.utils'

@Pipe({
  name: 'dateTimeFormatPipe'
})
export class DateTimeFormatPipe implements PipeTransform {
  DateTimeUtils = new DateTimeUtils()
  transform(value: any, dateFormat: string) {
    return this.DateTimeUtils.formatTimeinString(value, dateFormat);
  }
}
