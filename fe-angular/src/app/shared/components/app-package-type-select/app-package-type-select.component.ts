import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  forwardRef
} from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR
} from '@angular/forms';
import { PACKAGE_TYPES } from '@app/configs/package.constants';
import { GetPackageServices } from '@app/layout/services/get-package.service';
import { AppIconDirectiveModule } from '@app/shared/directives/app-icon/app-icon.directive.module';
import { AppInputExtendFeaturesDirectiveModule } from '@app/shared/directives/app-input-extend-features/app-input-extend-features.module';
import { NgSelectComponent, NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
  selector: 'app-package-type-select',
  templateUrl: './app-package-type-select.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AppPackageTypeSelectComponent),
      multi: true
    }
  ],
  standalone: true,
  imports: [
    CommonModule,
    NgSelectModule,
    TranslateModule,
    FormsModule,
    AppIconDirectiveModule,
    AppInputExtendFeaturesDirectiveModule
  ]
})
export class AppPackageTypeSelectComponent
  implements ControlValueAccessor, OnInit, OnDestroy {
  @ViewChild('selectBox') selectBox: NgSelectComponent;
  @Input() multiple = false;
  @Input() placeholder: string;
  @Input() customerId: number;
  @Input() readonly: boolean;

  disabled: boolean;
  selectedId: Array<number> | number;
  listData = Object.values(PACKAGE_TYPES);
  isLoading: boolean;
  packageInstalledObs: Subscription;
  textSearch: string;
  /**
   * Change event instance
   */
  onChange: (data: Array<number> | number) => void;

  /**
   * Touched event instance
   */
  onTouched: () => void;

  constructor(private getPackageServices: GetPackageServices) {}
  ngOnInit() {
    this.packageInstalledObs = this.getPackageServices.getPackageInstalledObs.subscribe(
      (result: any) => {
        if (this.customerId) {
          this.listData = this.listData.filter((item: any) => {
            return result.find((res: any) => res.key === item.key);
          });
        } else {
          this.listData = Object.values(PACKAGE_TYPES);
        }
      }
    );
  }
  ngOnDestroy(): void {
    if (this.packageInstalledObs) {
      this.packageInstalledObs.unsubscribe();
    }
  }
  /**
   * Handle value change from out site
   * @param ids array number | number
   */
  writeValue(ids: Array<number> | number) {
    this.selectedId = ids;
  }

  /**
   * Register change event
   * @param fn function
   */
  registerOnChange(fn: any) {
    if (fn) {
      this.onChange = fn;
    }
  }

  /**
   * Register touched event
   * @param fn function
   */
  registerOnTouched(fn: () => void) {
    if (fn) {
      this.onTouched = fn;
    }
  }

  /**
   * Set component disabled
   * @param isDisabled boolean
   */
  setDisabledState(isDisabled: boolean) {
    this.disabled = isDisabled;
  }

  /**
   * Handle data change select
   */
  changeValue() {
    this.onChange(this.selectedId);
  }
  
  /**
   * Search list option
   */
  onSearch() {
    this.selectBox.filter(this.textSearch);
  }
}
