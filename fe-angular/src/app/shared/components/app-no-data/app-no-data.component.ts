import { CommonModule } from '@angular/common';
import { Component, input, Input } from '@angular/core';
import { SvgIcon } from '@app/shared/constants/svg-icon.constant';
import { TranslateModule } from '@ngx-translate/core';
import { AppIconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-no-data',
  templateUrl: './app-no-data.component.html',
  standalone: true,
  imports: [AppIconComponent, CommonModule, TranslateModule],
})
export class AppNoDataComponent {
  iconSize = input<number>(80, { alias: 'icon-size' });
  title = input<string>('', { alias: 'title' });
  message = input<string>('No data found!', { alias: 'message' });
  listIcons = SvgIcon;
}
