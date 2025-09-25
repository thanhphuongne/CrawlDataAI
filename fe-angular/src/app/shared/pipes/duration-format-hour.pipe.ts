import { Pipe, PipeTransform } from '@angular/core';
import { DateTimeUtils } from '../utils/date-times.utils';

@Pipe({
  name: 'durationFormatHourPipe'
})
export class DurationFormatHourPipe implements PipeTransform {
  DateTimeUtils = new DateTimeUtils()
  transform(value: any) {
    return this.DateTimeUtils.formatDurationToHour(value);
  }
}
