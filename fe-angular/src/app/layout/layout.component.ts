import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { SidebarModel } from '@app/configs/models/sidebar.model';
import { SIDEBAR } from '@app/configs/sidebar.constant';
import { AuthenticationService } from '@app/core/services/authentication.service';
import { LayoutSubcriptionService } from '@app/core/services/layout.services';
import { LocalStorageService } from '@app/core/services/local-storage.service';
import { PopupModel } from '@app/shared/components/app-user-management-table/model/app-agent-table.model';
import { PopupType } from '@app/shared/components/popup/enum/popup.enum';
import { LocalStorageKeyEnum } from '@app/shared/constants/enums/local-storage-key.enum';
import { SvgIcon } from '@app/shared/constants/svg-icon.constant';
import { notificationList } from '@app/shared/mock/notification.constant';
import { NotificationModel } from '@app/shared/models/notification.model';
import { Location } from '@angular/common';
import { SharedService } from './services/shared.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit, AfterViewInit {
  icons = SvgIcon;
  popupContent: PopupModel = null;
  isShowPopup: boolean = false;
  isOpenSidebar: boolean = true;
  innerWidth: number;
  isShowDrawer: boolean = false;
  notifications: NotificationModel[] = notificationList;
  newMessNumb: number;
  title: string = 'Dashboard';
  sidebarData = SIDEBAR;
  isBack: boolean = false;
  isHome: boolean = false;

  constructor(
    private readonly router: Router,
    private readonly layoutService: LayoutSubcriptionService,
    private cdr: ChangeDetectorRef,
    private localStorageService: LocalStorageService,
    private authService: AuthenticationService,
    private location: Location,
    private sharedService: SharedService,
  ) {
    // Close sidebar menu on mobile when router change.
    this.router.events.subscribe(() => {
      if (window.innerWidth < 992) {
        this.isOpenSidebar = true;
      }
    });
    
    this.sharedService.isShowNavigation.subscribe((value: boolean) => {
      this.isHome = value;
    });
  }

  ngOnInit(): void {
    this.updateBadgeNumb();
    this.cdr.detectChanges();
  }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  /**
   * Change layout of system
   */
  toogleLayout = () => {
    this.isOpenSidebar = !this.isOpenSidebar;
    this.layoutService.setShowNav(this.isOpenSidebar);
  };

  showDrawer = () => {
    this.isShowDrawer = !this.isShowDrawer;
  };

  closeDrawer = () => {
    this.isShowDrawer = false;
  };

  confirmActions = (type: PopupType) => {
    this.authService.logout();
  };

  navigateToPath = (item: SidebarModel) => {
    if (item.title == 'Đăng xuất') {
      this.popupContent = {
        type: PopupType.LOGOUT,
        title: 'Đăng xuất',
        content: 'Bạn có chắc chắn muốn đăng xuất không?',
      };
      this.isShowPopup = true;
    } else {
      this.title = item.title;
      this.localStorageService.setObject(
        LocalStorageKeyEnum.CURRENT_PATH,
        item,
      );
      this.router.navigate([item.path]);
    }
  };

  updateBadgeNumb = () => {
    this.newMessNumb = this.notifications.filter((item: NotificationModel) => {
      return item.seen == false;
    }).length;
  };

  checkNotification = (notification: NotificationModel) => {
    this.notifications.forEach((item: NotificationModel) => {
      if (item.id === notification.id && !notification.seen) {
        item.seen = true;
      }
    });
    this.updateBadgeNumb();
  };

  previousPage = () => {
    this.location.back();
  };
}
