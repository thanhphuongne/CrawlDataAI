import { ROUTE_TYPE } from './route.enum';

export interface SidebarModel {
  id: number;
  path?: string;
  title: string;
  icon: string;
  selectedIcon: string;
  disabled?: boolean;
  type: ROUTE_TYPE;
  children?: ChildRouterModel;
  roles: Array<string>;}

export interface ChildRouterModel {
  id?: number;
  title: string;
}

export interface RouteLocalStorage {
  id: number;
  type: ROUTE_TYPE;
}
