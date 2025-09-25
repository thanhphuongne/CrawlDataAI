import {
  trigger,
  animate,
  transition,
  style,
  query,
  group,
  animateChild
} from '@angular/animations';

export const fadeAnimation = trigger('fadeAnimation', [
  transition('* => *', [
    query(
      ':enter, :leave',
      style({
        opacity: 0,
        position: 'absolute',
        width: 'calc(100% - 36px)',
        height: '100%'
      }),
      { optional: true }
    ),
    query(':enter', style({ opacity: 1 }), { optional: true }),

    group([
      query(
        ':leave',
        [
          style({ opacity: 1 }),
          animate('0.0s ease-in-out', style({ opacity: 0 }))
        ],
        { optional: true }
      ),
      query(
        ':enter',
        [
          style({ opacity: 0 }),
          animate('0.7s ease-in-out', style({ opacity: 1 })),
          animateChild()
        ],
        { optional: true }
      )
    ])
  ])
]);

export const fadeInOutAnimation = trigger('fadeInOutAnimation', [
  transition(':enter', [
    // :enter is alias to 'void => *'
    style({ opacity: 0 }),
    animate('0.3s ease-in', style({ opacity: 1 }))
  ]),
  transition(':leave', [
    // :leave is alias to '* => void'
    style({ opacity: 1 }),
    animate('0.3s ease-out', style({ opacity: 0 }))
  ])
]);

export const logoSlideAnimation = trigger('logoSlideAnimation', [
  transition(':enter', [
    // :enter is alias to 'void => *'
    style({ opacity: 0, transform: 'translateX(-55%)' }),
    animate('0.3s ease-in', style({ opacity: 1, transform: 'translateX(0%)' }))
  ]),
  transition(':leave', [
    // :leave is alias to '* => void'
    style({ opacity: 1, transform: 'translateX(0%)' }),
    animate(
      '0.3s ease-out',
      style({ opacity: 0, transform: 'translateX(-55%)' })
    )
  ])
]);
