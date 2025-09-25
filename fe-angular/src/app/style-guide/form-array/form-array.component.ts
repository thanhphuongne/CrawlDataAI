import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ERRORS_CONSTANT } from '@app/shared/constants/error.constants';
import { SvgIcon } from '@app/shared/constants/svg-icon.constant';

@Component({
  selector: 'app-styleguilde-array-form',
  templateUrl: './form-array.component.html'
})
export default class ArrayFormStyleGuideComponent {
  icons = SvgIcon;
  arrayForm: FormGroup;
  listError = ERRORS_CONSTANT;
  constructor(private formBuilder: FormBuilder) {
    this.arrayForm = this.formBuilder.group({
      controlAreas: this.formBuilder.array([this.initAddress()])
    });
  }

  initAddress() {
    return this.formBuilder.group({
      controlAreaId: ['', Validators.required],
      workShiftId: ['', Validators.required]
    });
  }
  createArrayForm() {
    console.log(this.arrayForm.value);
  }

  /**
   * Add control area
   */
  addControlArea() {
    const control = this.arrayForm.get('controlAreas') as FormArray;
    control.push(this.initAddress());
  }

  /**
   * Remove control area
   * @param i number
   */
  removeControlArea(i: number) {
    const control = this.arrayForm.get('controlAreas') as FormArray;
    control.removeAt(i);
  }
}
