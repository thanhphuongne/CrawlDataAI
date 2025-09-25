import { CommonModule } from '@angular/common';
import { Component, input, Input, OnChanges, OnInit } from '@angular/core';

@Component({
  selector: 'app-validator-message',
  templateUrl: './validator-message.component.html',
  standalone: true,
  imports: [CommonModule],
})
export class AppValidatorMessageComponent implements OnInit, OnChanges {
  type = input<'message' | 'block'>('message', { alias: 'type' });
  variant = input<'info' | 'success' | 'danger' | 'warning'>('danger', {
    alias: 'variant',
  });
  customClass = input<string>('', { alias: 'customClass' });
  elClass = '';

  ngOnInit(): void {
    this.setClass();
  }

  ngOnChanges() {
    this.setClass();
  }

  /**
   * Set class for view
   */
  setClass() {
    let colorClass: string;
    let bgClass: string;

    switch (this.variant()) {
      case 'info':
        colorClass = 'text-blue-600';
        bgClass = ' bg-blue-600';
        break;
      case 'success':
        colorClass = 'text-green-600';
        bgClass = ' bg-green-600';
        break;
      case 'warning':
        colorClass = 'text-yellow-500';
        bgClass = ' bg-yellow-500';
        break;
      default:
        colorClass = 'text-red-400';
        bgClass = ' bg-red-400';
        break;
    }
    this.elClass =
      colorClass +
      (this.type() === 'message'
        ? ' text-sm py-2'
        : bgClass + ' w-full px-3 py-2 br-1 mb-2 bg-opacity-20') +
      ' ' +
      this.customClass();
  }
}
