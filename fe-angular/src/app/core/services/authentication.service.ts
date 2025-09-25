import { Injectable } from '@angular/core';
import { Observable, Subscriber, of } from 'rxjs';

import { Router } from '@angular/router';
import { LocalStorageKeyEnum } from '@app/shared/constants/enums/local-storage-key.enum';
import { CredentialsService } from './credentials.service';
import { LocalStorageService } from './local-storage.service';
import { RoutePath } from '@app/configs/models/route.enum';
import { UserService } from '@app/open-api/services';

export enum LoginResultEnum {
  SUCCESS = 0,
  ERROR_WRONG_USERNAME_PASSWORD = 1,
  ERROR_OTHERS = 3,
  ERROR_DISABLE = 2,
}

export enum ChangePasswordResultEnum {
  SUCCESS = 0,
  ERROR_NOT_MATCH = 1,
  ERROR_WRONG_PASSWORD = 2,
  ERROR_OTHERS = 3,
}
/**
 * Provides a base for authentication workflow.
 * The login/logout methods should be replaced with proper implementation.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  constructor(
    private readonly credentialsService: CredentialsService,
    private readonly router: Router,
    private readonly localStorage: LocalStorageService,
    private userService: UserService
  ) {}

  /**
   * Authenticates the user.
   * @param context The login parameters.
   * @return The user credentials.
   */
  login(params: any): Observable<LoginResultEnum> {
    return new Observable<any>((observer) => {
      return this.doLogin(params, observer);
    });
  }


  /**
   * Logs out the user and clear credentials.
   * @param redirect - boolean. Allow add redirect url to url or not. Help for redirect  to page after login.
   * @param directToLogin - boolean. Auto redirect to logout page or go to root page.
   * @return True if the user was logged out successfully.
   */
  logout(
    redirect: boolean = true,
    directToLogin: boolean = true,
  ): Observable<boolean> {
    this.credentialsService.setCredentials(null);
    this.localStorage.removeKey(LocalStorageKeyEnum.CUSTOMER_ID);
    this.localStorage.removeKey(LocalStorageKeyEnum.HAS_CHILD);
    const targetUrl = directToLogin
      ? RoutePath.USER_LOGIN
      : RoutePath.AGENT_MANAGEMENT;

    if (redirect) {
      this.router.navigate([targetUrl], {
        queryParams: { returnUrl: this.router.url },
      });
    } else {
      this.router.navigate([targetUrl]);
    }
    return of(true);
  }

  private doLogin(params: any, observer: Subscriber<any>) {
    this.userService
      .usersLoginPost({
        body: params,
      })
      .subscribe({
        next: (resp: any) => {
          if (resp && resp.success) {
              const credential: any = {
                accessToken: resp.accessToken,
                user: resp.user
              };
              this.credentialsService.setCredentials(credential);
              observer.next(LoginResultEnum.SUCCESS);
            } else {
              observer.next(LoginResultEnum.ERROR_WRONG_USERNAME_PASSWORD);
            }
          observer.complete();
        },
        error: () => {
          observer.next(LoginResultEnum.ERROR_OTHERS);
          observer.complete();
        },
      });
  }
}
