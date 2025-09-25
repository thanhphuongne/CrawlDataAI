import { Component, Input } from '@angular/core';
import { itemDropDown } from '@app/shared/animations/drop-down.animation';
import { SelectableItem } from '../../models/selectable-item';
import { SelectService } from '../../services/select.service';

@Component({
  selector: 'input-tree-dropdown-item',
  templateUrl: './input-tree-dropdown-item.component.html',
  styleUrls: ['./input-tree-dropdown-item.component.scss'],
  animations: [itemDropDown]
})
export class InputTreeDropdownItemComponent {
  public get isOpen() {
    return this.item.isOpen;
  }

  @Input() public onTouchedCallBack: () => void;

  @Input()
  public item: SelectableItem;

  public constructor(private svc: SelectService) {}

  public toggleOpen($event: any) {
    $event.stopPropagation();
    if (this.haveChildren) {
      this.item.isOpen = !this.item.isOpen;
    } else {
      this.select($event);
    }
  }

  get allowParentSelection(): boolean {
    return this.svc.Configuration.allowParentSelection;
  }

  get restructureWhenChildSameName(): boolean {
    return this.svc.Configuration.restructureWhenChildSameName;
  }

  get needCheckBox(): boolean {
    return (
      this.svc.Configuration.isHierarchy() &&
      this.svc.Configuration.allowMultiple
    );
  }

  public get haveChildren(): boolean {
    if (
      this.restructureWhenChildSameName &&
      this.item &&
      this.item.children &&
      this.item.children.length === 1 &&
      this.item.text === this.item.children[0].text
    ) {
      this.item = this.item.children[0];
    }
    return this.item && this.item.children && this.item.children.length > 0;
  }

  public select($event: any): void {
    $event.stopPropagation();
    if (
      this.svc.Configuration.allowMultiple ||
      !this.haveChildren ||
      this.svc.Configuration.allowParentSelection
    ) {
      this.svc.toggleItemSelection(this.item);
    }
    this.onTouchedCallBack();
  }

  public get filter(): string {
    return this.svc.Configuration.filter;
  }
}
