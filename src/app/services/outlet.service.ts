import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class OutletService {
  public readonly activeOutletIndex = signal<number | undefined>(undefined);
}
