import { Component, input, model, OnInit, output } from '@angular/core';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { PopupType } from './enum/popup.enum';
import { NzImageModule } from 'ng-zorro-antd/image';

@Component({
  selector: 'app-popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss'],
  standalone: true,
  imports: [NzModalModule, NzImageModule],
})
export class PopupComponent implements OnInit {
  type = input<PopupType>();
  title = input<string>();
  content = input<string>();
  isVisible = model<boolean>();

  okOnChange = output<PopupType>();
  popupType: typeof PopupType = PopupType;

  constructor() {}

  ngOnInit() {}

  okAction = () => {
    this.isVisible.update((newVal) => !newVal);
    this.okOnChange.emit(this.type());
  };

  closeModal = () => {
    this.isVisible.update((newVal) => !newVal);
  };

  getPopupImage = () => {
    switch (this.type()) {
      case PopupType.SUCCESS:
        return '../../../../assets/icons/ic_popup_success.png';
      case PopupType.WARNING:
        return '../../../../assets/icons/ic_popup_warning.png';
      case PopupType.CONFIRM:
        return '../../../../assets/icons/ic_popup_question.png';
      case PopupType.CONFIRM_DELETE:
        return '../../../../assets/icons/ic_popup_delete.png';
      case PopupType.ACTIONS_SUCCESS:
        return '../../../../assets/icons/ic_popup_success.png';
      case PopupType.LOGOUT:
        return '../../../../assets/icons/ic_power.png';
      default:
        return '../../../../assets/icons/ic_popup_failed.png';
    }
  };
}
