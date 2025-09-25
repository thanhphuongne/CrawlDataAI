import { Component, model, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { GROUP_PERMISSIONS_DATA } from '@app/configs/group-permissions-data.constants';
import { PERMISSIONS_DATA } from '@app/configs/permissions-data.constants';
import { SITE_ROUTE} from '@app/configs/site-route.contants';
import { CredentialsService } from '@app/core';
import { UserModel } from '@app/core/models/user.model';
import { ChangeStatusModel } from '@app/open-api/common/models/change-status-model';
import { DepartmentSaveModel } from '@app/open-api/common/models/department-save-model';
import { UserImageModel } from '@app/open-api/common/models/user-image-model';
import { UserSaveModel } from '@app/open-api/common/models/user-save-model';
import { PaginationModel } from '@app/shared/components/app-pagination/model/app-pagination.model';
import { ERRORS_CONSTANT } from '@app/shared/constants/error.constants';
import { VALIDATOR_REGEX_CONSTANT } from '@app/shared/constants/regex.constant';
import { SvgIcon } from '@app/shared/constants/svg-icon.constant';
import { confirmDailog } from '@app/shared/utils/confirm-dailog.ultils';
import {
  DateFormatEnum,
  DateTimeUtils,
} from '@app/shared/utils/date-times.utils';
import { checkPermissionRow } from '@app/shared/utils/permission.utils';
import { VALIDATORS_UTILS } from '@app/shared/utils/validator.utils';
import { NgbDateStruct, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { SweetAlertOptions } from 'sweetalert2';
import * as XLSX from 'xlsx';
import { OBJECT_FILTER_CONST } from '../models/employees.constant';
import {
  GetListEmployeeModel,
  UserInfoModelExt,
} from '../models/employees.model';
import { GENDER_CONSTANT } from '../models/gender.constant';
import { USER_TYPE_SELECT_CONSTANT } from '../models/user-type.constant';
import { UserTypeEnum } from '../models/user-type.enum';
import { EmployeesService } from '../services/employees.services';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss'],
})
export class EmployeesComponent implements OnInit {
  isLoading = signal<boolean>(false);
  listUsers = signal<UserInfoModelExt[]>([]);
  totalUsers = signal<number>(0);
  icons = SvgIcon;
  listOptionFilter = signal<any[]>([]);
  listDepartmentSyncData = signal<number[]>([]);
  errorCreateUser = signal<string>('');
  listErrors = ERRORS_CONSTANT;
  gender = GENDER_CONSTANT;
  userTypeEnum = UserTypeEnum;
  userTypeSelectConstant = USER_TYPE_SELECT_CONSTANT;
  getUserparams = signal<GetListEmployeeModel>({
    CustomerId: 0,
    UserType: 3,
    Status: 1,
  });
  checkedLoginPermission = signal<boolean>(false);
  dateTimeUtils = new DateTimeUtils();
  selectedUser = signal<UserInfoModelExt>(undefined);
  maxDate: NgbDateStruct;
  modalView = signal<'info' | 'image'>('info');
  userForm: FormGroup;
  passwordForm: FormGroup;
  creatingUser = signal<boolean>(false);
  onCreateNewUser = signal<boolean>(false);
  listInActions = signal<number[]>([]);
  files = signal<File[]>([]);
  userImages = signal<UserImageModel[]>([]);
  listRemovedImages = signal<UserImageModel[]>([]);
  maxFiles = 6;
  minFiles = 1;
  uploadMessage = signal<string>('');
  userCustomerId = signal<number>(0);
  userType = signal<number>(0);
  importError = signal<string>('');
  importingUser = signal(false);
  importFile = signal<File[]>([]);
  listDepartments = signal<DepartmentSaveModel[]>([]);
  selectedDepartmentIdForm = signal<number[]>([]);
  idDepartmentImport = signal<number>(0);
  idDepartmentImportModel = model(this.idDepartmentImport);
  elementCheckStatus = signal<any>({});
  userInfo = signal<UserModel>(undefined);
  groupPermision = GROUP_PERMISSIONS_DATA;
  permissionList = PERMISSIONS_DATA.user;
  isCreateUpdateUser = signal<boolean>(false);
  originRoute = "";
  type = signal<string>('');
  dateDisplayFormat = DateFormatEnum;
  isSyncing = signal<boolean>(false);
  constructor(
    private readonly modalService: NgbModal,
    private readonly formBuilder: FormBuilder,
    private readonly toastr: ToastrService,
    private readonly translate: TranslateService,
    private readonly employeeService: EmployeesService,
    private readonly sanitizer: DomSanitizer,
    private readonly activedRoute: ActivatedRoute,
    private readonly credentialService: CredentialsService,
  ) {
    this.userForm = this.formBuilder.group({
      userName: [''],
      password: [
        '',
        [Validators.required, VALIDATORS_UTILS.passwordStrengthValidator],
      ],
      departmentId: [null],
      firstName: [''],
      lastName: [''],
      email: ['', [Validators.required]],
      phoneNumber: ['', [VALIDATORS_UTILS.phoneNumberValidator]],
      isEnableLogin: [''],
      gender: [this.gender.male.value, [Validators.required]],
      dateOfBirth: ['null'],
      address: [''],
      jobTitle: [''],
      userType: [''],
      citizenIdentityCard: [''],
      startTime: [''],
      endTime: [''],
      description: [''],
    });

    this.passwordForm = this.formBuilder.group({
      password: [
        '',
        [Validators.required, VALIDATORS_UTILS.passwordStrengthValidator],
      ],
      confirmPassword: ['', [Validators.required]],
    });
    this.uploadMessage.set(
      `${this.translate.instant(
        'File supported: jpg, jpeg, png. Minimum',
      )} ${this.minFiles} ${this.translate.instant('files, maximum')} ${
        this.maxFiles
      } ${this.translate.instant('files')}`,
    );
  }
  ngOnInit(): void {
    const dateObj = moment().toObject();
    this.maxDate = {
      year: dateObj.years,
      month: dateObj.months,
      day: dateObj.date,
    };
    this.userInfo.set(this.credentialService.getUserInfoFromToken());
    this.userCustomerId.set(this.credentialService.activeCustomerId);
    this.userType.set(+this.userInfo().userType);

    this.activedRoute.paramMap.subscribe((params: ParamMap) => {
      this.type.set(params.get('type') || null);
      if (this.type() === 'employees') {
        this.userForm.controls['userName'].setValidators([
          Validators.required,
          VALIDATORS_UTILS.userNameValidator,
        ]);
        this.userForm.controls['departmentId'].setValidators([
          Validators.required,
        ]);
        this.userForm.controls['email'].setValidators([
          Validators.required,
          Validators.email,
        ]);
        this.userForm.controls['citizenIdentityCard'].clearValidators();
      } else {
        this.userForm.controls['userName'].clearValidators();
        this.userForm.controls['departmentId'].clearValidators();
        this.userForm.controls['email'].clearValidators();
        this.userForm.controls['citizenIdentityCard'].setValidators([
          Validators.required,
        ]);
      }
      this.userForm.controls['userName'].updateValueAndValidity();
      this.userForm.controls['departmentId'].updateValueAndValidity();
      this.userForm.controls['citizenIdentityCard'].updateValueAndValidity();
      this.userForm.controls['email'].updateValueAndValidity();
      this.getUserparams.set({
        CustomerId: 0,
        PageIndex: 1,
        Status: 1,
        UserType: this.getUserType(),
      });
      this.listOptionFilter.set(
        this.userType() === 1 && this.userCustomerId()
          ? OBJECT_FILTER_CONST.employeesSelectedCus
          : OBJECT_FILTER_CONST[this.type()],
      );
    });
  }
  /**
   * open sync data modal
   * @param modal sync data modal
   */
  openSyncDataModal(modal: any) {
    if (this.userCustomerId() !== 0 && this.type() === 'blacklist') {
      this.confirmSyncData();
    } else {
      this.modalService.open(modal, {
        backdrop: 'static',
        centered: true,
        size: 'md',
      });
    }
  }
  /**
   * close sync data modal
   */
  closeSyncDataModal() {
    this.modalService.dismissAll();
    this.listDepartmentSyncData.set([]);
  }
  /**
   * confirm sync data
   */
  confirmSyncData() {
    confirmDailog(
      {
        confirmButtonText: this.translate.instant('Sync'),
        html: 'Are you sure sync data to box?',
      },
      'primary',
      this.onSyncData(),
    );
  }

