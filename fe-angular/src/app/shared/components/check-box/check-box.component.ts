import {
  Component,
  EventEmitter,
  input,
  Input,
  model,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { menuDropDown } from '@app/shared/animations/drop-down.animation';
import { SvgIcon } from '@app/shared/constants/svg-icon.constant';
@Component({
  selector: 'app-check-box',
  templateUrl: './check-box.component.html',
  styleUrls: ['./check-box.component.scss'],
  animations: [menuDropDown],
})
export class AppCheckBoxComponent implements OnInit, OnDestroy, OnChanges {
  id = input<string>('', { alias: 'id' });
  value = model<boolean>(false, { alias: 'value' });
  @Output() change = new EventEmitter<boolean>();
  text = input<string>('', { alias: 'text' });
  iconSize = input<number>(20, { alias: 'icon-size' });
  disabled = input<boolean>(false, { alias: 'disabled' });
  checkBoxIcon: SvgIcon;

  constructor() {}

  ngOnInit() {
    this.checkBoxIcon = this.value()
      ? SvgIcon.CheckBoxChecked
      : SvgIcon.CheckBoxBlank;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value']) {
      this.value = changes['value'].currentValue;
      this.checkBoxIcon = this.value()
        ? SvgIcon.CheckBoxChecked
        : SvgIcon.CheckBoxBlank;
    }
    if (changes['disabled']) {
      this.disabled = changes['disabled'].currentValue;
    }
  }

  ngOnDestroy(): void {}

  onToggleCheckBox() {
    if (!this.disabled) {
      this.value.set(!this.value());
      this.checkBoxIcon = this.value()
        ? SvgIcon.CheckBoxChecked
        : SvgIcon.CheckBoxBlank;
      this.change.emit(this.value());
    }
  }

  reset() {
    this.value.set(false);
    this.checkBoxIcon = this.value()
      ? SvgIcon.CheckBoxChecked
      : SvgIcon.CheckBoxBlank;
    this.change.emit(this.value());
  }
}
