import { HttpClient, provideHttpClient } from '@angular/common/http';
import {
  APP_INITIALIZER,
  Injector,
  NgModule,
  provideExperimentalZonelessChangeDetection,
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CoreModule } from '@app/core';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
// Menu Items
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from '@environments/environment';
import {
  NgbDateParserFormatter,
  NgbTooltipModule,
} from '@ng-bootstrap/ng-bootstrap';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { languageInitializerFactory } from './core/factory/language.factory';
import { LanguageService } from './core/services/language.services';
import { ExtrapagesModule } from './extra-pages/extrapages.module';
import { LayoutModule } from './layout/layout.module';
import { AppToastrComponent } from './shared/components/app-toastr/toastr.component';
import { AppButtonDirectiveModule } from './shared/directives/app-button/app-button.directive.module';
import { AppIconDirectiveModule } from './shared/directives/app-icon/app-icon.directive.module';
import { DatePickerFormatter } from './shared/utils/datepicker-format.utils';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import vn from '@angular/common/locales/vi';
import { vi_VN, provideNzI18n } from 'ng-zorro-antd/i18n';
import { ApiModule } from './open-api/api.module';

registerLocaleData(en);
registerLocaleData(vn);

export function createTranslateLoader(http: HttpClient): any {
  return new TranslateHttpLoader(http, 'assets/i18n/', '.json');
}
export const provideTranslation = () => ({
  loader: {
    provide: TranslateLoader,
    useFactory: createTranslateLoader,
    deps: [HttpClient],
  },
});

const configUrl = window['__env']?.apiUrl || environment.rootUrl;

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    BrowserAnimationsModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
    CoreModule,
    NzModalModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzButtonModule,
    NgSelectModule,
    AppButtonDirectiveModule,
    AppIconDirectiveModule,
    AngularSvgIconModule.forRoot(),
    ToastrModule.forRoot({
      timeOut: 5000,
      progressBar: false,
      positionClass: 'toast-top-right',
      toastComponent: AppToastrComponent,
      closeButton: true,
    }),
    NgbTooltipModule,
    ApiModule.forRoot({
      rootUrl: configUrl,
    }),
    LayoutModule,
    ExtrapagesModule,
    AppRoutingModule, // must be imported as the last module as it contains the fallback route,
  ],
  declarations: [AppComponent, AppToastrComponent],
  providers: [
    provideHttpClient(),
    ToastrService,
    { provide: NgbDateParserFormatter, useClass: DatePickerFormatter },
    {
      provide: APP_INITIALIZER,
      useFactory: languageInitializerFactory,
      deps: [LanguageService, Injector],
      multi: true,
    },
    provideExperimentalZonelessChangeDetection(),
    provideNzI18n(vi_VN),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  AppInjector: Injector;
  constructor(private readonly injector: Injector) {
    this.AppInjector = this.injector;
  }
}
