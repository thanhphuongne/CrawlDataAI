import {
  NOTIFICATION_AGNET_STATUS,
  NOTIFICATION_EVENT_TYPE,
} from '../constants/enums/notification.enum';

export const notificationList = [
  {
    id: 0,
    name: 'Agent cho giải đấu C1',
    eventType: NOTIFICATION_EVENT_TYPE.CREATE,
    eventStatus: NOTIFICATION_AGNET_STATUS.BUILDING,
    seen: false
  },
  {
    id: 1,
    name: 'Agent cho giải đấu NBA',
    eventType: NOTIFICATION_EVENT_TYPE.CREATE,
    eventStatus: NOTIFICATION_AGNET_STATUS.FAILED,
    seen: false
  },
  {
    id: 2,
    name: 'Agent cho giải đấu AFF',
    eventType: NOTIFICATION_EVENT_TYPE.CREATE,
    eventStatus: NOTIFICATION_AGNET_STATUS.SUCCESS,
    seen: true
  },
  {
    id: 3,
    name: 'Agent cho giải đấu Ngoại hạng Anh',
    eventType: NOTIFICATION_EVENT_TYPE.CREATE,
    eventStatus: NOTIFICATION_AGNET_STATUS.SUCCESS,
    seen: true
  },
  {
    id: 4,
    name: 'Agent cho giải đấu Laliga',
    eventType: NOTIFICATION_EVENT_TYPE.CREATE,
    eventStatus: NOTIFICATION_AGNET_STATUS.SUCCESS,
    seen: true
  },
  {
    id: 5,
    name: 'Agent cho giải đấu League 1',
    eventType: NOTIFICATION_EVENT_TYPE.CREATE,
    eventStatus: NOTIFICATION_AGNET_STATUS.SUCCESS,
    seen: true
  },
  {
    id: 6,
    name: 'Agent cho giải đấu V-League',
    eventType: NOTIFICATION_EVENT_TYPE.CREATE,
    eventStatus: NOTIFICATION_AGNET_STATUS.SUCCESS,
    seen: true
  },
  {
    id: 7,
    name: 'Agent cho giải đấu MMA',
    eventType: NOTIFICATION_EVENT_TYPE.CREATE,
    eventStatus: NOTIFICATION_AGNET_STATUS.SUCCESS,
    seen: true
  },
  {
    id: 8,
    name: 'Agent cho giải đấu V-League',
    eventType: NOTIFICATION_EVENT_TYPE.CREATE,
    eventStatus: NOTIFICATION_AGNET_STATUS.FAILED,
    seen: true
  },
  {
    id: 9,
    name: 'Agent cho giải đấu Thai Leauge',
    eventType: NOTIFICATION_EVENT_TYPE.CREATE,
    eventStatus: NOTIFICATION_AGNET_STATUS.SUCCESS,
    seen: true
  },
  {
    id: 10,
    name: 'Agent cho giải đấu J-League',
    eventType: NOTIFICATION_EVENT_TYPE.CREATE,
    eventStatus: NOTIFICATION_AGNET_STATUS.FAILED,
    seen: true
  },
  {
    id: 11,
    name: 'Agent cho giải đấu Golf',
    eventType: NOTIFICATION_EVENT_TYPE.CREATE,
    eventStatus: NOTIFICATION_AGNET_STATUS.SUCCESS,
    seen: true
  },
];
