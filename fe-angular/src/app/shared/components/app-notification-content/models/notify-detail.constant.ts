import { ItemNotifyDetailModel } from "./notify-detail.model";

export const PackageNameConst = []

export const ItemNotificationDetail : {
  trafficControl : Array<ItemNotifyDetailModel>;
  securityMonitoring : Array<ItemNotifyDetailModel>;
  weaponCarrier : Array<ItemNotifyDetailModel>;
  walkingZonePage: Array<ItemNotifyDetailModel>;
  blacklist: Array<ItemNotifyDetailModel>;
} = {
  weaponCarrier: [
    {
      label: 'Area name',
      value: 'areaName',
      type: 'Other'
    },
    {
      label: 'Box name',
      value: 'deviceName',
      type: 'Other'
    },
    {
      label: 'Camera name',
      value: 'cameraName',
      type: 'Other'
    },
    {
      label: 'User',
      value: 'userName',
      type: 'Other'
    },
    {
      label: 'Time violate',
      value: 'evidenceDate',
      type: 'DateTime'
    }
  ],
  trafficControl : [
    {
      label: 'Gate name',
      value: 'areaGate',
      type: 'Other'
    },
    {
      label: 'Box name',
      value: 'deviceName',
      type: 'Other'
    },
    {
      label: 'Time violate',
      value: 'evidenceDate',
      type: 'DateTime'
    },
    {
      label: 'Control rule',
      value: 'controlRule ',
      type: 'Other'
    },
    {
      label: 'Time',
      value: 'time',
      type: 'Time'
    },
    {
      label: 'Total in/Limit in',
      value: 'totalIn',
      type: 'Fraction',
      denominators: 'limitIn'
    },
  ],
  securityMonitoring: [
    {
      label: 'Area name',
      value: 'areaName',
      type: 'Other'
    },
    {
      label: 'Device name',
      value: 'deviceName',
      type: 'Other'
    },
    {
      label: 'Camera name',
      value: 'cameraName',
      type: 'Other'
    },
    {
      label: 'Time violate',
      value: 'evidenceTime',
      type: 'DateTime'
    },
    {
      label: 'Evidence video',
      value: 'hasVideo',
      type: 'Video'
    },
  ],
  walkingZonePage: [
    {
      label: 'Area name',
      value: 'areaName',
      type: 'Other'
    },
    {
      label: 'Device name',
      value: 'deviceName',
      type: 'Other'
    },
    {
      label: 'Camera name',
      value: 'cameraName',
      type: 'Other'
    },
    {
      label: 'Time violate',
      value: 'evidenceTime',
      type: 'DateTime'
    },
    {
      label: 'Evidence video',
      value: 'hasVideo',
      type: 'Video'
    },
  ],
  blacklist: [
    {
      label: 'Name',
      value: 'userName',
      type: 'Other'
    },
    {
      label: 'Area name',
      value: 'areaName',
      type: 'Other'
    },
    {
      label: 'Device name',
      value: 'deviceName',
      type: 'Other'
    },
    {
      label: 'Camera name',
      value: 'cameraName',
      type: 'Other'
    },
    {
      label: 'Time violate',
      value: 'evidenceTime',
      type: 'DateTime'
    },
    {
      label: 'Evidence video',
      value: 'hasVideo',
      type: 'Video'
    },
  ]
};