import { AfterViewInit, Component, computed, inject } from '@angular/core';
import { Location } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonIcon,
  IonButtons,
  IonButton,
} from '@ionic/angular/standalone';
import { NavigationService } from '../services/navigation.service';
import { OutletService } from '../services/outlet.service';

@Component({
  selector: 'app-ai-search',
  templateUrl: 'ai-search.page.html',
  styleUrls: ['ai-search.page.scss'],
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonIcon,
    IonButtons,
    IonButton,
  ],
  host: { '[class.is-blurred]': 'activeOutletIndex() > 0' },
})
export class AiSearchPage implements AfterViewInit {
  private readonly navigationService = inject(NavigationService);
  private readonly outletService = inject(OutletService);

  protected readonly activeOutletIndex = this.outletService.activeOutletIndex;

  protected readonly showCloseButton = computed(() => {
    return this.activeOutletIndex() === undefined;
  });

  constructor() {
    this.outletService.activeOutletIndex.set(
      this.navigationService.outletIndex,
    );
  }

  public ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.activeOutletIndex() === -1) {
        this.navigationService.navigateWithinNewOutlet([
          'trading',
          'tabs',
          'home',
        ]);
      }
    });
  }

  protected onClose(): void {
    this.navigationService.navigateWithinNewOutlet(['trading', 'tabs', 'home']);
  }
}
