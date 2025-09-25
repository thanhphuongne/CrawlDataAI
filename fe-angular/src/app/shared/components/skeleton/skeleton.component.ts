import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-skeleton',
  templateUrl: './skeleton.component.html',
  standalone: true,
  imports: [CommonModule],
})
export class AppSkeletonComponent {
  type = input<'grid-item' | 'list-item' | 'multi-lines'>('multi-lines', {
    alias: 'type',
  });
  repeat = input<number>(1, { alias: 'repeat' });
  customClass = input<string>('', { alias: 'customClass' });

  numSequence(n: number): Array<number> {
    return Array(n);
  }
}
