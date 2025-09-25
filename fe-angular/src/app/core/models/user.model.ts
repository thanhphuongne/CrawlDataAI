export interface UserModel {
  username: string;
  email: string;
  userId: number;
  avatar?: string;
  userType: string;
}

export interface UserInforModel {
  id: number;
  accountName: string;
  email: string;
  role: string;
  token: string;
}