  /**
   * on Sync data
   */
  onSyncData() {
    const params = {
      customerId: this.getUserparams().CustomerId,
      listDepartmentId: this.listDepartmentSyncData,
    };
    this.isSyncing.set(true);
    this.employeeService.syncData(params).subscribe((result: any) => {
      if (result) {
        const res = JSON.parse(result);
        if (res.success) {
          this.toastr.success('Sync employee data successfully!');
          this.closeSyncDataModal();
          this.isSyncing.set(false);
        } else {
          this.isSyncing.set(false);

          this.closeSyncDataModal();
          this.toastr.error('Unable sync employee data, please try again!');
        }
      }
    });
  }

  /**
   * Set department id
   * @param list list id department
   */
  onDepartmentSelect(list: Array<number>) {
    this.selectedDepartmentIdForm.set(list);
  }

  /**
   * Execute search user
   */
  searchUser(value: any) {
    this.originRoute = this.originRoute + value.customerId;
    if (value?.pageSize)
      this.getUserparams.update((obj) => ({
        ...obj,
        PageSize: value.pageSize,
      }));
    this.getUserparams.set({
      ...this.getUserparams(),
      CustomerId: value.customerId || null,
      DepartmentId: value.departmentId || null,
      Keyword: value.keyword || null,
      PageIndex: +value.page || 1,
      Status: value.status,
    });
    this.getListUser(this.getUserparams());
    this.selectedDepartmentIdForm.set([]);
  }
  /**
   * get filter option data
   * @param data filter data
   */
  onFilterGetOptions(data: any) {
    this.listDepartments.set(
      data.listDepartments ? [...data.listDepartments] : [],
    );
    this.updateListUser();
  }

