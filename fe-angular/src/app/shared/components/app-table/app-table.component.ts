import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, input, OnChanges, OnInit, output, SimpleChanges } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AppIconComponent } from '../icon/icon.component';
import { AppPaginationComponent } from '../app-pagination/app-pagination.component';
import { PaginationModel } from '../app-pagination/model/app-pagination.model';
import { AppSkeletonComponent } from '../skeleton/skeleton.component';
import { ColumnDataModel } from './model/app-table.model';
import { PermissionDirective } from '@app/core/directives/permission.directive';
import { AppNoDataComponent } from '../app-no-data/app-no-data.component';
import { LicenseDirective } from '@app/core/directives/license.directive';

@Component({
  selector: 'app-table',
  templateUrl: './app-table.component.html',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    AppIconComponent,
    AppPaginationComponent,
    AppSkeletonComponent,
    PermissionDirective,
    LicenseDirective,
    AppNoDataComponent,
  ],
})
export class AppTableComponent implements OnChanges {
  columnData = input.required<Array<ColumnDataModel>>();
  getDataParams = input<any>();
  totalRecord = input<number>(0);
  listRecord = input.required<Array<any>>();
  isLoading = input.required<boolean>();
  loopArray = Array.from({ length: 3 });
  pageChange = output<PaginationModel>();

  constructor(private readonly translate: TranslateService, private cdr: ChangeDetectorRef) { }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.columnData || changes.listRecord || changes.isLoading) {
      this.cdr.detectChanges();
    }
  }

  pageChangeEvent(ev: PaginationModel) {
    this.pageChange.emit({
      pageIndex: ev.pageIndex,
      pageSize: ev.pageSize,
    });
  }
}
