import { Component } from '@angular/core';

@Component({
  selector: 'app-typo',
  templateUrl: './typo.component.html'
})
export default class TypoComponent {
  fontData = [
    {
      label: 'small',
      class: '.small, small, --font-sm',
      css: 'small',
      style: 'font-size:12px'
    },
    {
      label: 'caption',
      class: '.caption, caption, --font-sm, --font-semibold',
      css: 'caption',
      style: 'font-size:12px; font-weight:600'
    },
    {
      label: 'Text extra small',
      class: '.font-xs, --font-xs',
      css: 'font-xs',
      style: 'font-size:10px'
    },
    {
      label: 'Text small',
      class: '.font-sm, --font-sm',
      css: 'font-sm',
      style: 'font-size:12px'
    },
    {
      label: 'Text medium',
      class: '.font-md, --font-md',
      css: 'font-md',
      style: 'font-size:14px'
    },
    {
      label: 'Text large',
      class: '.font-lg, --font-lg',
      css: 'font-lg',
      style: 'font-size:16px'
    },
    {
      label: 'Text extra large',
      class: '.font-xl, --font-xl',
      css: 'font-xl',
      style: 'font-size:18px'
    },
    {
      label: 'Text 2 extra large',
      class: '.font-2xl, --font-2xl',
      css: 'font-2xl',
      style: 'font-size:24px'
    },
    {
      label: 'Text 3 extra large',
      class: '.font-3xl, --font-3xl',
      css: 'font-3xl',
      style: 'font-size:28px'
    },
    {
      label: 'Text 4 extra large',
      class: '.font-4xl, --font-4xl',
      css: 'font-4xl',
      style: 'font-size:36px'
    },
    {
      label: 'Heading 6',
      class: 'h6, .h6, --font-md, --font-semibold, --heading-color',
      css: 'h6',
      style: 'font-size:14px; font-weight:600'
    },
    {
      label: 'Heading 5',
      class: 'h5, .h5, --font-lg, --font-semibold, --heading-color',
      css: 'h5',
      style: 'font-size:16px; font-weight:600'
    },
    {
      label: 'Heading 4',
      class: 'h4, .h4, --font-xl, --font-semibold, --heading-color',
      css: 'h4',
      style: 'font-size:18px; font-weight:600'
    },
    {
      label: 'Heading 3',
      class: 'h3, .h3, --font-2xl, --font-bold, --heading-color',
      css: 'h3',
      style: 'font-size:24px; font-weight:700'
    },
    {
      label: 'Heading 2',
      class: 'h2, .h2, --font-3xl, --font-bold, --heading-color',
      css: 'h2',
      style: 'font-size:28px; font-weight:700'
    },
    {
      label: 'Heading 1',
      class: 'h1, .h1, --font-4xl, --font-bold, --heading-color',
      css: 'h1',
      style: 'font-size:36px; font-weight:700'
    }
  ];
  constructor() {}
}