  /**
   * Execute change page
   * @param ev page number
   */
  changeNumberPage(ev: PaginationModel) {
    this.getUserparams.update((obj) => ({
      ...obj,
      PageIndex: ev.pageIndex,
      PageSize: ev.pageSize,
    }));
    this.getListUser(this.getUserparams());
  }

  /**
   * Get list user
   * @param params GetListEmployeeModel
   */
  getListUser(params: GetListEmployeeModel = this.getUserparams()) {
    this.isLoading.set(true);
    this.employeeService.getAllEmployee(params).subscribe({
      next: (result: any) => {
        this.isLoading.set(false);
        const res = JSON.parse(result);
        if (res) {
          this.listUsers.set(res?.data || []);
          this.totalUsers.set(res?.metaData?.totalItems);
          this.getUserparams.update((obj) => ({
            ...obj,
            PageIndex: res?.metaData?.currentPage,
          }));
          this.updateListUser();
        }
      },
      error: () => {
        this.isLoading.set(false);
        this.listUsers.set([]);
        this.totalUsers.set(0);
      },
    });
  }

  /**
   * Update department name for list user
   */
  updateListUser() {
    if (this.listDepartments().length > 0) {
      this.listUsers.set(
        this.listUsers().map((ele: any) => {
          return {
            ...ele,
            departmentName: this.listDepartments().filter(
              (item: any) => item.id === ele.departmentId,
            )[0]?.name,
          };
        }),
      );
    }
  }

  /**
   * Active, deactivated user.
   * @param element current element
   * @param user current model of user
   */
  changeUserStatus(element: any, user: UserInfoModelExt) {
    const userStatusModel: ChangeStatusModel = {
      id: user.id,
      status: element.checked ? 1 : 2,
      userName: user.userName,
    };
    this.setInAction(user.id, true);
    this.employeeService.changeEmployeeStatus(userStatusModel).subscribe({
      next: (res: any) => {
        const result = JSON.parse(res);
        if (result.success) {
          this.toastr.success(
            this.translate.instant('Status of user changed successfully!'),
          );
          element.checked = !element.checked;
          this.listUsers.set(
            this.listUsers().map((item: UserSaveModel) => {
              if (item.id === user.id) {
                item.status = userStatusModel.status;
              }
              return item;
            }),
          );
        } else {
          this.toastr.error(result.message);
        }
        this.setInAction(user.id, false);
      },
      error: () => {
        this.toastr.success(
          this.translate.instant(this.listErrors.GENERAL.UNEXPECTED_ERROR),
        );
        this.setInAction(user.id, false);
      },
    });
  }

