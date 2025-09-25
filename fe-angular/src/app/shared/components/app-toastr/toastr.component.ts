import { Component, input } from '@angular/core';
import { SvgIcon } from '@app/shared/constants/svg-icon.constant';

import { Toast, ToastrService, ToastPackage } from 'ngx-toastr';

export interface AppToastrBtn {
  id: string;
  title: string;
  class?: string;
  icon?: SvgIcon;
  type?: 'filled' | 'outline' | 'subtle' | 'text';
  size?: 'sm' | 'md' | 'lg';
  variant?:
    | 'primary'
    | 'secondary'
    | 'tertiary'
    | 'success'
    | 'danger'
    | 'warning';
}
@Component({
  selector: 'app-toastr-component',
  styleUrls: [`./toastr.component.scss`],
  templateUrl: `./toastr.component.html`,
})
export class AppToastrComponent extends Toast {
  buttons = input<Array<AppToastrBtn>>();
  icon = SvgIcon;
  constructor(
    protected toastrService: ToastrService,
    public toastPackage: ToastPackage,
  ) {
    super(toastrService, toastPackage);
  }

  action(btn: AppToastrBtn) {
    this.toastPackage.triggerAction(btn);
    this.toastrService.clear();
    return false;
  }
}
