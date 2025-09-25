export interface LogModel {
  id: string;
  date: string;
  description?: string;
  category: string;
  type: string;
  score: string;
  supervisor: string;
  approver: string;
  status: string;
  note?: string;
}
