import { Component } from '@angular/core';
import { SvgIcon } from '@app/shared/constants/svg-icon.constant';

@Component({
  selector: 'app-icons',
  templateUrl: './icons.component.html'
})
export default class IconsComponent {
  iconList = Object.entries(SvgIcon);
  constructor() {}
}
