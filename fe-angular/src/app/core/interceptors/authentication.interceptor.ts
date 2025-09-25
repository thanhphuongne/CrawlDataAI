import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { AuthenticationService } from '../services/authentication.service';
import { CredentialsService } from '../services/credentials.service';
import { RoutePath } from '@app/configs/models/route.enum';
import { HttpResponse } from '@microsoft/signalr';

@Injectable()
export class AuthenticationInterceptor implements HttpInterceptor {
  private isRefreshing = false;

  constructor(
    private readonly authenticationService: AuthenticationService,
    private readonly credentialService: CredentialsService,
    private readonly router: Router,
    private readonly toastr: ToastrService,
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    const token = this.credentialService.credentials?.accessToken || null;
    request = request.clone({
      setHeaders: {
        Authorization: token ? 'Bearer ' + token : '',
      },
    });
    return next.handle(request).pipe(
      catchError((err) => {
        if (err instanceof HttpErrorResponse) {
          const errorObject =
            typeof err.error === 'object' ? err.error : JSON.parse(err.error);

          switch (err.status) {
            case 401:
              this.handle401Error(request, next);
              break;
            case 403:
              this.router.navigateByUrl('login');
              break;
            case 404:
              this.router.navigateByUrl('404');
              break;
            case 400:
              if (
                errorObject &&
                errorObject.messages &&
                errorObject.messages.length > 0
              ) {
                const errorRes: HttpErrorResponse = {
                  ...err,
                  error: errorObject?.messages[0],
                };
                return throwError(() => errorRes);
              }
              return;
            case 500:
              if (errorObject?.error || errorObject?.exception) {
                this.toastr.error(errorObject?.error || errorObject?.exception);
              }
              return throwError(() => err);
            default:
              break;
          }
        }
      }),
      finalize(() => {}),
    );
  }

  /**
   * Handle error 401
   * @param request httpRequest
   * @param next HttpHandler
   * @returns void
   */
  handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (this.isRefreshing) {
      return;
    }
    this.isRefreshing = true;
    /**
     * Check token and refresh.
     * If token exist retry access
     * If not -> logout
     */

    this.credentialService.isAuthenticated().then((isAuth: boolean) => {
      if (isAuth) {
        return next.handle(request);
      } else if (!this.router.url.includes(RoutePath.USER_LOGIN)) {
        // auto logout if 401 response returned from api
        this.authenticationService.logout();
      }
      this.isRefreshing = false;
    });
  }
}
