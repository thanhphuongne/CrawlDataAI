import { Injectable } from '@angular/core';
import { AuthenticationService } from '../services/authentication.service';
import { CredentialsService } from '../services/credentials.service';
import { Logger } from '../services/logger.service';

const log = new Logger('AuthenticationGuard');

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard {
  constructor(
    private credentialsService: CredentialsService,
    private authService: AuthenticationService
  ) { }

  /**
   * Handle check user is login and allow show in current domain.
   * Logout on case customer admin not belong current customer domain or not login.
   * Not check with root account
   * @returns boolean
   */
  async canActivate(): Promise<boolean> {
    const isAuth = await this.credentialsService.isAuthenticated();
    if (isAuth) {
      return true;
    }

    log.debug('Not authenticated, redirecting and adding redirect url...');
    this.authService.logout();
    return false;
  }
}
