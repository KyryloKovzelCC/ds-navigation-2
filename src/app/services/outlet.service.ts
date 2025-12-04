import { Injectable, signal } from '@angular/core';
import { InjectionToken } from '@angular/core';

export const FLOW_OUTLET_INDEX = new InjectionToken<number>(
  'FLOW_OUTLET_INDEX',
);

@Injectable({ providedIn: 'root' })
export class OutletService {
  public readonly activeOutletIndex = signal<number | undefined>(undefined);
}
