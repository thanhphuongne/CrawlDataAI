import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
  forwardRef,
  EventEmitter,
  OnInit,
  Output,
  signal,
  input,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormsModule,
  NG_VALUE_ACCESSOR,
} from '@angular/forms';
import { CredentialsService } from '@app/core';
import { UserModel } from '@app/core/models/user.model';
import { DepartmentSaveModel } from '@app/open-api/common/models/department-save-model';
import { UserTypeEnum } from '@app/pages/user-permission/models/user-type.enum';
import { SvgIcon } from '@app/shared/constants/svg-icon.constant';
import { AppButtonDirectiveModule } from '@app/shared/directives/app-button/app-button.directive.module';
import { AppIconDirectiveModule } from '@app/shared/directives/app-icon/app-icon.directive.module';
import { AppClickOutSideDirectiveModule } from '@app/shared/directives/click-outside/click-outside.directive.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AngularTreeGridModule } from 'angular-tree-grid';

import { SelectItemComponent } from './select-item/select-item.component';
import { CommonUtils } from '@app/shared/utils/comon.utils';

@Component({
  selector: 'app-tree-select',
  templateUrl: './tree-select.component.html',
  styleUrls: ['./tree-select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AppTreeSelectComponent),
      multi: true,
    },
  ],
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    AngularTreeGridModule,
    AppIconDirectiveModule,
    AppButtonDirectiveModule,
    NgbTooltipModule,
    AppClickOutSideDirectiveModule,
    SelectItemComponent,
  ],
})
export class AppTreeSelectComponent
  implements ControlValueAccessor, OnChanges, OnInit
{
  @ViewChild('divCustoms') divCustoms: ElementRef;
  @Input() customerId: number;
  multiple = input<boolean>();
  @Input() isSelectedAll = false;
  @Input() isAllValue = true;
  @Input() functionKey: string;
  @Input() type: 'department' | 'area' = 'department';
  @Input() disableIds: Array<number> = [];
  @Input() listOptionInput: Array<DepartmentSaveModel> = [];
  readonly = input<boolean>(false);

  @Output() afterDataLoaded = new EventEmitter<Array<DepartmentSaveModel>>();

  userInfo: UserModel;
  selectedId: Array<number>;
  timer: any;
  countDisplaysSelect = 0;
  icons = SvgIcon;
  textSearch = '';
  heightDivCustoms = 50;
  displaySelectDepartment = signal(false);
  listDataOptions: Array<DepartmentSaveModel> = []; // list data init
  listDataSelects: Array<DepartmentSaveModel> = []; // list data select of dropdown
  selectedItems: Array<DepartmentSaveModel> = []; // list data selected
  handleSelectHeader: () => void;
  isLoadingData = false;
  selfSelectedId: number;
  selfSelectedIds: Array<number> = [];
  selfDisableIds: Array<number> = [];
  selfListOptionInput: Array<DepartmentSaveModel> = [];
  selfIsCheckSelectAll = false;

  /**
   * Change event instance
   */
  onChange: (data: Array<number> | number) => void;

  /**
   * Touched event instance
   */
  onTouched: () => void;

  configsSelect: any = {
    id_field: 'id',
    parent_id_field: 'parentId',
    parent_display_field: 'name',
    multi_select: false,
    css: {
      table_class: 'table_select',
      header_class: 'header_select',
      expand_icon:
        '<svg width="16" height="16" viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M5.29289 11.2929C5.68342 10.9024 6.31658 10.9024 6.70711 11.2929L16 20.5858L25.2929 11.2929C25.6834 10.9024 26.3166 10.9024 26.7071 11.2929C27.0976 11.6834 27.0976 12.3166 26.7071 12.7071L16.7071 22.7071C16.3166 23.0976 15.6834 23.0976 15.2929 22.7071L5.29289 12.7071C4.90237 12.3166 4.90237 11.6834 5.29289 11.2929Z" fill="currentColor"></path></svg>',
      collapse_icon:
        '<svg width="16" height="16" viewBox="0 0 32 32" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M15.2929 9.29289C15.6834 8.90237 16.3166 8.90237 16.7071 9.29289L26.7071 19.2929C27.0976 19.6834 27.0976 20.3166 26.7071 20.7071C26.3166 21.0976 25.6834 21.0976 25.2929 20.7071L16 11.4142L6.70711 20.7071C6.31658 21.0976 5.68342 21.0976 5.29289 20.7071C4.90237 20.3166 4.90237 19.6834 5.29289 19.2929L15.2929 9.29289Z" fill="currentColor"></path></svg>',
    },
    row_class_function: (rec: any) => {
      return 'is-child child-of-' + rec.parentId + ' level-' + rec.levelx;
    },
    columns: [
      {
        name: 'name',
        css_class: 'body_select-name',
        renderer: (value: string, item: any) => {
          return `<span class=${
            item.row_disable ? 'item_inactive' : 'item_active'
          }>${CommonUtils.htmlEscape(value)}<span>`;
        },
      },
    ],
  };
  constructor(
    private credentialsService: CredentialsService,
    private translate: TranslateService,
    private el: ElementRef,
  ) {
    this.userInfo = this.credentialsService.getUserInfoFromToken();
  }

  ngOnInit(): void {
    this.configsSelect.multi_select = this.multiple;
    if (this.multiple) {
      this.configsSelect.columns[0].type = 'custom';
      this.configsSelect.columns[0].component = SelectItemComponent;
    }
    this.configsSelect.data_loading_text = this.translate.instant(
      this.type === 'area' ? 'No data area!' : 'No data department!',
    );
    if (this.isSelectedAll) {
      const label = this.translate.instant('Select all');

      this.configsSelect.columns[0].header_renderer = () => {
        return `<span
        class="header_item w-full h-full inline-block"
      >${label}</span>`;
      };
    }

    this.getHeight();
  }

  ngOnChanges(objChange: SimpleChanges): void {
    if (this.disableIds) {
      this.selfDisableIds = [...this.disableIds];
    }

    if (
      (Object.prototype.hasOwnProperty.call(objChange, 'listOptionInput') ||
        Object.prototype.hasOwnProperty.call(objChange, 'readonly')) &&
      (this.listOptionInput?.length > 0 || this.listDataOptions?.length > 0)
    ) {
      if (this.listOptionInput?.length > 0) {
        this.convertListSelected([...this.listOptionInput]);
      } else if (this.listDataOptions?.length > 0) {
        this.convertListSelected([...this.listDataOptions]);
      }
    }
  }

  /**
   * Handle value change from out site
   * Important
   * Multiple : true -> ids : array number
   * Multiple : false -> ids : number
   * @param ids ids array number | number
   * @returns if ids null
   */
  writeValue(ids: Array<number> | number) {
    this.selfIsCheckSelectAll = false;
    if (!ids || (typeof ids === 'object' && ids.length === 0)) {
      this.selectedItems = [];
      this.selfSelectedId = null;
      this.selfSelectedIds = [];
      this.thenListSelected(this.selfIsCheckSelectAll);
      return;
    }
    if (typeof ids === 'object' && this.multiple) {
      if (ids.length === 1 && ids[0] === -1) {
        this.selfIsCheckSelectAll = true;
      } else {
        this.selfSelectedIds = [...ids];
      }
    }
    if (typeof ids === 'number' && !this.multiple) {
      this.selfSelectedId = ids;
    }
    this.thenListSelected(this.selfIsCheckSelectAll);
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
   * Handle data change select
   */
  changeValue() {
    if (this.onChange) {
      if (this.multiple) {
        if (this.selfIsCheckSelectAll && !this.isAllValue) {
          this.onChange([-1]);
        } else {
          this.onChange(this.selfSelectedIds);
        }
      } else {
        this.onChange(this.selfSelectedId);
      }
    }
  }


  /**
   * Execute function after data get
   * @param result any
   */
  afterGetData(result: any) {
    const res = JSON.parse(result);
    const data = res?.data || [];
    if (res) {
      this.convertListSelected(data);
    }

    this.afterDataLoaded.emit(data);
    this.isLoadingData = false;
  }

  /**
   * Convert list data selected
   * @param list list option select
   */
  convertListSelected(list: Array<DepartmentSaveModel>) {
    if (list) {
      this.selfListOptionInput = list;
      this.configsSelect.css.header_class =
        this.multiple && list.length > 0 && this.isSelectedAll
          ? 'header_select_all'
          : 'header_select';
      if (this.selfIsCheckSelectAll) {
        this.selfSelectedIds = list.map((d: DepartmentSaveModel) => d.id);
      }
      setTimeout(() => {
        this.thenListSelected(this.selfIsCheckSelectAll);
      }, 100);
    }
  }

  thenListSelected(checkAll: boolean) {
    this.listDataOptions = [
      ...this.selfListOptionInput.map((item: DepartmentSaveModel) => {
        return {
          ...item,
          row_disable: this.selfDisableIds.includes(item.id),
          row_selected: this.multiple
            ? this.selfSelectedIds.includes(item.id)
            : this.selfSelectedId === item.id,
        };
      }),
    ];
    if (checkAll) {
      this.selectedItems = [
        {
          name: this.translate.instant('Select all'),
          id: -1,
          parentId: 0,
        },
      ];
    } else {
      this.selectedItems = [
        ...this.listDataOptions.filter((item: DepartmentSaveModel) => {
          return this.multiple
            ? this.selfSelectedIds.includes(item.id)
            : this.selfSelectedId === item.id;
        }),
      ];
    }
    this.selfIsCheckSelectAll = checkAll;
  }

  /**
   * Action trigger checkbox
   * @param e any
   */
  selectHeader(e: any) {
    if (e.target.className === 'header_item w-full h-full inline-block') {
      const checkBox = e.target.offsetParent
        .closest('tr')
        .querySelector('input');
      checkBox.click();
    }
  }

  /**
   * Toggle display dropdown select department
   */
  onDisplaySelect(e: any) {
    if (e.target !== e.currentTarget) return;

    this.displaySelectDepartment.set(!this.displaySelectDepartment);
    this.textSearch = '';
    ++this.countDisplaysSelect;
    if (this.displaySelectDepartment()) {
      this.listDataSelects = [...this.listDataOptions];
    } else {
      this.changeValue();
    }
    if (this.countDisplaysSelect === 1) {
      const button = this.el.nativeElement.querySelector('.select_customs');
      this.handleSelectHeader = button.addEventListener('click', (event: any) =>
        this.selectHeader(event),
      );
    }
  }

  /**
   * Close display dropdown select department
   */
  onCloseDropdown() {
    if (this.displaySelectDepartment) {
      if (this.handleSelectHeader) this.handleSelectHeader();
      this.displaySelectDepartment.set(false);
      this.textSearch = '';
      this.changeValue();
    }
  }

  /**
   * Create timer
   * @param text text search
   */
  changeTextSearch(e: any) {
    if (!e) {
      this.doSearch('');
      return;
    }

    if (this.timer) {
      clearTimeout(this.timer);
    }

    this.timer = setTimeout(() => {
      this.doSearch(e.target.value);
    }, 300);
  }

  /**
   * Search list department select
   * @param text text search
   */
  doSearch(text: string) {
    this.textSearch = text;
    this.listDataSelects = [
      ...this.listDataOptions.filter((item: DepartmentSaveModel) =>
        item.name.toLowerCase().includes(text.toLowerCase()),
      ),
    ];
  }

  /**
   * select department
   * @param item item select
   */
  actionSelect(item: any) {
    if (this.multiple) {
      this.selfSelectedIds = [...this.selfSelectedIds, item.data.id];
    } else if (!item.data.row_disable) {
      this.selfSelectedId = item.data.id;
      this.onCloseDropdown();
    }

    this.thenListSelected(this.checkSelectAllItem());
    this.getHeight();
  }

  /**
   * Deselect department
   * @param item item deselect
   */
  actionDeselect(item: any) {
    if (this.multiple) {
      this.selfSelectedIds = this.selfSelectedIds.filter((id: number) => {
        return id !== item.data.id;
      });
    }
    this.thenListSelected(false);
    this.getHeight();
  }

  /**
   * Action select all option in listDataSelect
   */
  actionSelectAll() {
    this.selfSelectedIds = [];
    if (this.multiple) {
      const selfSelectedIdsTemp = [];
      this.listDataOptions.forEach((item: DepartmentSaveModel) => {
        selfSelectedIdsTemp.push(item.id);
      });
      this.selfSelectedIds = [...selfSelectedIdsTemp];
    }
    this.thenListSelected(true);
    this.getHeight();
  }

  /**
   * Action deselect all option in listDataSelect
   */
  actionDeselectAll() {
    this.selfSelectedIds = this.selfSelectedIds.filter(
      (item: number) =>
        !this.listDataSelects.find((d: DepartmentSaveModel) => d.id === item),
    );
    this.thenListSelected(false);
    this.getHeight();
  }

  /**
   * Deselect department in element input
   * @param item item deselect
   */
  onClearItemSelect(item: DepartmentSaveModel) {
    if (this.multiple) {
      if (this.selfIsCheckSelectAll) {
        this.selfSelectedIds = [];
      } else {
        this.selfSelectedIds = this.selfSelectedIds.filter((id: number) => {
          return id !== item.id;
        });
      }
    } else {
      this.selfSelectedId = null;
    }
    this.thenListSelected(false);
    this.getHeight();
    this.doSearch(this.textSearch);
    this.changeValue();
  }

  /**
   * Check select all item
   * @returns boolean
   */
  checkSelectAllItem() {
    return (
      this.multiple &&
      !this.listDataOptions.find(
        (item: DepartmentSaveModel) =>
          !this.selfSelectedIds.find((d: number) => d === item.id),
      )
    );
  }

  /**
   * get height of (DOM) Element divCustoms
   */
  getHeight() {
    setTimeout(() => {
      this.heightDivCustoms = this.divCustoms.nativeElement.offsetHeight;
    }, 100);
  }
}
