import { UserInforModel } from './user.model';

/** Model data of credential */
export interface CredentialModel {
  accessToken: string;
  user: UserInforModel;
}
