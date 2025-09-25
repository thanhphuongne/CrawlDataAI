import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LocalStorageService } from './local-storage.service';
import { environment } from '@environments/environment';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  public languages: string[] = environment.supportedLanguages;

  constructor(
    private translate: TranslateService,
    private localStorageService: LocalStorageService
  ) {
    this.translate.addLangs(this.languages);

    this.setLanguage(this.defaultLanguage);
  }

  /**
   * Get default language of system.
   */
  get defaultLanguage(): string {
    let language: string;
    if (this.localStorageService.getString('lang')) {
      language = this.localStorageService.getString('lang');
    } else {
      const browserLang = this.translate.getBrowserLang();
      language = this.languages.some(lang => lang === browserLang)
        ? environment.defaultLanguage
        : browserLang;
    }
    return language;
  }
  /**
   * Change language for system.
   * @param lang string, language key
   */
  public setLanguage(lang: string) {
    this.localStorageService.setString('lang', lang);
    return this.translate.use(lang);
  }
}
