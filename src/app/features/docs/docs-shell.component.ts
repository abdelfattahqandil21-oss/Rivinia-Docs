import { Component, DestroyRef, inject, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { RiviniaI18n } from '@rivinia/i18n';
import { filter } from 'rxjs';

import { NavContextService } from '../../layout/nav-context.service';

@Component({
  imports: [RouterOutlet],
  selector: 'app-docs-shell',
  template: `
    <div class="docs-shell">
      <router-outlet />
      <p class="sr-only" aria-live="polite" aria-atomic="true">{{ announcement() }}</p>
    </div>
  `,
  styles: `
    .docs-shell {
      min-width: 0;
      scroll-padding-block-start: calc(var(--navbar-height) + 1rem);
    }
  `,
})
export class DocsShellComponent {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly title = inject(Title);
  private readonly navContext = inject(NavContextService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly i18n = inject<RiviniaI18n<'ar' | 'en'>>(RiviniaI18n);

  protected readonly announcement = signal('');
  private lastPagePath = '';

  constructor() {
    this.navContext.docsRoute.set(true);
    this.updatePageContext();
    const subscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        const pagePath = event.urlAfterRedirects.split(/[?#]/, 1)[0];
        if (pagePath === this.lastPagePath) return;
        this.lastPagePath = pagePath;
        this.updatePageContext();
      });
    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
      this.navContext.docsRoute.set(false);
    });
  }

  private updatePageContext(): void {
    this.lastPagePath = this.router.url.split(/[?#]/, 1)[0];
    let active = this.route;
    while (active.firstChild) active = active.firstChild;
    const titleKey = active.snapshot.data['docsTitleKey'] as string | undefined;
    const pageName = titleKey
      ? this.i18n.translate(titleKey)
      : this.i18n.translate('page.docs.title');
    const documentTitle = `${pageName} · Rivinia Docs`;
    this.title.setTitle(documentTitle);
    this.announcement.set(documentTitle);
    setTimeout(() => {
      const heading = document.querySelector<HTMLElement>('#main-content h1');
      if (!heading) return;
      heading.tabIndex = -1;
      heading.focus();
    });
  }
}
