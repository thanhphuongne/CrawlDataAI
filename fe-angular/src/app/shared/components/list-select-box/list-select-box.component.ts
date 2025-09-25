import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { menuDropDown } from '@app/shared/animations/drop-down.animation';
import { ListSelectItem } from '@app/shared/models/list-select-item.model';
@Component({
  selector: 'app-list-select-box',
  templateUrl: './list-select-box.component.html',
  styleUrls: ['./list-select-box.component.scss'],
  animations: [menuDropDown]
})
export class ListSelectBoxComponent implements OnInit {
  @Input() listItems: ListSelectItem[];
  @Input() zStyle: any;
  @Input() isSearching: any;
  @Input() enableSearch: any;
  @Input() placeholder: string;
  @Input() selectedItem: ListSelectItem;
  @Output() onSelectItem = new EventEmitter<ListSelectItem>();
  @Input() disableFocus: boolean;
  @Input() disabled: boolean;
  @Input() disabledMenu: boolean;
  @Input() showMoreText: boolean;

  @Output() onMenuToggle = new EventEmitter<boolean>();
  @Output() keyWordChange = new EventEmitter<string>();
  @Output() clickShowMore = new EventEmitter<any>();
  isOpen = false;
  keyWord = '';
  constructor() {}

  ngOnInit() {
    if (!this.selectedItem) {
      this.selectedItem = this.listItems ? this.listItems[0] : {};
    }
  }

  onClickItem(value: ListSelectItem) {
    this.onSelectItem.emit(value);
    this.selectedItem = value;
    this.isOpen = false;
    this.onMenuToggle.emit(this.isOpen);
  }

  onToggleMenu() {
    if (!this.disabled && !this.disabledMenu) {
      this.isOpen = !this.isOpen;
      this.onMenuToggle.emit(this.isOpen);
    }
  }

  onKeyWordChange(keyword: any) {
    this.keyWordChange.emit(keyword);
  }

  onClickShowMore($event: any) {
    if (this.clickShowMore) {
      this.clickShowMore.emit($event);
    }
  }

  reset() {
    this.keyWord = '';
    this.selectedItem = this.listItems ? this.listItems[0] : {};
  }

  onClickOutSide(ev: any) {
    if (this.isOpen) {
      this.isOpen = false;
      this.onMenuToggle.emit(this.isOpen);
    }
  }
}
