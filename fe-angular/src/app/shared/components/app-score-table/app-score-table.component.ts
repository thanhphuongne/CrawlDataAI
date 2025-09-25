import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  effect,
  EventEmitter,
  input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SharedModule } from '@app/shared/shared.module';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzImageModule } from 'ng-zorro-antd/image';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { ColumnModel } from '@app/configs/models/column.models';
import {
  RANK_COLUMNS,
  rankCenter,
} from '@app/shared/constants/jobs/jobs.constant';
import { RankModel } from './model/rank.model';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';

@Component({
  selector: 'app-app-score-table',
  templateUrl: './app-score-table.component.html',
  styleUrls: ['./app-score-table.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzTableModule,
    NzDropDownModule,
    NzInputModule,
    NzButtonModule,
    NzIconModule,
    NzCheckboxModule,
    NzMenuModule,
    NzTagModule,
    NzPaginationModule,
    NzSelectModule,
    NzImageModule,
    NzToolTipModule,
    SharedModule,
    NzAvatarModule,
  ],
})
export class AppScoreTableComponent implements AfterViewInit, OnChanges {
  columns: ColumnModel[] = RANK_COLUMNS;
  records = input<Array<RankModel>>([]);
  pageSize = input<number>();
  isLoading = input.required<boolean>();
  headerCenter = rankCenter;

  constructor(private cdr: ChangeDetectorRef) {
    effect(() => {
      this.cdr.detectChanges();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.cdr.detectChanges();
  }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }
}
