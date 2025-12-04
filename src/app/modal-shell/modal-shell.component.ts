import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { IonModal, IonRouterOutlet } from '@ionic/angular/standalone';
import { NavigationService } from '../services/navigation.service';
import { OutletService } from '../services/outlet.service';
import { AnimationController, Animation } from '@ionic/angular';

@Component({
  selector: 'app-modal-shell',
  templateUrl: './modal-shell.component.html',
  styleUrl: './modal-shell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonModal, IonRouterOutlet],
})
export class ModalShellComponent implements AfterViewInit {
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly navigationService = inject(NavigationService);
  private readonly outletService = inject(OutletService);
  private readonly animationController = inject(AnimationController);

  protected readonly outletIndex = this.navigationService.outletIndex;

  protected readonly activeOutletIndex = this.outletService.activeOutletIndex;
  private prevActiveOutletIndex = this.activeOutletIndex();

  protected readonly isOpen = signal<boolean>(true);
  protected readonly ready = signal<boolean>(false);

  private readonly modal = viewChild('modal', { read: ElementRef });

  protected presentingEl?: HTMLElement;

  private sheetAnimation?: Animation;

  constructor() {
    this.outletService.activeOutletIndex.set(this.outletIndex);

    effect(() => {
      const activeOutletIndex = this.activeOutletIndex();

      if (activeOutletIndex === this.outletIndex + 1) {
        this.sheetAnimation?.direction('normal').play();
      } else if (
        activeOutletIndex === this.outletIndex &&
        this.prevActiveOutletIndex !== activeOutletIndex
      ) {
        this.sheetAnimation?.direction('reverse').play();
      }

      this.prevActiveOutletIndex = activeOutletIndex;
    });
  }

  public ngAfterViewInit(): void {
    // Without it the modal handle is not shown on page reload with the modal open by default
    this.ready.set(true);

    this.cdr.detectChanges();

    const modal = this.modal();
    if (!modal) return;

    this.sheetAnimation = this.animationController
      .create()
      .addElement(modal.nativeElement)
      .duration(300)
      .easing('ease-in-out')
      .fromTo(
        'transform',
        'scale(1) translateY(0)',
        'scale(0.96) translateY(-25px)',
      )
      .fill('both');

    // PresentingEl approach is buggy
    // if (this.outletIndex === 0) {
    //   this.presentingEl = undefined;
    // } else {
    //   // For outletIndex > 0, present over previous modal
    //   const modals = Array.from(document.querySelectorAll('ion-modal'));
    //   const previousModal = modals.find(
    //     (m) =>
    //       m !== this.modal()?.nativeElement &&
    //       !m.classList.contains('ion-overlay-hidden'),
    //   );
    //   this.presentingEl = previousModal ?? undefined;
    // }
    //
    // this.cdr.detectChanges();
  }

  public onWillDismiss(): void {
    // It still fires when the modal disappears already which causes the delay before the animation
    console.log('onWillDismiss');

    this.outletService.activeOutletIndex.set(
      this.outletIndex > 0 ? this.outletIndex - 1 : undefined,
    );
  }

  protected async onDismiss(): Promise<boolean> {
    this.isOpen.set(false);

    return this.navigationService.dismissOutlet();
  }
}
