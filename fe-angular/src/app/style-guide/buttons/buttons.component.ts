import { Component } from '@angular/core';

@Component({
  selector: 'app-styleguilde-button',
  templateUrl: './buttons.component.html'
})
export default class ButtonsStyleGuideComponent {
  constructor() {}
  hello() {
    alert('Hello');
  }
}
