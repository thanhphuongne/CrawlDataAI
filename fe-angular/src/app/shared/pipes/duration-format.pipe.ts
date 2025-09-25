import { Pipe, PipeTransform } from '@angular/core';
import { DateTimeUtils } from '../utils/date-times.utils';

@Pipe({
  name: 'durationFormatPipe'
})
export class DurationFormatPipe implements PipeTransform {
  DateTimeUtils = new DateTimeUtils()
  transform(value: any) {
    return this.DateTimeUtils.formatDuration(value);
  }
}
