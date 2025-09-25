import { Component, OnInit } from '@angular/core';

import { AuthenticationService, CredentialsService, Logger } from '@app/core';
import { environment } from '@environments/environment';
import { SvgIconLoaderService } from './core/services/svg-icon-loader.service';

const log = new Logger('App');

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    // do not remove the analytics injection, even if the call in ngOnInit() is removed
    // this injection initializes page tracking through the router
    // private angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics,
    private readonly iconLoaderService: SvgIconLoaderService,
    private readonly credentialsService: CredentialsService,
    private readonly authService: AuthenticationService,
  ) {
    this.iconLoaderService.init();
  }
  ngOnInit() {
    // Setup logger
    if (environment.production) {
      Logger.enableProductionMode();
    }
  }
}
