import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { InjectionToken } from '@angular/core';

export const FLOW_OUTLET_INDEX = new InjectionToken<number>(
  'FLOW_OUTLET_INDEX',
);

@Injectable()
export class NavigationService {
  private readonly router = inject(Router);
  public readonly outletIndex: number = inject(FLOW_OUTLET_INDEX);

  constructor() {
    console.log('outlet index', this.outletIndex);
  }

  public navigateWithinOutlet(segments: string[]): Promise<any> {
    const route = [
      { outlets: { [`flow${this.outletIndex}`]: ['flow', ...segments] } },
    ];
    return this.router.navigate(route);
  }

  public navigateWithinNewOutlet(segments: string[]): Promise<any> {
    if (this.outletIndex > 2) return Promise.resolve();

    const newOutletIndex = this.outletIndex + 1;

    console.log('Opening new outlet', newOutletIndex);

    const route = [
      { outlets: { [`flow${newOutletIndex}`]: ['flow', ...segments] } },
    ];
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
}