  /**
   * Enable, Disable User's Login Permission.
   * @param element current element
   * @param user current model of user
   */
  changeUserLoginPermission(
    employee: UserInfoModelExt,
    modal: any,
    element: any,
  ) {
    this.userForm.get('isEnableLogin').setValue(this.checkedLoginPermission());

    this.checkedLoginPermission.set(element.checked);
    this.elementCheckStatus.set(element);
    const userEnableLoginModel: any = {
      userId: employee.id,
      isEnableLogin: element.checked,
    };

    this.employeeService.changeEnableLogin(userEnableLoginModel).subscribe({
      next: (result: any) => {
        const res = JSON.parse(result);
        if (res.success) {
          element.checked = !element.checked;
          if (element.checked) {
            this.openChangePasswordModal(modal, employee);
          } else {
            this.toastr.success('Restrict user login successfully!');
            this.getListUser(this.getUserparams());
          }
        } else {
          this.toastr.error(result.message);
        }
      },
      error: () => {
        this.creatingUser.set(false);
      },
    });
  }

  /**
   * Execute create, update user. Create user if userId undefined
   * @param userId number, id of user
   * @returns void
   */
  createUpdateUser(isUpdatePassword: boolean, userId?: number) {
    if (
      (isUpdatePassword && this.passwordForm.invalid) ||
      (!isUpdatePassword && (this.userForm.invalid || this.creatingUser()))
    ) {
      return;
    }

    this.errorCreateUser.set(undefined);
    this.creatingUser.set(true);

    const params: UserSaveModel = {
      userName:
        this.type() === 'employees'
          ? this.userForm.get('userName').value
          : this.userForm.get('citizenIdentityCard').value,
      firstName: this.userForm.get('firstName').value,
      lastName: this.userForm.get('lastName').value,
      gender: this.userForm.get('gender').value
        ? this.userForm.get('gender').value
        : GENDER_CONSTANT.female.value,
      email: this.userForm.get('email').value,
      phoneNumber: this.userForm.get('phoneNumber').value,
      address: this.userForm.get('address').value,
      dateOfBirth:
        this.dateTimeUtils.dateObjectToDateString(
          this.userForm.get('dateOfBirth').value,
          DateFormatEnum.SYSTEM_FORMAT,
        ) || null,
      customerId: this.getUserparams().CustomerId,
      departmentId: this.userForm.get('departmentId').value || 0,
      isEnableLogin: !!this.userForm.get('isEnableLogin').value,
      password: this.passwordForm.get('password').value || '',
      jobTitle: this.userForm.get('jobTitle').value,
      userType: this.userForm.get('userType').value,
      citizenIdentityCard:
        this.type() === 'employees'
          ? this.userForm.get('userName').value
          : this.userForm.get('citizenIdentityCard').value,
      startTime: this.userForm.get('startTime').value
        ? this.dateTimeUtils.dateObjectToTimeStamp(
            this.userForm.get('startTime').value,
          )
        : null,
      endTime: this.userForm.get('endTime').value
        ? this.dateTimeUtils.dateObjectToTimeStamp(
            this.userForm.get('endTime').value,
          )
        : null,
      description: this.userForm.get('description').value,
    };

    let success = 'New user added successfully!';
    let error = 'Unable created new user, please try again!';
    if (userId) {
      params.id = userId;
      success = 'User updated successfully!';
      error = 'Unable updated user, please try again!';
    } else {
      params.password = this.userForm.get('password').value;
      params.status = 1;
    }
    this.employeeService.addUpdateEmployee(params).subscribe({
      next: (result: any) => {
        const res = JSON.parse(result);
        this.creatingUser.set(false);
        this.isCreateUpdateUser.set(false);
        if (res.success) {
          this.toastr.success(this.translate.instant(success));
          if (this.selectedUser()?.id) {
            this.modalService.dismissAll();
          } else {
            this.selectedUser.set(res.data);
            this.modalView.set('image');
          }
          this.getListUser();
          this.userForm.reset({ gender: GENDER_CONSTANT.male.value });
        } else {
          this.errorCreateUser.set(res.message);
        }
      },
      error: () => {
        this.creatingUser.set(false);
        this.toastr.error(this.translate.instant(error));
      },
    });
  }

  /**
   * Get all images of user by user id
   */
  getListImagesOfUser(userId: number) {
    this.employeeService.getImagesOfEmployee(userId).subscribe({
      next: (result: any) => {
        const res = JSON.parse(result);
        if (res.success) {
          this.userImages.set(res.data);
        } else {
          this.toastr.error(
            this.translate.instant('Unable load images of user!'),
          );
        }
      },
      error: () => {
        this.toastr.error(
          this.translate.instant(ERRORS_CONSTANT.GENERAL.UNEXPECTED_ERROR),
        );
      },
    });
  }

