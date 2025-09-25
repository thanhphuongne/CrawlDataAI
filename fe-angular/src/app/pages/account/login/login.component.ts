import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RoutePath } from '@app/configs/models/route.enum';
import { SITE_IDENTITY } from '@app/configs/site-identity.constants';
import {
  AuthenticationService,
  LoginResultEnum,
} from '@app/core/services/authentication.service';
import { CredentialsService } from '@app/core/services/credentials.service';
import { ERRORS_CONSTANT } from '@app/shared/constants/error.constants';
import { SvgIcon } from '@app/shared/constants/svg-icon.constant';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  password = '';
  loginForm: FormGroup;
  submitted = signal<boolean>(false);
  year = new Date().getFullYear();
  error = signal<string>('');
  siteIdentity = SITE_IDENTITY;
  errors = ERRORS_CONSTANT;
  listIcons = SvgIcon;
  remainingDays: number = 0;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthenticationService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private credentialsService: CredentialsService,
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      remember: true,
    });
  }
  ngOnInit() {
    this.credentialsService
      .isAuthenticated()
      .then((res: any) => {
        if (res) {
          this.router.navigate([this.getReturnUrl()]);
        }
      })
      .catch((err) => {
        console.log('AUTHEN err', err);
      });
  }
  /**
   * login - excute login when submit
   */
  login() {
    this.submitted.set(true);
    if (this.loginForm.valid) {
      this.authService
        .login({
          accountName: this.loginForm.get('username').value,
          password: this.loginForm.get('password').value,
        })
        .subscribe({
          next: (res: any) => {
            switch (res) {
              case LoginResultEnum.SUCCESS:
                this.router.navigateByUrl('/home');
                break;
              case LoginResultEnum.ERROR_OTHERS:
                this.error.set(this.errors.GENERAL.UNEXPECTED_ERROR);
                break;
              case LoginResultEnum.ERROR_WRONG_USERNAME_PASSWORD:
                this.error.set(this.errors.WRONG_USER_PASS);
                break;
            }
          },
          error: () => {
            this.error.set(this.errors.GENERAL.UNEXPECTED_ERROR);
          },
        });
    }
  }

  /**
   * Get return url after logged
   * @returns string url after login
   */
  getReturnUrl(): string {
    const returnUrl = this.activatedRoute.snapshot.queryParams['returnUrl'];
    if (returnUrl) {
      const callbackUrl = returnUrl.includes(RoutePath.USER_LOGIN)
        ? '/'
        : returnUrl;
      return callbackUrl;
    } else {
      return RoutePath.LANDING;
    }
  }
}
