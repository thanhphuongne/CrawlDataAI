import { ColumnModel } from './models/column.models';

export const AGENT_COLUMNS: ColumnModel[] = [
  // { name: 'Agent ID', field: 'agentID', mandatory: true },
  { name: 'Tên Agent', field: 'name', mandatory: true },
  { name: 'Card Info GPU', field: 'card', mandatory: true },
  { name: 'Method', field: 'method', mandatory: true },
  { name: 'IN/OUT', field: 'inout', mandatory: true },
  { name: 'Giải đấu', field: 'tournament', mandatory: true },
  { name: 'Chất lượng', field: 'quality', mandatory: true },
  { name: 'Độ phân giải', field: 'resolution', mandatory: true },
  { name: 'Ngày tạo', field: 'created_at', mandatory: true },
  { name: 'Trạng thái', field: 'status', mandatory: true },
  { name: 'Tác vụ', field: 'actions', mandatory: true },
];

export const USER_MANAGEMENT_COLUMNS: ColumnModel[] = [
  { name: 'User ID', field: 'id', mandatory: true },
  { name: 'Tên đăng nhập', field: 'username', mandatory: true },
  { name: 'Tên người dùng', field: 'full_name', mandatory: true },
  { name: 'Vai trò', field: 'department', mandatory: false },
  { name: 'Trạng thái', field: 'status', mandatory: true },
  { name: 'Tác vụ', field: 'actions', mandatory: true },
];
