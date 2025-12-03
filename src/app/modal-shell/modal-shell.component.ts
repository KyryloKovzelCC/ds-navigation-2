import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnDestroy,
  signal,
} from '@angular/core';
import { IonModal, IonRouterOutlet } from '@ionic/angular/standalone';
import { NavigationService } from '../services/navigation.service';

@Component({
  selector: 'app-modal-shell',
  templateUrl: './modal-shell.component.html',
  styleUrl: './modal-shell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonModal, IonRouterOutlet],
})
export class ModalShellComponent implements AfterViewInit, OnDestroy {
  private readonly navigationService = inject(NavigationService);

  protected readonly outletIndex = this.navigationService.outletIndex;
  protected readonly isOpen = signal<boolean>(true);
  protected readonly ready = signal<boolean>(false);

  protected readonly presentingEl = computed(() => {
    // const el = this.navigationService.outletIndex
    //   ? (document.getElementById(`ion-overlay-${this.outletIndex}`) ??
    //     undefined)
    //   : undefined;
    //
    // console.log(`ion-overlay-${this.outletIndex}`, el);
    //
    // return el;

    return undefined;
  });

  constructor() {
    console.log('ModalShellComponent constructor');
  }

  public ngAfterViewInit(): void {
    // Without it the modal handle is not shown on page reload with the modal open by default
    this.ready.set(true);
  }

  public ngOnDestroy(): void {
    console.log('ModalShellComponent ngOnDestroy for outlet', this.outletIndex);
  }

  protected onDismiss(): Promise<boolean> {
    console.log('onDismiss');
    this.isOpen.set(false);

    return this.navigationService.dismissOutlet();
  }
}
