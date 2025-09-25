import {
  Component,
  EventEmitter,
  input,
  model,
  OnInit,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { checkMobileWeb } from '@app/shared/utils/responsive.utils';
import { environment } from '@environments/environment';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule } from '@angular/forms';
import { PaginationModel } from './model/app-pagination.model';
import { LocalStorageKeyEnum } from '@app/shared/constants/enums/local-storage-key.enum';
import { LocalStorageService } from '@app/core/services/local-storage.service';
import { TranslateModule } from '@ngx-translate/core';
import { SvgIcon } from '@app/shared/constants/svg-icon.constant';
import { AppIconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-pagination',
  templateUrl: './app-pagination.component.html',
  styleUrls: ['./app-pagination.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    NgbPaginationModule,
    NgSelectModule,
    FormsModule,
    TranslateModule,
    AppIconComponent,
  ],
})
export class AppPaginationComponent implements OnInit {
  pageIndex = model<number>(null, { alias: 'pageIndex' });
  pageSize = model<number>(environment.pageSize, { alias: 'pageSize' });
  collectionSize = input<number>(null, { alias: 'collectionSize' });
  showPageSize = input<boolean>(true, { alias: 'showPageSize' });

  @Output() pageChange = new EventEmitter<PaginationModel>();
  maxSize: number;
  icons = SvgIcon;
  listPageSize = [12, 25, 50, 100];

  constructor(
    private readonly activedRoute: ActivatedRoute,
    private readonly router: Router,
    private readonly localStorageService: LocalStorageService,
  ) {}

  ngOnInit(): void {
    this.maxSize = checkMobileWeb() ? 2 : 4;
    if (this.localStorageService.getNumber(LocalStorageKeyEnum.PAGE_SIZE)) {
      this.pageSize.set(
        this.localStorageService.getNumber(LocalStorageKeyEnum.PAGE_SIZE),
      );
    }
  }

  /**
   * Change number page
   * @param ev any
   * @returns if pageIndex === ev
   */
  changeNumberPage(ev: any) {
    if (this.pageIndex() === +ev) {
      return;
    }

    this.pageIndex.set(+ev);
    const queryParams: Params = {
      page: this.pageIndex,
    };

    this.router.navigate([], {
      relativeTo: this.activedRoute,
      queryParams,
      queryParamsHandling: 'merge',
    });

    this.pageChange.emit({
      pageIndex: this.pageIndex(),
      pageSize: this.pageSize(),
    });
  }

  /**
   * Change page size
   * @param ev any
   */
  onChangePageSize(ev: any) {
    if (this.pageSize() === +ev) return;
    this.pageSize.set(+ev);
    this.localStorageService.setNumber(
      LocalStorageKeyEnum.PAGE_SIZE,
      this.pageSize(),
    );

    if (
      this.pageIndex() <= Math.ceil(this.collectionSize() / this.pageSize())
    ) {
      const queryParams: Params = {
        page: this.pageIndex(),
      };
      
      this.router.navigate([], {
        relativeTo: this.activedRoute,
        queryParams,
        queryParamsHandling: 'merge',
      });

      this.pageChange.emit({
        pageIndex: this.pageIndex(),
        pageSize: this.pageSize(),
      });
    }
  }
}
