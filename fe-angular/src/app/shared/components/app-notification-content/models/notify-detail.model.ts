export interface ItemNotifyDetailModel {
  label?: string | null;
  value?: string | null;
  type?:
    | 'Other'
    | 'DateTime'
    | 'Time'
    | 'Video'
    | 'Image'
    | 'Fraction'
    | 'ConfirmStatus';
  denominators?: string | null;
}

export interface ItemEvidenceModel {
  bucketName?: string | null;
  evidenceId?: number | null;
  mediaType?: number | null;
  objectName?: string | null;
  url?: string | null;
}
