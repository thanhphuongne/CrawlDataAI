import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { NotificationChangeObserableModel } from '../models/notification-change-obj.model';
@Injectable({
  providedIn: 'root'
})
export class AppNotificationHubServices {
  private onUpdateMessageObj = new BehaviorSubject<
    NotificationChangeObserableModel
  >({
    total: 0,
    lastMessage: null
  });

  /**
   * Set Notification change on obserable
   * @param noti object NotificationChangeObserableModel
   */
  setNotificationChange(noti: NotificationChangeObserableModel) {
    this.onUpdateMessageObj.next(noti);
  }
  /**
   * Listen new message come.
   * @returns obserable
   */
  onNotificationChange() {
    return this.onUpdateMessageObj.asObservable();
  }
}
