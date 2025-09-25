import { trigger, animate, transition, style } from '@angular/animations';

export const menuDropDown = trigger('menuDropDown', [
  transition(':enter', [
    // :enter is alias to 'void => *'
    style({ opacity: 0, transform: 'scale(1, 0.8)' }),
    animate(
      '120ms cubic-bezier(0, 0, 0.2, 1)',
      style({ opacity: 1, transform: 'scale(1, 1)' })
    )
  ]),
  transition(':leave', [
    // :leave is alias to '* => void'
    style({ opacity: 1, transform: 'scale(1, 1)' }),
    animate('100ms linear', style({ opacity: 0 }))
  ])
]);

export const itemDropDown = trigger('itemDropDown', [
  transition(':enter', [
    style({ height: 0, opacity: 0, transform: 'translateY(-10px)' }),
    animate(150)
  ]),
  transition(':leave', [
    animate(
      100,
      style({ height: 0, opacity: 0, transform: 'translateY(-10px)' })
    )
  ])
]);
