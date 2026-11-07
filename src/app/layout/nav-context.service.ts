import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class NavContextService {
  readonly docsRoute = signal(false);
  readonly docsMenuOpen = signal(false);
  readonly docsMenuRequest = signal(0);
  private readonly docsMenuTrigger = signal<HTMLElement | null>(null);

  requestDocsMenu(trigger: HTMLElement): void {
    this.docsMenuTrigger.set(trigger);
    this.docsMenuRequest.update((request) => request + 1);
  }

  focusDocsMenuTrigger(): void {
    this.docsMenuTrigger()?.focus();
    this.docsMenuTrigger.set(null);
  }
}
