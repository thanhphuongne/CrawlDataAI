import { ChangeDetectorRef, Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  FilterMode,
  ViewMode,
} from '@app/shared/constants/enums/view-mode.enum';
import {
  DateFormatEnum,
  DateTimeUtils,
} from '@app/shared/utils/date-times.utils';
import { ToastrService } from 'ngx-toastr';
import {
  FilterTagModel,
  PopupModel,
  UserInfoModel,
} from '@app/shared/components/app-user-management-table/model/app-agent-table.model';
import {
  ROLE_OPTIONS,
  STATUS_OPTION,
} from '@app/shared/constants/user-management/user-management.constant';
import { PopupType } from '@app/shared/components/popup/enum/popup.enum';
import { cloneArrayObject, isNotBlank } from '@app/shared/utils/comon.utils';
import { userManagementStatus } from '@app/shared/components/app-user-management-table/enum/app-agent-table.enum';
import { UserService } from '@app/open-api/services';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss',
})
export class UserManagementComponent implements OnInit {
  isVisible = false;
  mode: ViewMode = ViewMode.VIEW;
  viewModeEnum: typeof ViewMode = ViewMode;
  createdDate = null;
  popupContent: PopupModel = null;
  isShowPopup: boolean = false;
  passwordVisible = false;
  isLoading = signal(false);
  selectedCardInfo: string;
  selectedTournament: string;

  listRecord: Array<UserInfoModel>;
  roleOptions = ROLE_OPTIONS;
  statusOptions = STATUS_OPTION;
  idSelected: string;

  totalRecord = 0;
  limit = 10;
  offset = 1;

  startDate: Date = null;

  searchValue = '';
  detectChanges = signal(false);

  dateUtils = new DateTimeUtils();
  dateDisplayFormat = DateFormatEnum;
  isShowDatePicker = signal(false);
  tagValues = signal<Set<FilterTagModel>>(new Set<FilterTagModel>());
  isOpenDropdownRoles = false;
  isOpenDropdownStatus = false;
  connectIPStatus = signal(false);
  checkConnectIP = false;
  userForm!: FormGroup;
  currentJobStatus = signal<string>('');

  filter = {
    roles: null,
    status: null,
  };

