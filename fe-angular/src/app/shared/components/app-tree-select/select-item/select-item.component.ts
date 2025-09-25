import { Component, input } from '@angular/core';
@Component({
  selector: 'app-select-item-component',
  standalone: true,
  template: `
    <span
      [class]="row_data().row_disable ? 'item_inactive' : 'item_active'"
      (click)="selectItem($event)"
    >
      {{ cell_value() }}</span
    >
  `,
})
export class SelectItemComponent {
  column = input<any>();
  cell_value = input<string>();
  row_data = input<any>();

  /**
   * Handle click to label and toggle selected.
   * @param ev element
   */
  selectItem(ev: any) {
    const checkBox = ev.target.offsetParent
      .closest('tr')
      .querySelector('input');
    checkBox.click();
  }
}
