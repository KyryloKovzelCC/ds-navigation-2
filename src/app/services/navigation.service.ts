import { inject, Injectable, OnDestroy } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { InjectionToken } from '@angular/core';
import { NavController } from '@ionic/angular/standalone';

export const FLOW_OUTLET_INDEX = new InjectionToken<number>(
  'FLOW_OUTLET_INDEX',
);

@Injectable()
export class NavigationService implements OnDestroy {
  private readonly router = inject(Router);
  private readonly navController = inject(NavController);
  public readonly outletIndex: number = inject(FLOW_OUTLET_INDEX);
  private readonly outletIndexes = [0, 1, 2, 3];

  constructor() {
    console.log('Created NavigationService, outlet index:', this.outletIndex);
  }

  public ngOnDestroy(): void {
    console.log('Destroyed NavigationService, outlet index:', this.outletIndex);
  }

  public navigateBack(segments?: string[]): Promise<any> {
    if (!segments?.length) return Promise.resolve();

    const route = this.buildCommands(segments);
    return this.navController.navigateBack(route);
  }

  public navigateForward(segments: string[]): Promise<any> {
    const route = this.buildCommands(segments);
    return this.navController.navigateForward(route);
  }

  public navigateWithinNewOutlet(segments: string[]): Promise<any> {
    if (this.outletIndex > 2) return Promise.resolve();

    const newOutletIndex = this.outletIndex + 1;

    console.log('Opening new outlet', newOutletIndex);

    const route = this.buildCommands(segments, newOutletIndex);
    console.log('Navigating to', route);
    return this.router.navigate(route);
  }

  public dismissOutlet(): Promise<any> {
    console.log('Dismissing outlet', this.outletIndex);

    const tree = this.router.createUrlTree([
      { outlets: { [`flow${this.outletIndex}`]: null } },
    ]);

    return this.router.navigateByUrl(tree);
  }

  private buildCommands(
    segments: string[],
    outletIndex = this.outletIndex,
  ): any[] {
    return [
      {
        outlets: {
          [`flow${outletIndex}`]: [...segments],
          ...this.dismissHigherOutlets(outletIndex),
        },
      },
    ];
  }

  private dismissHigherOutlets(
    outletIndex = this.outletIndex,
  ): Record<string, string | null> {
    return this.outletIndexes
      .filter((i) => i > outletIndex)
      .reduce((acc, i) => ({ ...acc, [`flow${i}`]: null }), {});
  }
}
