import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DateTimeFormatPipe } from '@app/shared/pipes/date-time-format.pipe';
import { AppLoaderDirectiveModule } from './directives/app-loader/app-loader.directive.module';
import { DurationFormatHourPipe } from './pipes/duration-format-hour.pipe';
import { DurationFormatPipe } from './pipes/duration-format.pipe';
import { SafeUrlPipe } from './pipes/safe-url.pipe';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { TruncatePipe } from './pipes/trucate.pipe';

@NgModule({
  imports: [FormsModule, AppLoaderDirectiveModule, AngularSvgIconModule],
  declarations: [
    DateTimeFormatPipe,
    DurationFormatPipe,
    DurationFormatHourPipe,
    TruncatePipe,
    SafeUrlPipe
  ],
  exports: [
    DateTimeFormatPipe,
    DurationFormatPipe,
    DurationFormatHourPipe,
    TruncatePipe,
    SafeUrlPipe
  ]
})
export class SharedModule {}
