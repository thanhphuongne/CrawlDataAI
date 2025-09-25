import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output
} from '@angular/core';
import { CHART_FILTER_TIME_OPTIONS } from '@app/pages/dashboard/models/chart-filter.constant';
import { AppCardDirectiveModule } from '@app/shared/directives/app-card/app-card.directive.module';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-time-filter-tab',
  templateUrl: './time-filter-tab.component.html',
  styleUrl: './time-filter-tab.component.scss',
  standalone: true,
  imports: [CommonModule, TranslateModule, AppCardDirectiveModule]
})
export class AppTimeFilterTabComponent implements OnInit, OnChanges {
  @Input() default: number = CHART_FILTER_TIME_OPTIONS.thisWeek.value;
  @Output() onChange = new EventEmitter<number>();
  filterTime = Object.values(CHART_FILTER_TIME_OPTIONS);
  currentTypeTime: number;
  ngOnInit(): void {
    this.currentTypeTime = this.default;
    this.onChange.emit(this.default);
  }

  ngOnChanges() {
    this.currentTypeTime = this.default;
  }
  /**
   *
   * @param val number, current filter val
   */
  switchFilterTime(val: number) {
    if (val !== this.currentTypeTime) {
      this.currentTypeTime = val;
      this.onChange.emit(val);
    }
  }
}
