import { Component } from '@angular/core';

@Component({
  selector: 'app-style-guide',
  templateUrl: './style-guide.component.html'
})
export class StyleGuideComponent {
  linkPrefix = '/style-guide/';
  menuList = [
    {
      label: 'General',
      link: this.linkPrefix + 'general'
    },
    {
      label: 'Icons',
      link: this.linkPrefix + 'icons'
    },
    {
      label: 'Colors',
      link: this.linkPrefix + 'colors'
    },
    {
      label: 'Spaces',
      link: this.linkPrefix + 'spaces'
    },
    {
      label: 'Typography',
      link: this.linkPrefix + 'typo'
    },
    {
      label: 'Border and shadow',
      link: this.linkPrefix + 'border-shadow'
    },
    {
      label: 'Buttons',
      link: this.linkPrefix + 'buttons'
    },
    {
      label: 'Pagination',
      link: this.linkPrefix + 'pagination'
    },
    {
      label: 'Notify',
      link: this.linkPrefix + 'notify'
    },
    {
      label: 'Tags',
      link: this.linkPrefix + 'tags'
    },
    {
      label: 'Form',
      link: this.linkPrefix + 'form'
    },
    {
      label: 'Skeletons',
      link: this.linkPrefix + 'skeletons'
    },
    {
      label: 'Combine apis',
      link: this.linkPrefix + 'combine-apis'
    },
    {
      label: 'Array form',
      link: this.linkPrefix + 'array-form'
    },
    {
      label: 'Other directives',
      link: this.linkPrefix + 'others'
    }
  ];
  constructor() {}
}
