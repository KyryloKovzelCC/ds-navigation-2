import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  inject,
} from '@angular/core';
import { IonRouterOutlet } from '@ionic/angular/standalone';
import { NavigationService } from '../services/navigation.service';
import { OutletService } from '../services/outlet.service';
import { AnimationController } from '@ionic/angular';

@Component({
  selector: 'app-empty',
  templateUrl: 'empty.page.html',
  styleUrls: ['empty.page.scss'],
})
export class EmptyPage implements AfterViewInit {
  private readonly navigationService = inject(NavigationService);
  private readonly outletService = inject(OutletService);

  protected readonly activeOutletIndex = this.outletService.activeOutletIndex;

  public ngAfterViewInit(): void {
    setTimeout(() => {
      if (
        this.activeOutletIndex() === -1 ||
        this.activeOutletIndex() === undefined
      ) {
        this.navigationService.navigateWithinNewOutlet([
          'trading',
          'tabs',
          'home',
        ]);
      }
    });
  }
}
