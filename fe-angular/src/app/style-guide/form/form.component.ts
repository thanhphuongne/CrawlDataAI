import { Component } from '@angular/core';
import { DateRangeStruct } from '@app/shared/models/date-range-struct.model';
import { DateTimeStruct } from '@app/shared/models/date-time-struct.model';

@Component({
  selector: 'app-styleguilde-form',
  templateUrl: './form.component.html'
})
export default class FormStyleGuideComponent {
  dateVal: DateTimeStruct = {
    year: 2023,
    month: 5,
    day: 10,
    hour: 10,
    second: 20,
    minute: 30
  };
  dateRange: DateRangeStruct = {
    fromDate: { year: 2023, month: 9, day: 25 },
    toDate: { year: 2023, month: 9, day: 30 }
  };
  constructor() {}
}
