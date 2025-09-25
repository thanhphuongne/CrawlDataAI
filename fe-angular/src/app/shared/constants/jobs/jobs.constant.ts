import { ColumnModel } from '@app/configs/models/column.models';

export const RANK_COLUMNS: ColumnModel[] = [
  { name: 'Rank', field: 'rank', mandatory: true },
  { name: 'User', field: 'user', mandatory: false },
  { name: 'Score', field: 'score', mandatory: false },
];

export const SCORING_COLUMNS: ColumnModel[] = [
  { name: 'No', field: 'no', mandatory: true },
  { name: 'Created Date', field: 'date', mandatory: false },
  { name: 'Description', field: 'desc', mandatory: false },
  { name: 'Category', field: 'cate', mandatory: false },
  { name: 'Type', field: 'type', mandatory: true },
  { name: 'Score', field: 'score', mandatory: true },
  { name: 'Supervisor', field: 'super', mandatory: true },
  { name: 'Approver', field: 'approver', mandatory: true },
  { name: 'Status', field: 'status', mandatory: true },
  { name: 'Note', field: 'note', mandatory: true },
  { name: 'Actions', field: 'action', mandatory: true },
];

export const rankCenter = ['rank', 'user', 'score'];

export const scoringCenter = [
  'no',
  'desc',
  'cate',
  'type',
  'score',
  'super',
  'approver',
  'date',
  'status',
  'note',
  'action',
];

export const supervisorOptions: string[] = [
  "ChienVH1", "DiemLM"
]
