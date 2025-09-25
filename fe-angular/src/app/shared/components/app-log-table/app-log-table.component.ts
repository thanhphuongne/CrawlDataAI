import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  effect,
  input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { ColumnModel } from '@app/configs/models/column.models';
import { LogModel } from './model/log.model';
import {
  SCORING_COLUMNS,
  scoringCenter,
} from '@app/shared/constants/jobs/jobs.constant';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule  } from 'ng-zorro-antd/button';
import { NzIconModule, provideNzIconsPatch } from 'ng-zorro-antd/icon';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzImageModule } from 'ng-zorro-antd/image';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { SharedModule } from '@app/shared/shared.module';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { CheckSquareOutline, CloseSquareOutline } from '@ant-design/icons-angular/icons';

@Component({
  selector: 'app-app-log-table',
  templateUrl: './app-log-table.component.html',
  styleUrls: ['./app-log-table.component.scss'],
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
  providers: [provideNzIconsPatch([CheckSquareOutline, CloseSquareOutline])]
})
export class AppLogTableComponent implements AfterViewInit, OnChanges {
  columns: ColumnModel[] = SCORING_COLUMNS;
  records = input<Array<LogModel>>([]);
  pageSize = input<number>();
  isLoading = input.required<boolean>();
  headerCenter = scoringCenter;

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
