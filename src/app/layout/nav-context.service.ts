import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class NavContextService {
  readonly docsRoute = signal(false);
}
