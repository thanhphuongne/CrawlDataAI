import { CommonModule } from '@angular/common';
import { Component, input, Input, model, OnInit } from '@angular/core';

@Component({
  selector: 'app-form-label',
  templateUrl: './form-label.component.html',
  standalone: true,
  imports: [CommonModule],
})
export class AppFormLabelComponent {
  required = input<boolean>(false, { alias: 'required' });
  customClass = model('', {
    alias: 'customClass',
  });

  constructor() {
    this.customClass.set(this.customClass() + 'pb-1 flex gap-1 text-secondary');
  }
}
