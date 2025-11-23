import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  Input,
  input,
  OnDestroy,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import {
  IonContent,
  IonModal,
  IonRouterOutlet,
} from '@ionic/angular/standalone';
import { NavigationService } from '../services/navigation.service';

@Component({
  selector: 'app-modal-shell',
  templateUrl: './modal-shell.component.html',
  styleUrl: './modal-shell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonModal, IonRouterOutlet, IonContent],
})
// implements AfterViewInit, OnDestroy
export class ModalShellComponent implements AfterViewInit, OnDestroy {
  private readonly navigationService = inject(NavigationService);

  private readonly router = inject(Router);

  public readonly outletIndex = this.navigationService.outletIndex;
  public readonly isOpen = signal<boolean>(true);
  public readonly ready = signal<boolean>(false);

  protected readonly presentingEl = computed(() => {
    // const el = this.navigationService.outletIndex
    //   ? (document.getElementById(`ion-overlay-${this.outletIndex}`) ??
    //     undefined)
    //   : undefined;
    //
    // console.log(`ion-overlay-${this.outletIndex}`, el);
    //
    // return el;

    return null;
  });

  constructor() {
    console.log('ModalShellComponent constructor');
  }

  public ngAfterViewInit(): void {
    // Without it the handle is not shown on page reload with the modal open by default
    this.ready.set(true);
  }

  public ngOnDestroy(): void {
    console.log('ModalShellComponent ngOnDestroy for outlet', this.outletIndex);
  }

  public onDismiss(): Promise<boolean> {
    console.log('onDismiss');
    this.isOpen.set(false);

    return this.navigationService.dismissOutlet();
  }
}
