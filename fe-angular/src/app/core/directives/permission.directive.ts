import {
  Directive,
  Input,
  OnInit,
  TemplateRef,
  ViewContainerRef,
} from '@angular/core';
import { UserModel } from '../models/user.model';
import { CredentialsService } from '../services/credentials.service';

@Directive({
  standalone: true,
  selector: '[permissions]',
})
export class PermissionDirective implements OnInit {
  private userPermissions: string;
  private isHidden = true;

  /**
   * Array<string> permissions accepted display
   */
  @Input()
  set permissions(val: Array<string>) {
    this.checkPermissions = val;
    this.updateView();
  }

  private checkPermissions: Array<string>;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private credentialsService: CredentialsService,
  ) {}

  ngOnInit(): void {
    const userData: UserModel = this.credentialsService.getUserInfoFromToken();
    if (userData.userType) {
      this.userPermissions = userData.userType;
    }
    this.updateView();
  }

  /**
   * updateView - Show/hide UI based on permissions
   */
  private updateView() {
    if (this.checkPermission()) {
      if (this.isHidden) {
        this.viewContainer.createEmbeddedView(this.templateRef);
        this.isHidden = false;
      }
    } else {
      this.isHidden = true;
      this.viewContainer.clear();
    }
  }

  /**
   * checkPermission - Check if the user has the required permissions.
   * @returns boolean
   */
  private checkPermission(): boolean {
    if (!this.userPermissions || !this.checkPermissions) {
      return false;
    }
    return this.checkPermissions.includes(this.userPermissions);
  }
}
