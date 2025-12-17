import {
  animate,
  AnimationTriggerMetadata,
  group,
  query,
  style,
  transition,
  trigger,
} from '@angular/animations';

export function getPageFadeSlideAnimation(
  direction: 'topToBottom' | 'bottomToTop',
) {
  const factor = direction === 'topToBottom' ? -1 : 1;
  console.log({ factor });

  return trigger('pageFadeSlide', [
    // ENTER: host bg fades in, content slides up from bottom
    transition(':enter', [
      // initial host state: fully transparent background + 0 opacity
      style({
        opacity: 0,
      }),

      // initial content state: lower and transparent
      query(
        'ion-content',
        [
          style({
            opacity: 0,
            transform: `translateY(${30 * factor}px)`,
          }),
        ],
        { optional: true },
      ),
      query(
        'ion-header',
        [
          style({
            opacity: 0,
          }),
        ],
        { optional: true },
      ),

      // run host + content animations in parallel
      group([
        // host background + overall opacity
        animate(
          '300ms ease-out',
          style({
            opacity: 1,
          }),
        ),

        // content moves up + fades in
        query(
          'ion-content',
          [
            animate(
              '300ms ease-out',
              style({
                opacity: 1,
                transform: 'translateY(0)',
              }),
            ),
          ],
          { optional: true },
        ),
        query(
          'ion-header',
          [
            animate(
              '300ms ease-out',
              style({
                opacity: 1,
              }),
            ),
          ],
          { optional: true },
        ),
      ]),
    ]),

    // LEAVE: host bg fades out, content moves slightly up and fades out
    transition(':leave', [
      group([
        // host background + overall opacity
        animate(
          '300ms ease-in',
          style({
            opacity: 0,
          }),
        ),

        // content slides a bit up and fades out
        query(
          'ion-content',
          [
            animate(
              '300ms ease-in',
              style({
                opacity: 0,
                transform: `translateY(${-30 * factor}px)`,
              }),
            ),
          ],
          { optional: true },
        ),
        query(
          'ion-header',
          [
            animate(
              '300ms ease-in',
              style({
                opacity: 0,
              }),
            ),
          ],
          { optional: true },
        ),
      ]),
    ]),
  ]);
}

export const fadeInOutAnimation: AnimationTriggerMetadata = trigger(
  'fadeInOut',
  [
    transition(':enter', [
      style({ opacity: 0 }),
      animate('300ms ease-in', style({ opacity: 1 })),
    ]),
    transition(':leave', [
      style({ opacity: 1 }),
      animate('300ms ease-out', style({ opacity: 0 })),
    ]),
  ],
);
