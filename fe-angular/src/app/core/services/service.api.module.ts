import { ModuleWithProviders, NgModule } from '@angular/core';
import { MultiApiConfigurationParams } from '../models/multi-configuration-params.model';
import { ApiConfiguration } from '@app/open-api/api-configuration';

/**
 * Module that provides all services and configuration.
 */
@NgModule({
  imports: [],
  exports: [],
  declarations: [],
  providers: [ApiConfiguration],
})
export class ServiceApiModule {
  static forRoot(
    params: MultiApiConfigurationParams,
  ): ModuleWithProviders<ServiceApiModule> {
    return {
      ngModule: ServiceApiModule,
      providers: [
        {
          provide: ApiConfiguration,
          useValue: { rootUrl: params.rootUrl },
        },
      ],
    };
  }
}
