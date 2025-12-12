import { inject, Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { InjectionToken } from '@angular/core';
import { NavController } from '@ionic/angular/standalone';
import { OutletService } from './outlet.service';

export const FLOW_OUTLET_INDEX = new InjectionToken<number>(
  'FLOW_OUTLET_INDEX',
);

@Injectable()
export class NavigationService {
  private readonly router = inject(Router);
  private readonly navController = inject(NavController);
  private readonly outletService = inject(OutletService);
  public readonly outletIndex: number = inject(FLOW_OUTLET_INDEX);
  private readonly outletIndexes = [0, 1, 2, 3];

  public navigateBack(segments?: string[]): Promise<any> {
    if (!segments?.length) return Promise.resolve();

    const route = this.buildCommands(segments);

    console.log('navigateBack', route);

    return this.navController.navigateBack(route);
  }

  public navigateForward(segments: string[]): Promise<any> {
    const route = this.buildCommands(segments);

    console.log('navigateForward', route);

    return this.navController.navigateForward(route);
  }

  public navigateWithinNewOutlet(segments: string[]): Promise<any> {
    if (this.outletIndex > 2) return Promise.resolve();

    const newOutletIndex = this.outletIndex + 1;
    const route = this.buildCommands(segments, newOutletIndex);

    console.log('navigateWithinNewOutlet', route);

    this.outletService.activeOutletIndex.set(newOutletIndex);
    return this.router.navigate(route);
  }

  public dismissOutlet(primaryOutletSegmens?: string[]): Promise<any> {
    this.outletService.activeOutletIndex.set(
      this.outletIndex > 0 ? this.outletIndex - 1 : undefined,
    );

    const tree = this.router.createUrlTree([
      {
        outlets: {
          ...(primaryOutletSegmens && { primary: primaryOutletSegmens }),
          [`flow${this.outletIndex}`]: null,
        },
      },
    ]);

    console.log('dismissOutlet', this.outletIndex);

    return this.navController.navigateRoot(tree);
  }

  public navigateToNewContext(segments: string[]): Promise<any> {
    if (this.outletIndex > 2) return Promise.resolve();

    const newOutletIndex = this.outletIndex + 1;
    const route = [
      {
        path: '',
        outlets: {
          primary: ['ai-search'],
          [`flow${newOutletIndex}`]: [...segments],
          ...this.dismissHigherOutlets(newOutletIndex),
        },
      },
    ];

    console.log('navigateToNewContext', route);

    this.outletService.activeOutletIndex.set(newOutletIndex);
    return this.navController.navigateRoot(route);
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
