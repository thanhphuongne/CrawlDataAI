import { ROUTE_TYPE, RoutePath } from './models/route.enum';
import { SidebarModel } from './models/sidebar.model';

export const SIDEBAR: SidebarModel[] = [
  {
    id: 0,
    path: RoutePath.AGENT_MANAGEMENT,
    title: 'Quản lý Agent',
    icon: '../../assets/icons/ic_agent_management.svg',
    selectedIcon: '../../assets/icons/ic_agent_management_white.png',
    type: ROUTE_TYPE.TOP,
    roles: ['ADMIN', 'USER_LIVE', 'USER_VOD']
  },
  {
    id: 1,
    path: RoutePath.JOBS,
    title: 'Quản lý Jobs',
    icon: '../../assets/icons/ic_job_management.svg',
    selectedIcon: '../../assets/icons/ic_job_management_white.png',
    type: ROUTE_TYPE.TOP,
    roles: ['ADMIN', 'USER_LIVE']
  },
  {
    id: 2,
    path: RoutePath.LOGS,
    title: 'Logs',
    icon: '../../assets/icons/ic_logs.svg',
    selectedIcon: '../../assets/icons/ic_logs_white.png',
    type: ROUTE_TYPE.TOP,
    roles: ['ADMIN', 'USER_LIVE', 'USER_VOD']
  },
  {
    id: 3,
    path: RoutePath.POST,
    title: 'Xử lý hậu kỳ',
    icon: '../../assets/icons/ic_processing.svg',
    selectedIcon: '../../assets/icons/ic_processing_white.png',
    type: ROUTE_TYPE.TOP,
    roles: ['ADMIN', 'USER_VOD']
  },
  {
    id: 4,
    path: RoutePath.USER_MANEGEMENT,
    title: 'Quản lý người dùng',
    icon: '../../assets/icons/ic_user_management.svg',
    selectedIcon: '../../assets/icons/ic_user_management_white.svg',
    type: ROUTE_TYPE.TOP,
    roles: ['ADMIN']
  },
];

export const CONFIGURATION: SidebarModel[] = [
  {
    id: 0,
    path: RoutePath.CONFIGURATION,
    title: 'Cấu hình',
    icon: '../../assets/icons/ic_configuration.svg',
    selectedIcon: '../../assets/icons/ic_configuration_white.png',
    type: ROUTE_TYPE.CONFIGURATION,
    roles: ['ADMIN']
  },
  {
    id: 1,
    path: RoutePath.EMPTY,
    title: 'Đăng xuất',
    icon: '../../assets/icons/ic_logout.svg',
    selectedIcon: '../../assets/icons/ic_logout_white.png',
    disabled: false,
    type: ROUTE_TYPE.CONFIGURATION,
    roles: ['ADMIN', 'USER_LIVE', 'USER_VOD']
  },
];