  /**
   * Upload image to user.
   */
  onUpload() {
    if (!this.selectedUser()) {
      return;
    }
    const userId = this.selectedUser().id;
    if (
      (this.userImages() && this.userImages()?.length > 0) ||
      this.listRemovedImages()?.length > 0
    ) {
      this.updateUserImage(userId);
    } else {
      this.uploadImage(userId);
    }
  }

  /**
   * execute upload image of user.
   * @param userId number user id
   */
  uploadImage(userId: number) {
    if (
      this.files().length >= this.minFiles &&
      this.files().length <= this.maxFiles
    ) {
      this.creatingUser.set(true);
      this.employeeService
        .uploadEmployeeImages(userId, this.files())
        .subscribe({
          next: (result: any) => {
            const res = JSON.parse(result);
            if (res.success) {
              this.files.set([]);
              this.modalService.dismissAll();
              this.toastr.success(
                this.translate.instant('Uploaded successfully!'),
              );
              this.getListUser();
            } else {
              this.toastr.error(
                res.message || 'Unabled upload images, please try again!',
              );
            }
            this.creatingUser.set(false);
          },
          error: () => {
            this.creatingUser.set(false);
            this.toastr.error(
              this.translate.instant(ERRORS_CONSTANT.GENERAL.UNEXPECTED_ERROR),
            );
          },
        });
    }
  }

  /**
   * Update image of user
   * @param userId number id of user
   */
  updateUserImage(userId: number) {
    const params: any = {
      employeeId: userId,
      fileCreates: this.files(),
      fileDeletes: this.listRemovedImages(),
    };
    this.creatingUser.set(true);
    this.employeeService.updateEmployeeImages(params).subscribe({
      next: (result: any) => {
        const res = JSON.parse(result);
        if (res.success) {
          this.files.set([]);
          this.closeUserModal();
          this.toastr.success(
            this.translate.instant('Update user image successfully!'),
          );
          this.getListUser();
        } else {
          this.toastr.error(
            this.translate.instant(
              res.message || 'Unabled update user images, please try again!',
            ),
          );
        }
        this.creatingUser.set(false);
      },
      error: () => {
        this.creatingUser.set(false);
        this.toastr.error(
          this.translate.instant(ERRORS_CONSTANT.GENERAL.UNEXPECTED_ERROR),
        );
      },
    });
  }
  /**
   * Open modal import user
   * @param modal modal object
   */
  openImportModal(modal: any) {
    this.importFile.set([]);
    this.importingUser.set(false);
    this.idDepartmentImport.set(this.getUserparams().DepartmentId || null);
    this.modalService.open(modal, {
      centered: true,
      backdrop: 'static',
    });
  }

  /**
   * Set id department import
   * @param list id department select import
   */
  onDepartmentSelectImport(list: Array<number>) {
    this.idDepartmentImport.set(list && list.length > 0 ? list[0] : null);
  }