  constructor(
    private fb: FormBuilder,
    // private usersService: UserService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef,
  ) {
    this.userForm = this.fb.group({
      id: [''],
      userName: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(100),
          Validators.pattern(/^[a-zA-Z0-9]+$/), // Chỉ cho phép chữ cái và số
        ],
      ],
      passWord: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(100),
        ],
      ],
      fullName: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(100),
        ],
      ],
      role: ['', Validators.required],
      status: ['', Validators.required],
    });

    this.roleOptions = cloneArrayObject(ROLE_OPTIONS);
    this.statusOptions = cloneArrayObject(STATUS_OPTION);
  }

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  showModal(mode: ViewMode, data?: any): void {
    this.mode = mode;
    if (mode === ViewMode.EDIT || mode === ViewMode.VIEW) {
      if (data)
        this.userForm.patchValue({
          id: data.id,
          userName: data.username,
          passWord: null,
          fullName: data.full_name,
          role: data.department,
          status: data.is_active ? 'ACTIVE' : 'INACTIVE',
        });
    } else {
      this.userForm.reset();
    }
    if (mode === ViewMode.VIEW) {
      this.userForm.disable();
    } else {
      this.userForm.enable();
    }
    this.isVisible = true;
  }

  handleCancel(): void {
    this.isVisible = false;
  }

  // Helper method to check field errors
  isFieldInvalid(field: string): boolean {
    const control = this.userForm.get(field);
    return control?.invalid && (control.dirty || control.touched);
  }

  watchJobLogs = () => {
    console.log('Go to Job Logs Details');
  };

  toggleDetectChanges() {
    this.detectChanges.update((currentValue) => !currentValue); // Đảo trạng thái
    this.isLoading.set(!this.isLoading());
  }

  onClearFilters() {
    this.tagValues.set(new Set());
    this.statusOptions.map((item) => (item.selected = false));
    this.roleOptions.map((item) => (item.selected = false));
    this.getUserList(null);
  }

  onSearchChange() {
    this.refreshPage();
  }

  onMethodToggle(method: any) {
    method.selected = !method.selected;
  }

  onStatusToggle(status: any) {
    status.selected = !status.selected; // Đảo trạng thái
    // this.updateFilterStatus();
  }

  ngOnInit(): void {
    this.refreshPage();
  }

  async createUpdateUser() {
    if (this.userForm.invalid) {
      Object.values(this.userForm.controls).forEach((control) =>
        control.markAsTouched(),
      );
      return;
    }

    const userData = {
      username: this.userForm.get('userName')?.value,
      password: this.userForm.get('passWord')?.value,
      full_name: this.userForm.get('fullName')?.value,
      department: this.userForm.get('role')?.value?.toUpperCase(),
      is_active: this.userForm.get('status')?.value === 'ACTIVE',
      is_staff: true,
      is_superuser: this.userForm.get('role')?.value === 'ADMIN',
    };

    this.isLoading.set(true);
    try {
      if (this.mode === ViewMode.CREATE) {
        try {
          const response = null;
          // const response = await this.usersService
          //   .usersCreate({ body: userData })
          //   .toPromise();
          if (response) {
            console.log('Tạo mới User successfully:', response);
            this.toastr.success('Tạo mới User thành công!');
            this.refreshPage();
            this.isVisible = false;
          }
        } catch (error) {
          console.error('Tạo mới User failed:', error.message || error);
          this.toastr.error(
            `Tạo mới User thất bại: ${error.message || 'Unknown error'}`,
          );
        }
      } else if (this.mode === ViewMode.EDIT) {
        const params = {
          body: {
            id: this.userForm.get('id')?.value,
            password: this.userForm.get('passWord')?.value
              ? this.userForm.get('passWord')?.value
              : null,
            full_name: this.userForm.get('fullName')?.value,
            is_active: this.userForm.get('status')?.value === 'ACTIVE',
            is_staff: true,
            department: this.userForm.get('role')?.value?.toUpperCase(),
            is_superuser: this.userForm.get('role')?.value === 'ADMIN',
          },
        };

        try {
          const response = null;
          // const response = await this.usersService
          //   .usersEditUser(params)
          //   .toPromise();
          {
            console.log('Sửa User successfully:', response);
            this.toastr.success('Sửa User thành công!');
            this.refreshPage();
            this.isVisible = false;
          }
        } catch (error) {
          console.error('Sửa User failed:', error.message || error);
          this.toastr.error(
            `Sửa User thất bại: ${error.message || 'Unknown error'}`,
          );
        }
      }
    } catch (error) {
      console.error('Unexpected error:', error.message || error);
      this.toastr.error('Đã xảy ra lỗi không xác định.');
    } finally {
      this.isLoading.set(false);
    }
  }

  onDelete(record: any) {
    this.idSelected = record.id;
    this.popupContent = {
      type: PopupType.CONFIRM_DELETE,
      title: 'Xóa User',
      content: 'Bạn có chắc chắn muốn xóa User này không?',
    };
    this.isShowPopup = true;
  }

  confirmActions = (type: PopupType) => {
    if (!this.idSelected) {
      this.toastr.error('Không tìm thấy ID của user cần xóa');
      return;
    }

    // const params: UsersDeleteUser$Params = { id: this.idSelected };
    // this.usersService.usersDeleteUser(params).subscribe({
    //   next: () => {
    //     this.refreshPage();
    //     this.toastr.success('Xóa user thành công');
    //   },
    //   error: (err) => {
    //     console.error('Delete user error:', err);
    //     this.toastr.error('Xóa user thất bại');
    //   },
    // });
  };

  getUserList(params: any) {
    this.isLoading.set(true);
    // this.usersService.usersListUserRead(params).subscribe({
    //   next: (data: any) => {
    //     this.isLoading.set(false);
    //     this.totalRecord = data.count;
    //     this.listRecord = data.results;
    //   },
    //   error: (error) => {
    //     console.error('Error fetching users:', error);
    //     this.isLoading.set(false);
    //   },
    // });
  }

  buildSearchParams = () => {
    const params: any = {
      limit: this.limit,
      offset: this.limit * (this.offset - 1),
    };

    if (isNotBlank(this.searchValue)) {
      params.username = this.searchValue;
    }

    const role: string[] = [];
    const status: string[] = [];

    if (this.tagValues().size > 0) {
      for (const item of this.tagValues()) {
        switch (item.type) {
          case FilterMode.ROLE:
            role.push(item.value.toUpperCase());
            break;
          case FilterMode.STATUS:
            status.push(this.getKeysFromUserManagementStatusValue(item.value));
            break;
          default:
            break;
        }
      }
    }

    if (role.length > 0) {
      params.role = role.join();
    }

    if (status.length > 0) {
      params.status = status.join();
    }
    return params;
  };

  getKeysFromUserManagementStatusValue = (value: string) => {
    const keys = Object.keys(userManagementStatus);
    for (const key of keys) {
      if (userManagementStatus[key] == value) {
        return key;
      }
    }
  };

  getTitleModal = () => {
    switch (this.mode) {
      case ViewMode.CREATE:
        return 'Tạo User';
      case ViewMode.EDIT:
        return 'Chỉnh sửa User';
      default:
        return 'Chi tiết User';
    }
  };

  getDescModal = () => {
    switch (this.mode) {
      case ViewMode.CREATE:
        return 'Nhập thông tin để tạo User';
      default:
        return 'Thông tin chi tiết User';
    }
  };

  editMode() {
    this.connectIPStatus.set(true);
    this.showModal(ViewMode[ViewMode.EDIT]);
  }

  onApplyFilters() {
    this.refreshPage();
  }

  onchangeRoles(role: any) {
    role.selected = !role.selected;
    const rolesFitler: FilterTagModel = {
      type: FilterMode.ROLE,
      value: role.label,
      selectedId: role.id,
    };

    if (role.selected) {
      this.addSearchParams(rolesFitler);
    } else {
      this.closeTag(rolesFitler);
    }
  }

  onchangeStatus(status: any) {
    status.selected = !status.selected;
    const methodFitler: FilterTagModel = {
      type: FilterMode.STATUS,
      value: status.label,
      selectedId: status.id,
    };

    if (status.selected) {
      this.addSearchParams(methodFitler);
    } else {
      this.closeTag(methodFitler);
    }
  }

  closeTag = (tag: FilterTagModel) => {
    this.tagValues.update((values: Set<FilterTagModel>) => {
      values.forEach((item: FilterTagModel) => {
        if (item.value === tag.value) {
          values.delete(item);
        }
      });
      return values;
    });

    switch (tag.type) {
      case FilterMode.FROM_DATE:
        this.startDate = null;
        break;
      case FilterMode.ROLE:
        this.roleOptions[tag.selectedId].selected = false;
        break;
      default:
        this.statusOptions[tag.selectedId].selected = false;
        break;
    }

    if (this.tagValues().size == 0) {
      this.refreshPage();
    }
  };

  addSearchParams = (infor: FilterTagModel) => {
    if (this.isExistingInSet(infor.value)) {
      return;
    }
    this.tagValues.update((values: Set<FilterTagModel>) => {
      values.add(infor);
      return values;
    });
  };

  private isExistingInSet = (value: string) => {
    let isExist = false;
    this.tagValues().forEach((item: FilterTagModel) => {
      if (item.value === value) {
        isExist = true;
      }
    });
    return isExist;
  };

  openDialog(event: any): void {
    if (event.mode === ViewMode.VIEW) {
      this.showModal(ViewMode[ViewMode.VIEW], event.data);
    } else if (event.mode === ViewMode.EDIT) {
      this.userForm.get('passWord')?.clearValidators();
      this.userForm.get('passWord')?.updateValueAndValidity();
      this.showModal(ViewMode[ViewMode.EDIT], event.data);
    }
  }

  handleDelete(data: any) {}

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit',
    }).format(date);
  }

  pageSizeChange = (page: number) => {
    this.offset = page;
    this.cdr.detectChanges();
    this.refreshPage();
  };

  pageTotalSizeChange = (size: number) => {
    this.limit = size;
    this.cdr.detectChanges();
    this.refreshPage();
  };

  refreshPage = () => {
    const params = this.buildSearchParams();
    console.log('Search Params: ', params);
    this.getUserList(params);
  };
}
