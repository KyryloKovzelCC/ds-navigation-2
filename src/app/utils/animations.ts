import {
  Animation,
  createAnimation,
  iosTransitionAnimation,
  mdTransitionAnimation,
  TransitionOptions,
} from '@ionic/angular';

export const horizontalTransition = (
  baseEl: HTMLElement,
  opts?: any,
): Animation => {
  const enteringEl = opts.enteringEl as HTMLElement;
  const leavingEl = opts.leavingEl as HTMLElement | undefined;
  const direction = opts.direction === 'back' ? 'back' : 'forward';

  const root = createAnimation().duration(400).easing('ease-in-out');

  // new page
  const enter = createAnimation()
    .addElement(enteringEl)
    .fromTo(
      'transform',
      direction === 'forward' ? 'translateX(100%)' : 'translateX(-100%)',
      'translateX(0)',
    )
    .fromTo('opacity', 0.5, 1);

  root.addAnimation(enter);

  // previous page
  if (leavingEl) {
    const leave = createAnimation()
      .addElement(leavingEl)
      .fromTo(
        'transform',
        'translateX(0)',
        direction === 'forward' ? 'translateX(-100%)' : 'translateX(100%)',
      )
      .fromTo('opacity', 1, 0.5);

    root.addAnimation(leave);
  }

  root.addAnimation(buildHeaderWrapperExtras(enteringEl, opts));

  return root;
};

export const slideUpAndDownTransition = (
  baseEl: HTMLElement,
  opts?: any,
): Animation => {
  const enteringEl = opts.enteringEl as HTMLElement;
  const leavingEl = opts.leavingEl as HTMLElement | undefined;

  const root = createAnimation().duration(400).easing('ease-out');

  // previous page (entering) - fade in from 0 to 1
  if (enteringEl) {
    const enter = createAnimation()
      .addElement(enteringEl)
      .fill('both')
      .beforeStyles({
        'will-change': 'transform, opacity',
      })
      .fromTo('opacity', 0, 1)
      .fromTo('transform', 'translateY(10%)', 'translateY(0)')
      .afterClearStyles(['transform', 'will-change']);

    root.addAnimation(enter);
  }

  // current page (leaving) - slide down and fade out from 1 to 0
  if (leavingEl) {
    const leave = createAnimation()
      .addElement(leavingEl)
      .fill('both')
      .beforeStyles({
        'will-change': 'transform, opacity',
      })
      .fromTo('opacity', 1, 0)
      .fromTo('transform', 'translateY(0)', 'translateY(100%)')
      .afterClearStyles(['transform', 'will-change']);

    root.addAnimation(leave);
  }

  return root;
};

function buildHeaderWrapperExtras(
  navEl: HTMLElement,
  opts: TransitionOptions,
): Animation {
  const isRTLFactor = navEl.ownerDocument.dir === 'rtl' ? -1 : 1;
  const OFF_START =
    opts.direction === 'forward'
      ? `${99.5 * isRTLFactor}%`
      : `${-33 * isRTLFactor}%`;
  const OFF_END =
    opts.direction === 'forward'
      ? `${-33 * isRTLFactor}%`
      : `${99.5 * isRTLFactor}%`;
  const OPACITY_START = 0.01;
  const OPACITY_END = 1;

  const extra = createAnimation();

  const wire = (
    el: HTMLElement | null | undefined,
    entering: boolean,
  ): void => {
    if (!el) {
      return;
    }

    el.querySelectorAll('ion-header').forEach((header) => {
      if (!header.querySelector('app-header-mobile')) {
        return;
      }

      const direction = opts.direction === 'back' ? 'back' : 'forward';

      // 1) Pin header against the page slide (net movement = 0)
      header
        .querySelectorAll<HTMLElement>('app-header-mobile')
        .forEach((node) => {
          extra.addAnimation(
            createAnimation()
              .addElement(node)
              .fill('both')
              .fromTo(
                'transform',
                entering
                  ? direction === 'forward'
                    ? 'translateX(-100%)'
                    : 'translateX(100%)'
                  : direction === 'forward'
                    ? 'translateX(0)'
                    : 'translateX(0)',
                entering
                  ? direction === 'forward'
                    ? 'translateX(0)'
                    : 'translateX(0)'
                  : direction === 'forward'
                    ? 'translateX(100%)'
                    : 'translateX(-100%)',
              )
              .fromTo(
                'opacity',
                entering ? OPACITY_START : OPACITY_END,
                entering ? OPACITY_END : OPACITY_START,
              ),
          );
        });

      // 2) Title: slide + fade
      header
        .querySelectorAll<HTMLElement>('app-header-mobile ion-title')
        .forEach((node) => {
          extra.addAnimation(
            createAnimation()
              .addElement(node)
              .fill('both')
              .fromTo(
                'transform',
                entering ? `translateX(${OFF_START})` : 'translateX(0)',
                entering ? 'translateX(0)' : `translateX(${OFF_END})`,
              )
              .fromTo(
                'opacity',
                entering ? OPACITY_START : OPACITY_END,
                entering ? OPACITY_END : OPACITY_START,
              ),
          );
        });

      // 3) Buttons: fade only
      header
        .querySelectorAll<HTMLElement>('app-header-mobile ion-buttons')
        .forEach((node) => {
          extra.addAnimation(
            createAnimation()
              .addElement(node)
              .fill('both')
              .fromTo(
                'opacity',
                entering ? OPACITY_START : OPACITY_END,
                entering ? OPACITY_END : OPACITY_START,
              ),
          );
        });

      // 4) Sibling toolbars: fade only (e.g., tabs toolbar)
      header
        .querySelectorAll<HTMLElement>(':scope > ion-toolbar')
        .forEach((toolbar) => {
          extra.addAnimation(
            createAnimation()
              .addElement(toolbar)
              .fill('both')
              .fromTo(
                'opacity',
                entering ? OPACITY_START : OPACITY_END,
                entering ? OPACITY_END : OPACITY_START,
              ),
          );
        });
    });
  };

  wire(opts.enteringEl, true);
  wire(opts.leavingEl, false);
  return extra;
}
