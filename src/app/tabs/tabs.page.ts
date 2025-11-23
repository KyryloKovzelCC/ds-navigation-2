import { Component, inject } from '@angular/core';
import {
  IonIcon,
  IonTabBar,
  IonTabButton,
  IonTabs,
} from '@ionic/angular/standalone';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NavigationService } from '../services/navigation.service';

@Component({
  selector: 'app-ai-search',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  imports: [IonTabBar, IonIcon, IonTabButton, IonTabs, RouterModule],
})
export class TabsPage {
  private readonly navigationService = inject(NavigationService);
  private readonly router = inject(Router);

  protected getLink(seg: string) {
    const tree = this.router.createUrlTree(
      [
        {
          outlets: {
            // primary: ['ai-search'],
            [`flow${this.navigationService.outletIndex}`]: [
              'trading',
              'tabs',
              seg,
            ],
          },
        },
      ],
      // { relativeTo: this.router.routerState.root },
    );
    console.log(tree);
    return tree;
  }

  onClick(arg: any): void {
    console.log('on click', arg);
  }
}
