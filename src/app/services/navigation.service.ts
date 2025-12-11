import { inject, Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { InjectionToken } from '@angular/core';
import { NavController } from '@ionic/angular/standalone';

export const FLOW_OUTLET_INDEX = new InjectionToken<number>(
  'FLOW_OUTLET_INDEX',
);

@Injectable()
export class NavigationService {
  private readonly router = inject(Router);
  private readonly navController = inject(NavController);
  public readonly outletIndex: number = inject(FLOW_OUTLET_INDEX);
  private readonly outletIndexes = [0, 1, 2, 3];

  constructor() {
    console.log('Created outlet index', this.outletIndex);
  }

  public getBackUrlTree(segments: string[]): UrlTree {
    return this.router.createUrlTree([
      {
        outlets: {
          [`flow${this.outletIndex}`]: [...segments],
          ...this.dismissHigherOutlets(),
        },
      },
    ]);
  }

  public navigateForward(segments: string[]): Promise<any> {
    const route = [
      {
        outlets: {
          [`flow${this.outletIndex}`]: [...segments],
          ...this.dismissHigherOutlets(),
        },
      },
    ];
    return this.router.navigate(route);
  }

  public navigateWithinNewOutlet(segments: string[]): Promise<any> {
    if (this.outletIndex > 2) return Promise.resolve();

    const newOutletIndex = this.outletIndex + 1;

    console.log('Opening new outlet', newOutletIndex);

    const route = [{ outlets: { [`flow${newOutletIndex}`]: [...segments] } }];
    return this.router.navigate(route);
  }

  public dismissOutlet(): Promise<any> {
    console.log('Dismissing outlet', this.outletIndex);

    const tree = this.router.createUrlTree([
      { outlets: { [`flow${this.outletIndex}`]: null } },
    ]);

    console.log(tree);

    return this.router.navigateByUrl(tree);
  }

  private dismissHigherOutlets(): Record<string, string | null> {
    return this.outletIndexes
      .filter((i) => i > this.outletIndex)
      .reduce((acc, i) => ({ ...acc, [`flow${i}`]: null }), {});
  }
}
