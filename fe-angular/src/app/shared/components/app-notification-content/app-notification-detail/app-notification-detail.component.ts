import { Component, Input, OnChanges, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import {
  ItemEvidenceModel,
  ItemNotifyDetailModel,
} from '../models/notify-detail.model';
import { ItemNotificationDetail } from '../models/notify-detail.constant';
import { PACKAGE_TYPES } from '@app/configs/package.constants';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AppIconDirectiveModule } from '@app/shared/directives/app-icon/app-icon.directive.module';
import { AppIconComponent } from '../../icon/icon.component';
import { NgbModal, NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { AppSwitchDirectiveModule } from '@app/shared/directives/app-switch/app-switch.directive.module';
import { DateFormatEnum } from '@app/shared/utils/date-times.utils';
import { SvgIcon } from '@app/shared/constants/svg-icon.constant';
import { VgCoreModule } from '@videogular/ngx-videogular/core';
import { VgControlsModule } from '@videogular/ngx-videogular/controls';
import { VgOverlayPlayModule } from '@videogular/ngx-videogular/overlay-play';
import { VgBufferingModule } from '@videogular/ngx-videogular/buffering';
import { AppButtonDirectiveModule } from '@app/shared/directives/app-button/app-button.directive.module';
import { VgStreamingModule } from '@videogular/ngx-videogular/streaming';
import { ViewImageComponent } from '../../view-image/view-image.component';
import { AppCardDirectiveModule } from '@app/shared/directives/app-card/app-card.directive.module';
import { AppNoDataComponent } from '../../app-no-data/app-no-data.component';
import { AppSkeletonComponent } from '../../skeleton/skeleton.component';

@Component({
  selector: 'app-notification-detail',
  templateUrl: './app-notification-detail.component.html',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TranslateModule,
    AppIconDirectiveModule,
    AppIconComponent,
    AppCardDirectiveModule,
    AppNoDataComponent,
    AppSkeletonComponent,
    NgbTooltip,
    AppSwitchDirectiveModule,
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
    VgStreamingModule,
    AppButtonDirectiveModule,
    ViewImageComponent,
  ],
})
export class AppNotifyDetailComponent implements OnChanges {
  @Input() id: number;
  @Input() keyword: string;
  @Input() type: number;
  @Input() startTime: string;
  @Input() endTime: string;
  @Input() customerId: number;
  @Input() notifyTime: number;
  @Input() evidenceKey: string;
  @Input() userId: number;
  @Input() cameraId: number;
  @Input() title: string;
  @Input() packageNameType: number;
  getNotifiParams: {
    customerId?: number;
    page?: number;
    startTime?: string;
    endTime?: string;
    type?: number;
  };
  icons = SvgIcon;
  isLoading = signal<boolean>(false);
  inforNotifyDetail = signal<any>(null);
  itemNotifyDetais: Array<ItemNotifyDetailModel> = [];
  dateFormatEnum = DateFormatEnum;
  textWarning = signal<string>('');
  listImage: Array<ItemEvidenceModel>;
  urlVideo: string;
  nameVideo: string;
  indexImg = 0;
  typeEvidence: number;
  listEvidence: Array<{ url: string; label?: string }> = [];
  notifiUrl: string;

  constructor(private readonly modalService: NgbModal) {}

  ngOnChanges(): void {
    this.getNotifiParams = {
      customerId: this.customerId,
      page: 0,
      startTime: this.startTime,
      endTime: this.endTime,
      type: this.type,
    };
    this.itemNotifyDetais =
      ItemNotificationDetail?.[
        Object.values(PACKAGE_TYPES).find(
          (item: any) => item.value === +this.packageNameType,
        )?.siteRoute
      ] || null;
  }

  /**
   * Close modal view evidence
   */
  closeModal() {
    this.modalService.dismissAll();
    this.urlVideo = undefined;
  }

  /**
   * Download video
   * @param videoSource string
   */
  download(videoSource: string | null, nameVideo: string) {
    if (!videoSource) return;
    // Create an invisible A element
    videoSource = videoSource.split('?')[0];
    const a = document.createElement('a');
    a.style.display = 'none';
    document.body.appendChild(a);

    // Set the HREF to a Blob representation of the data to be downloaded
    a.href = videoSource;

    // Use download attribute to set set desired file name
    a.setAttribute('download', nameVideo);

    // Trigger the download by simulating click
    a.click();

    // Cleanup
    window.URL.revokeObjectURL(a.href);
    document.body.removeChild(a);
  }
}
