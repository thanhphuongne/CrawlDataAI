import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { CredentialsService } from '../services/credentials.service';
import { Logger } from '../services/logger.service';
import { calculateRemainingDays } from '@app/shared/utils/canculate-expired-license';

const log = new Logger('LicenseGuard');

@Injectable({
  providedIn: 'root',
})
export class LicenseGuard implements CanActivate {
  constructor(private credentialsService: CredentialsService, private router: Router) {}

  canActivate(): boolean {
    const userLicense = this.credentialsService.getUserInfoFromToken();
    if (userLicense?.license?.key && calculateRemainingDays(this.credentialsService.getUserInfoFromToken().license?.expired_date) >= 0) {
      return true;
    } else {
      log.debug('License invalid, redirecting to /no-access');
      this.router.navigate(['/configuration']);
      return false;
    }
  }
}