import { Component, computed, inject } from '@angular/core';
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
import { Router } from '@angular/router';

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
export class AiSearchPage {
  private readonly router = inject(Router);
  private readonly outletService = inject(OutletService);

  protected readonly activeOutletIndex = this.outletService.activeOutletIndex;

  protected readonly showCloseButton = computed(() => {
    return this.activeOutletIndex() === undefined;
  });

  protected onClose(): void {
    this.activeOutletIndex.set(0);
    this.router.navigate([
      {
        outlets: {
          [`flow0`]: ['trading', 'tabs'],
        },
      },
    ]);
  }
}
