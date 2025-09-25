export interface NotificationDataModel {
  id: number;
  userId: number;
  notificationId: number;
  markRead: boolean;
  markSeen: boolean;
  customerId: number;
  deviceId: number;
  packageNameType: number;
  userViolate: number;
  notifyTime: number;
  notifyType: string;
  title: string;
  description: string;
  link?: string;
  deviceName: string;
  notifyDate: string;
  notifyMediaType?: number;
  urlMedia?: string;
  cameraId?: number;
  isOffWarning?: boolean;
  evidenceKey?: string;
}
