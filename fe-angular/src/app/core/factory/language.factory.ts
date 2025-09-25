import { LOCATION_INITIALIZED } from '@angular/common';
import { Injector } from '@angular/core';
import { LanguageService } from '../services/language.services';

export function languageInitializerFactory(
  languageService: LanguageService,
  injector: Injector,
) {
  return () =>
    new Promise<any>((resolve: any) => {
      const locationInitialized = injector.get(
        LOCATION_INITIALIZED,
        Promise.resolve(null),
      );
      locationInitialized.then(() => {
        languageService.setLanguage(languageService.defaultLanguage).subscribe({
          next: () => {
            console.info(`Successfully initialized language.`);
          },
          error: () => {
            console.error(`Problem with language initialization.`);
          },
          complete: () => {
            resolve(null);
          },
        });
      });
    });
}
