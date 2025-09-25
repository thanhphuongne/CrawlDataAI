import { Injectable } from '@angular/core';
import { SVG_ICONS } from '@app/shared/constants/svg-icon.constant';
import { SvgIconRegistryService } from 'angular-svg-icon';

@Injectable({ providedIn: 'root' })
export class SvgIconLoaderService {
  constructor(private readonly iconReg: SvgIconRegistryService) {}

  init() {
    SVG_ICONS.forEach(item => {
      this.iconReg.addSvg(item.name, item.src);
    });
  }
}
