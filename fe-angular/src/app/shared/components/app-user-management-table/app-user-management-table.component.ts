import {
  Component,
  EventEmitter,
  Input,
  input,
  Output,
  signal,
  ViewChild,
} from '@angular/core';
import { ColumnModel } from '@app/configs/models/column.models';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { USER_MANAGEMENT_COLUMNS } from '@app/configs/column.constant';
import { ViewMode } from '@app/shared/constants/enums/view-mode.enum';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { UserInfoModel } from './model/app-agent-table.model';
import { PermissionDirective } from '@app/core/directives/permission.directive';
import { SharedModule } from '../../shared.module';
import { rankCenter } from '@app/shared/constants/jobs/jobs.constant';

@Component({
  selector: 'app-user-management-table',
  templateUrl: './app-user-management-table.component.html',
  styleUrls: ['./app-user-management-table.component.scss'],
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
    NzModalModule,
    PermissionDirective,
    SharedModule,
  ],
})
export class AppUserManagementTableComponent {
  @Output() openDialog: EventEmitter<any> = new EventEmitter();
  @Output() deleteRecord: EventEmitter<any> = new EventEmitter();
  columns: ColumnModel[] = USER_MANAGEMENT_COLUMNS;
  @Input() usersInfo: Array<UserInfoModel> = [];
  listFilterData = signal<Array<UserInfoModel>>([]);
  isLoading = input.required<any>();
  headerCenter = rankCenter;
  isVisible = false;

  constructor() {}

  onClickName(data: UserInfoModel): void {
    this.openDialog.emit({ data: data, mode: ViewMode.VIEW });
  }

  onEdit(data: any) {
    this.openDialog.emit({ data: data, mode: ViewMode.EDIT });
  }

  onDelete(record: any) {
    this.deleteRecord.emit(record);
  }

  getStatusColors = (status: boolean) => (status ? '#00b69b' : '#ef3826');
}
