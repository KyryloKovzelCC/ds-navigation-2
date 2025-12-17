import { AfterViewInit, Component, inject } from '@angular/core';
import { NavigationService } from '../services/navigation.service';
import { OutletService } from '../services/outlet.service';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-empty',
  templateUrl: 'empty.page.html',
  styleUrls: ['empty.page.scss'],
  imports: [IconComponent],
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

  protected onSearchClick(): Promise<boolean> {
    return this.navigationService.dismissOutlet(['ai-search']);
  }
}
