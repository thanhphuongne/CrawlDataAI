import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { LocalStorageKeyEnum } from '../../shared/constants/enums/local-storage-key.enum';
import { CredentialModel } from '../models/credential.model';
import { UserInforModel, UserModel } from '../models/user.model';
import { LocalStorageService } from '../services/local-storage.service';
import { BehaviorSubject } from 'rxjs';
import { CookiesService } from './cookies.service';
/**
 * Provides storage for authentication credentials.
 * The Credentials interface should be replaced with proper implementation.
 */
@Injectable({
  providedIn: 'root',
})
export class CredentialsService {
  jwtService: JwtHelperService = new JwtHelperService();
  credentialsObsService = new BehaviorSubject<UserModel | null>(null);
  getCredentialObs = this.credentialsObsService.asObservable();

  constructor(
    private readonly localStorageService: LocalStorageService,
    private readonly cookiesServices: CookiesService,
  ) {
    this.credentialsObsService.next(this.getUserInfoFromToken());
  }
  /**
   * getUserInfor throw jwt
   * @returns object UserModel or null
   */
  getUserInfoFromToken(): UserModel | null {
    if (this.credentials && this.credentials?.user) {
      const user: UserInforModel = this.credentials.user;

      const userProfile: UserModel = {
        username: user.accountName,
        userId: user.id,
        email: user.email,
        userType: user.role,
        avatar: user.accountName.charAt(0).toUpperCase()
      };
      return userProfile;
    } else {
      return null;
    }
  }

  /**
   * Checks is the user is authenticated.
   * @return True if the user is authenticated.
   */
  async isAuthenticated(): Promise<boolean> {
    const accessToken = this.credentials?.accessToken;
    return accessToken && !this.jwtService.isTokenExpired(accessToken);
  }

  /**
   * Gets the user credentials.
   * @return The user credentials or null if the user is not authenticated.
   */
  get credentials(): CredentialModel | null {
    const savedCredentials = this.cookiesServices.getCookie(
      LocalStorageKeyEnum.CREDENTIAL,
    );
    if (savedCredentials) {
      return JSON.parse(savedCredentials);
    } else {
      return null;
    }
  }

  /**
   * Sets the user credentials.
   * The credentials may be persisted across sessions by setting the `remember` parameter to true.
   * Otherwise, the credentials are only persisted for the current session.
   * @param credentials The user credentials.
   */
  setCredentials(credentials?: CredentialModel) {
    if (credentials) {
      this.cookiesServices.setCookie(
        LocalStorageKeyEnum.CREDENTIAL,
        JSON.stringify(credentials),
      );
    } else {
      this.cookiesServices.removeCookie(LocalStorageKeyEnum.CREDENTIAL);
      this.localStorageService.removeKey(LocalStorageKeyEnum.CUSTOMER_ID);
      this.localStorageService.removeKey(LocalStorageKeyEnum.HAS_CHILD);
    }
    this.credentialsObsService.next(this.getUserInfoFromToken());
  }
}
