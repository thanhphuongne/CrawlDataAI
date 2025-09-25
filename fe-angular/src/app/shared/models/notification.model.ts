import {
  NOTIFICATION_AGNET_STATUS,
  NOTIFICATION_EVENT_TYPE,
} from '../constants/enums/notification.enum';

export interface NotificationModel {
  id: number;
  name: string;
  eventType: NOTIFICATION_EVENT_TYPE;
  eventStatus: NOTIFICATION_AGNET_STATUS;
  seen: boolean;
}
