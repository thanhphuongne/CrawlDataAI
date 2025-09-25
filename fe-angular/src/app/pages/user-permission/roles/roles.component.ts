import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PERMISSIONS_DATA } from '@app/configs/permissions-data.constants';
import { SITE_ROUTE } from '@app/configs/site-route.contants';
import { CredentialsService } from '@app/core';
import { CustomRole } from '@app/open-api/common/models/custom-role';
import { ERRORS_CONSTANT } from '@app/shared/constants/error.constants';
import { SvgIcon } from '@app/shared/constants/svg-icon.constant';
import { confirmDailog } from '@app/shared/utils/confirm-dailog.ultils';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { SweetAlertOptions } from 'sweetalert2';
import { UserRolesService } from '../services/roles.services';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss'],
})
export class RolesComponent implements OnInit {
  pageTitle = "";
  icons = SvgIcon;
  isLoading = signal(false);
  addingRole = signal(false);
  listRoles = signal<CustomRole[]>([]);
  selectedRole = signal<CustomRole>(undefined);
  roleForm: FormGroup;
  listSystemPermissions = PERMISSIONS_DATA;
  listErrors = ERRORS_CONSTANT;
  addRoleError = signal<string>('');
  customerId = signal<number>(0);
  constructor(
    private readonly modalService: NgbModal,
    private readonly formBuilder: FormBuilder,
    private readonly roleService: UserRolesService,
    private readonly toastr: ToastrService,
    private readonly translate: TranslateService,
    private readonly credentialService: CredentialsService,
  ) {}
  ngOnInit(): void {
    this.roleForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      description: [''],
    });
    this.customerId.set(+this.credentialService.activeCustomerId);
    this.getRoles(this.customerId());
  }
  /**
   * Get all role of system
   */
  getRoles(customerId: number) {
    this.isLoading.set(true);
    this.roleService.getAllRoleByCustomerId(customerId).subscribe({
      next: (result: any) => {
        this.isLoading.set(false);
        const res = JSON.parse(result);
        if (res.success) {
          this.listRoles.set(res.data);
        } else {
          this.listRoles.set([]);
          this.toastr.error(this.translate.instant(res.message));
        }
      },
      error: () => {
        this.isLoading.set(false);
        this.toastr.error(
          this.translate.instant(this.listErrors.GENERAL.UNEXPECTED_ERROR),
        );
      },
    });
  }

  /**
   * Add or update role.
   * @returns void
   */
  addRole() {
    if (this.roleForm.invalid || this.addingRole()) {
      return;
    }
    this.addingRole.set(true);
    const params: CustomRole = {
      customerId: this.customerId(),
      name: this.roleForm.get('name').value,
      description: this.roleForm.get('description').value,
      normalizedName: '',
    };
    if (this.selectedRole()) {
      params.id = this.selectedRole().id;
    }
    this.roleService.createUpdateRole(params).subscribe({
      next: (result: any) => {
        this.addingRole.set(false);
        const res = JSON.parse(result);
        if (res.success) {
          const success = this.selectedRole()
            ? 'Role updated successfully!'
            : 'New role added successfully!';
          this.toastr.success(this.translate.instant(success));
          this.getRoles(params.customerId);
          this.closeModal();
        } else {
          const message = ERRORS_CONSTANT.ROLES[res.message]
            ? ERRORS_CONSTANT.ROLES[res.message]
            : res.message;
          this.addRoleError.set(this.translate.instant(message));
        }
      },
      error: () => {
        this.addingRole.set(false);
        this.toastr.error(
          this.translate.instant(ERRORS_CONSTANT.GENERAL.UNEXPECTED_ERROR),
        );
      },
    });
  }

  /**
   * Delete role
   * @param role object, role object
   */
  deleteRole(role: CustomRole) {
    const confirmParams: SweetAlertOptions = {
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      title: 'Are you sure delete this role?',
      html: 'This role will remove from all users.',
    };
    confirmDailog(confirmParams, 'danger', () => {
      this.roleService.deleteRoleById(role.id).subscribe({
        next: (result: any) => {
          const res = JSON.parse(result);
          if (res.success) {
            this.toastr.success(
              this.translate.instant('Role deleted successfully!'),
            );
            this.getRoles(this.customerId());
          } else {
            const message = ERRORS_CONSTANT.ROLES[res.message]
              ? ERRORS_CONSTANT.ROLES[res.message]
              : res.message;
            this.toastr.error(this.translate.instant(message));
          }
        },
        error: () => {
          this.toastr.error(
            this.translate.instant(ERRORS_CONSTANT.GENERAL.UNEXPECTED_ERROR),
          );
        },
      });
    });
  }
  /**
   * Open modal create role.
   * @param modal modal object
   * @param selectedRole object role selected
   */
  openModalCreateRole(modal: any, selectedRole?: CustomRole) {
    if (selectedRole) {
      this.selectedRole.set(selectedRole);
      this.roleForm.get('name').setValue(this.selectedRole().name);
      this.roleForm
        .get('description')
        .setValue(this.selectedRole().description);
    }
    this.modalService.open(modal, {
      centered: true,
      backdrop: 'static',
    });
  }
  /**
   * Close modal and reset form data
   */
  closeModal() {
    this.addRoleError.set(null);
    this.selectedRole.set(undefined);
    this.roleForm.reset();
    this.modalService.dismissAll();
  }
}
