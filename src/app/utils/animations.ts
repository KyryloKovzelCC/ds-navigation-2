import { Animation, createAnimation } from '@ionic/angular';

export const horizontalTransition = (
  baseEl: HTMLElement,
  opts?: any,
): Animation => {
  console.log('run');

  const enteringEl = opts.enteringEl as HTMLElement;
  const leavingEl = opts.leavingEl as HTMLElement | undefined;
  let direction = opts.direction === 'back' ? 'back' : 'forward';

  const inTabs = !!enteringEl.closest('ion-tabs');

  if (inTabs && leavingEl) {
    const enteringIndex = Number(
      enteringEl.getAttribute('data-tab-index') ?? 0,
    );
    const leavingIndex = Number(leavingEl.getAttribute('data-tab-index') ?? 0);

    direction = enteringIndex > leavingIndex ? 'forward' : 'back';
  }

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
