import { Component } from '@angular/core';

@Component({
  selector: 'app-styleguilde-tags',
  templateUrl: './tags.component.html'
})
export default class TagsStyleGuideComponent {
  constructor() {}
  onRemove() {
    alert('Remove item');
  }
}
