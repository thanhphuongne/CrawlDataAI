import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { CredentialsService } from '../services/credentials.service';

@Injectable({
  providedIn: 'root',
})
export class PermissionGuard implements CanActivate {
  constructor(
    private credentialsService: CredentialsService,
    private router: Router
  ) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const userPermissions: string[] = this.credentialsService.getUserInfoFromToken()?.permissions || [];
    const requiredPermissions: string[] = route.data.requiredPermissions;
    if (requiredPermissions.length > 0) {
      if (userPermissions.some(permission => requiredPermissions.includes(permission))) {
        return true;
      }
    }
    this.router.navigate(['/403'], { queryParams: { returnUrl: route.url.join('/') } });
    return false;
  }
}
