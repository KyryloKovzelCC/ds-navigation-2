import { Animation, createAnimation } from '@ionic/angular';

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