  /**
   * Close modal import user.
   */
  closeImportModal() {
    this.importFile.set([]);
    this.importError.set(null);
    this.modalService.dismissAll();
  }
  /**
   * Execute import user from file
   * @param files File object
   * @returns void
   */
  importDataExcel(files: any = this.importFile()) {
    if (files.length === 0) {
      return;
    }
    const file = files[0];
    this.importingUser.set(true);
    try {
      /* wire up file reader */
      const reader: FileReader = new FileReader();
      reader.readAsBinaryString(file);
      // reader.readAsDataURL(file);
      reader.onload = (e: any) => {
        /* create workbook */
        const binarystr: string = e.target.result;
        const wb: XLSX.WorkBook = XLSX.read(binarystr, { type: 'binary' });

        /* selected the first sheet */
        const wsname: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];

        /* save data */
        const data = XLSX.utils.sheet_to_json(ws);
        const success = 'Users imported successfully!';
        const validUserData: Array<UserSaveModel> = [];
        const invalidUserData: Array<UserSaveModel> = [];
        data.forEach((item: any) => {
          const dob = item['Date of birth (dd/mm/yyyy)']
            ? moment(
                item['Date of birth (dd/mm/yyyy)'],
                DateFormatEnum.DEFAULT_FORMAT,
              ).format(DateFormatEnum.SYSTEM_FORMAT)
            : '';

          const objDepartmentTemp = this.listDepartments().filter(
            (ele: any) => ele.name === item['Department'],
          )[0];

          const param: UserSaveModel = {
            fullName:
              item['First name'] && item['Last name']
                ? item['First name'] + ' ' + item['Last name']
                : '',
            customerId: this.getUserparams().CustomerId,
            departmentId: objDepartmentTemp
              ? objDepartmentTemp?.id
              : this.idDepartmentImport(),
            userName: item['User name']?.trim() || '',
            firstName: item['First name'] ? item['First name'] + '' : '',
            lastName: item['Last name'] ? item['Last name'] + '' : '',
            email: item['Email'],
            gender: item['Gender'] === 'Male' ? 1 : 0,
            dateOfBirth: dob || null,
            address: item['Address'] || '',
            phoneNumber: item['Phone'] || '',
            images: item['Images'] ? item['Images'].split(';') : null,
            isEnableLogin: false,
            userType: this.getUserType(),
            citizenIdentityCard: item['User name']?.trim() || '',
          };
          let validData =
            VALIDATOR_REGEX_CONSTANT.userName.test(param.userName) &&
            VALIDATOR_REGEX_CONSTANT.email.test(param.email);
          validData = !(
            param.phoneNumber.trim().length > 0 && isNaN(+param.phoneNumber)
          );
          if (validData) {
            validUserData.push(param);
          } else {
            invalidUserData.push(param);
          }
        });
        if (validUserData.length > 0) {
          this.employeeService.importEmployeeFromFile(validUserData).subscribe({
            next: (result: any) => {
              const res = JSON.parse(result);
              this.importingUser.set(false);
              if (res.success) {
                this.toastr.success(
                  res.data +
                    ' ' +
                    this.translate.instant(success) +
                    '\n' +
                    invalidUserData.length +
                    (validUserData.length - res.data) +
                    ' ' +
                    this.translate.instant(' row(s) error.'),
                );
                this.closeImportModal();
                this.getListUser();
              } else {
                this.importError.set(
                  ERRORS_CONSTANT.USERS[res.message]
                    ? ERRORS_CONSTANT.USERS[res.message]
                    : res.message,
                );
                if (res.message === 'DUPLICATES') {
                  this.importError.set(
                    this.importError() +
                      '\n List account duplicate: ' +
                      res.data.join(', '),
                  );
                }
              }
            },
            error: () => {
              this.onImportFileError();
            },
          });
        } else {
          this.onImportFileError();
        }
      };
    } catch {
      this.onImportFileError();
    }
  }
  /**
   * Show message when file is invalid
   */
  onImportFileError() {
    this.importingUser.set(false);
    this.toastr.error(
      this.translate.instant(ERRORS_CONSTANT.USERS.FILE_IMPORT_INVALID),
    );
  }
  /**
   * Change current view mod popup user
   * @param view string
   */
  changeModelView(view: 'info' | 'image') {
    if (this.modalView() === view) {
      return;
    }
    this.modalView.set(view);
    if (
      view === 'image' &&
      !this.onCreateNewUser() &&
      (!this.userImages() || this.userImages().length === 0)
    ) {
      this.getListImagesOfUser(this.selectedUser()?.id);
    }
  }

  /**
   * onSelect - Select file for upload
   * @param event object
   */
  onSelect(event: any) {
    const maxFiles = this.maxFiles - (this.userImages()?.length || 0);
    if (event.addedFiles.length > maxFiles) {
      const dif = event.addedFiles.length - maxFiles;
      event.addedFiles.slice(this.maxFiles - 1, dif);
    }
    this.files.update((items) => {
      items.push(...event.addedFiles);
      return [...items];
    });
  }

  /**
   * Remove image from list and push to list remove for remove late
   * @param image object UserImageModel
   */
  removeImage(image: UserImageModel) {
    if (this.listRemovedImages()) {
      this.listRemovedImages.update((items) => {
        items.push(image);
        return [...items];
      });
    } else {
      this.listRemovedImages.set([image]);
    }
    this.userImages.set(
      this.userImages().filter((item: UserImageModel) => {
        return item.id !== image.id;
      }),
    );
  }
  /**
   * Add import file to temp.
   * @param event object
   */
  onAddFile(event: any) {
    this.importFile.set(event.addedFiles);
  }
  /**
   * Get preview file url
   * @param item File object
   * @returns url or null
   */
  getPreviewFileUrl(item: File) {
    if (item.type === 'image/png' || item.type === 'image/jpeg') {
      return this.sanitizer.bypassSecurityTrustResourceUrl(
        URL.createObjectURL(item),
      );
    }
    return null;
  }
  /**
   * onRemove - Remove file upload
   * @param event file
   */
  onRemove(event: any) {
    this.files().splice(this.files().indexOf(event), 1);
  }
  /**
   *
   * @param modal user modal
   * @param user user object, undefined in case add new
   */
  openUserModal(modal: any, user?: UserInfoModelExt) {
    this.selectedDepartmentIdForm.set([this.getUserparams().DepartmentId]);

    this.userForm.reset();
    this.userForm.get('gender').setValue(GENDER_CONSTANT.female.value);
    this.errorCreateUser.set(undefined);
    this.selectedUser.set(user);
    this.isCreateUpdateUser.set(true);
    this.modalView.set('info');
    this.userImages.set(undefined);
    if (user) {
      this.getEmployeeById(user.id, modal);
      this.userForm.get('departmentId').setValue(user.departmentId);
    } else {
      this.onCreateNewUser.set(true);
      this.userForm.get('userType').setValue(this.getUserType());
      this.userForm.get('userName').enable();
      this.userForm.get('password').enable();
      this.userForm.get('email').enable();
      this.userForm.get('dateOfBirth').setValue(null);

      if (!this.checkedLoginPermission()) {
        this.userForm.get('password').disable();
      }
      this.openModal(modal);
    }
  }

  /**
   * Get detail of employee by id
   * @param id id of employee
   * @param modal modal open
   */
  getEmployeeById(id: number, modal: any) {
    this.employeeService.getEmployeeById(id).subscribe((response: any) => {
      const res = JSON.parse(response);
      if (res) {
        const user = res.data;
        this.selectedDepartmentIdForm.set([user.departmentId]);
        this.onCreateNewUser.set(false);
        let dob = {};
        if (user?.dateOfBirth) {
          dob = this.dateTimeUtils.dateToDateObject(
            user.dateOfBirth,
            DateFormatEnum.SYSTEM_FORMAT,
          );
        } else {
          dob = null;
        }
        this.userForm.get('userName').disable();
        this.userForm.get('password').disable();
        this.userForm.get('email').disable();
        this.userForm.get('userName').setValue(user.userName);
        this.userForm.get('firstName').setValue(user.firstName);
        this.userForm.get('lastName').setValue(user.lastName);
        this.userForm.get('gender').setValue(user.gender);
        this.userForm.get('email').setValue(user.email);
        this.userForm.get('isEnableLogin').setValue(user.isEnableLogin);
        this.userForm.get('phoneNumber').setValue(user.phoneNumber);
        this.userForm.get('address').setValue(user.address);
        this.userForm.get('dateOfBirth').setValue(dob);
        this.userForm.get('jobTitle').setValue(user.jobTitle);
        this.userForm.get('userType').setValue(user.userType);
        this.userForm
          .get('citizenIdentityCard')
          .setValue(user.citizenIdentityCard);
        this.userForm
          .get('startTime')
          .setValue(
            user.startTime
              ? this.dateTimeUtils.newDateToDateObject(new Date(user.startTime))
              : null,
          );
        this.userForm
          .get('endTime')
          .setValue(
            user.startTime
              ? this.dateTimeUtils.newDateToDateObject(new Date(user.endTime))
              : null,
          );
        this.userForm.get('description').setValue(user.description);
        this.openModal(modal);
      }
    });
  }
  /**
   * open user modal
   * @param modal  user modal
   */
  openModal(modal: any) {
    this.modalService.open(modal, {
      centered: true,
      backdrop: 'static',
      size: 'lg',
    });
  }

  /**
   * Close modal and reset all selectd user data.
   */
  closeUserModal() {
    this.isCreateUpdateUser.set(false);
    this.userForm.reset({ gender: GENDER_CONSTANT.male.value });
    this.files.set([]);
    this.userImages.set(undefined);
    this.listRemovedImages.set(undefined);
    this.selectedDepartmentIdForm.set([]);
    this.selectedUser.set(undefined);
    this.userForm.get('userName').setErrors(null);
    this.userForm.setErrors(null);
    this.userForm.get('userName').updateValueAndValidity();
    this.modalService.dismissAll();
  }

  /**
   * open update password model when user have login permission
   * @param modal model change password
   * @param user user info who will be updated
   *
   */
  openChangePasswordModal(modal: any, user: any) {
    this.selectedUser.set(user);
    this.modalService.open(modal, {
      centered: true,
      backdrop: 'static',
    });
  }
  /**
   * Handle change password of user
   * @param selectedId number, user id
   */
  changePassword(selectedId: number = this.selectedUser().id) {
    const params = {
      userId: selectedId,
      oldPassword: '',
      newPassword: this.passwordForm.get('password').value,
    };

    const success = 'Change employee password successfully!';
    const error = 'Unable change employee password, please try again!';
    this.employeeService.resetPassword(params).subscribe({
      next: (result: any) => {
        if (result) {
          const res = JSON.parse(result);
          if (res.success) {
            this.toastr.success(this.translate.instant(success));
            if (!this.selectedUser().isEnableLogin) {
              this.getListUser(this.getUserparams());
            }
            this.closeChangePasswordModal(false);
          } else {
            this.toastr.error(this.translate.instant(error));
          }
        }
      },
      error: () => {
        this.toastr.error(
          this.translate.instant(ERRORS_CONSTANT.GENERAL.UNEXPECTED_ERROR),
        );
      },
    });
  }

  /**
   * close change password modal
   * reset form
   */
  closeChangePasswordModal(isUncheck: boolean) {
    this.passwordForm.reset();
    if (isUncheck) {
      const disableLoginParam = {
        userId: this.selectedUser().id,
        isEnableLogin: false,
      };
      this.employeeService
        .changeEnableLogin(disableLoginParam)
        .subscribe((result: any) => {
          const res = JSON.parse(result);
          if (res.success) {
            this.elementCheckStatus.update((obj) => ({
              ...obj,
              checked: false,
            }));
          }
        });
    }

    this.modalService.dismissAll();
  }

  /**
   * Add or remove package in processing
   * @param id number
   * @param add state add or remove
   */
  setInAction(id: number, add: boolean = true) {
    if (add) {
      this.listInActions.update((items) => {
        items.push(id);
        return [...items];
      });
    } else {
      this.listInActions.set(
        this.listInActions().filter((item) => item !== id),
      );
    }
  }
  /**
   * Check current package in processing or not
   * @param id number
   * @returns boolean
   */
  isInAction(id: number): boolean {
    return this.listInActions().findIndex((item) => item === id) >= 0;
  }

  /**
   * Create url assign role for redirect to assign role for user page.
   * @param id number id of user
   * @returns string url of user
   */
  createAssignRoleUrl(id: number): string {
    return (
      id + '/' + ""
    );
  }

  /**
   * check permission of item in table
   * @returns boolean
   */
  checkPermission(allowUpdate: boolean) {
    return checkPermissionRow(this.userInfo().userType, allowUpdate);
  }
  /**
   * get user type
   * @returns type
   */
  getUserType() {
    switch (this.type()) {
      case 'employees':
        return this.userTypeEnum.User;
      case 'blacklist':
        return this.userTypeEnum.BlackList;
      case 'guest':
        return this.userTypeEnum.Guest;
      default:
        return this.userTypeEnum.User;
    }
  }

  /**
   * Handel delete employee
   * @param item UserInfoModelExt
   */
  handelDeleteEmployee(item: UserInfoModelExt) {
    if (!item) return;
    const confirmParams: SweetAlertOptions = {
      confirmButtonText: this.translate.instant('Delete'),
      cancelButtonText: this.translate.instant('Cancel'),
      html: this.translate.instant('Are you sure delete this employee?'),
    };
    confirmDailog(confirmParams, 'danger', () => {
      this.employeeService
        .deleteEmployee({ id: item.id, userName: item.userName })
        .subscribe({
          next: (result: any) => {
            const res = JSON.parse(result);
            if (res.success) {
              this.toastr.success(
                this.translate.instant('Delete employee successfully!'),
              );
              this.getListUser();
            } else {
              this.toastr.error(this.translate.instant(res.message));
            }
          },
          error: (err) => {
            this.toastr.error(
              this.translate.instant(
                'Unable delete employee, please try again!',
              ),
            );
          },
        });
    });
  }
}
