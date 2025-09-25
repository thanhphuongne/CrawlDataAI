import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CredentialsService } from '../services/credentials.service';
import { UserModel } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class ValidateAccountSettingGuard {
  constructor(
    private readonly credentialService: CredentialsService,
    private readonly router: Router,
  ) {}

  async canActivate(): Promise<boolean> {
    const userProfile: UserModel =
      await this.credentialService.getUserInfoFromToken();
    if (userProfile) {
      return true;
    }
    this.router.navigateByUrl('404');
    return false;
  }
}
