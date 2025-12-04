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
})
export class AiSearchPage {
  private readonly router = inject(Router);
  private readonly outletService = inject(OutletService);

  protected readonly showCloseButton = computed(() => {
    return this.outletService.activeOutletIndex() === undefined;
  });

  protected onClose(): void {
    this.outletService.activeOutletIndex.set(0);
    this.router.navigate([
      {
        outlets: {
          [`flow0`]: ['trading', 'tabs'],
        },
      },
    ]);
  }
}
