import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class QuickActionsService {
  public readonly isOpen = signal(false);
}
