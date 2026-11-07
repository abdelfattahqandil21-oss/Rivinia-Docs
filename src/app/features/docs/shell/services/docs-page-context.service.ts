import { DestroyRef, Service, inject, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { RiviniaI18n } from '@rivinia/i18n';
import { filter } from 'rxjs';

import { PACKAGE_MANIFEST } from '../../../packages/package-manifest';
import { PACKAGE_METADATA } from '../../../packages/package-metadata';
import type { DocsNavGroup } from '../../shared/models/docs-group.model';

export interface DocsPageHeading {
  readonly id: string;
  readonly text: string;
}

@Service({ autoProvided: false })
export class DocsPageContextService {
  private readonly router = inject(Router);
  private readonly title = inject(Title);
  private readonly i18n = inject<RiviniaI18n<'ar' | 'en'>>(RiviniaI18n);
  private readonly destroyRef = inject(DestroyRef);

  readonly announcement = signal('');
  readonly headings = signal<readonly DocsPageHeading[]>([]);
  readonly activeHeading = signal('');
  readonly activeNavGroup = signal<DocsNavGroup | null>(null);

  private headingObserver?: IntersectionObserver;
  private lastPagePath = '';

  constructor() {
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
      this.headingObserver?.disconnect();
    });
    this.lastPagePath = this.currentPath();
    this.syncActiveNavGroup(this.currentRouteInfo().packageId);
  }

  private updatePageContext(): void {
    this.lastPagePath = this.currentPath();
    const { titleKey, packageId } = this.currentRouteInfo();
    this.syncActiveNavGroup(packageId);
    const packageMetadata = packageId
      ? PACKAGE_METADATA[packageId as keyof typeof PACKAGE_METADATA]
      : null;
    const pageName =
      packageId && !packageMetadata
        ? this.i18n.translate('docs.notFound.title')
        : titleKey
          ? this.i18n.translate(titleKey)
          : this.i18n.translate('page.docs.title');
    const packageName = packageMetadata?.name ?? null;
    const documentTitle = packageName
      ? `${pageName} · ${packageName} · Rivinia Docs`
      : `${pageName} · Rivinia Docs`;
    this.title.setTitle(documentTitle);
    this.announcement.set(documentTitle);
    setTimeout(() => {
      const heading = document.querySelector<HTMLElement>('#main-content h1');
      if (heading) {
        heading.tabIndex = -1;
        heading.focus();
      }
      this.observeHeadings();
      document
        .querySelector<HTMLElement>('.docs-sidebar a[aria-current="page"]')
        ?.scrollIntoView({ block: 'nearest' });
    });
  }

  private observeHeadings(): void {
    this.headingObserver?.disconnect();
    const headings = [
      ...document.querySelectorAll<HTMLElement>(
        '.docs-page-content h2[id], .docs-page-content h3[id]',
      ),
    ];
    this.headings.set(
      headings.map((heading) => ({ id: heading.id, text: heading.textContent?.trim() ?? '' })),
    );
    this.activeHeading.set('');
    if (headings.length === 0 || typeof IntersectionObserver === 'undefined') return;

    const visible = new Set<HTMLElement>();
    this.headingObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const heading = entry.target as HTMLElement;
          if (entry.isIntersecting) visible.add(heading);
          else visible.delete(heading);
        }
        const current = [...visible].sort(
          (first, second) => first.getBoundingClientRect().top - second.getBoundingClientRect().top,
        )[0];
        this.activeHeading.set(current?.id ?? '');
      },
      { rootMargin: '-15% 0px -70% 0px' },
    );
    headings.forEach((heading) => this.headingObserver?.observe(heading));
  }

  private syncActiveNavGroup(packageId: string | null): void {
    const packageEntry = PACKAGE_MANIFEST.find((entry) => entry.id === packageId);
    if (packageEntry) this.activeNavGroup.set(packageEntry.docs.group);
    else if (this.lastPagePath.startsWith('/docs/getting-started/')) {
      this.activeNavGroup.set('getting-started');
    }
  }

  private currentPath(): string {
    return this.router.url.split(/[?#]/, 1)[0];
  }

  private currentRouteInfo(): { titleKey: string | undefined; packageId: string | null } {
    let active = this.router.routerState.snapshot.root;
    while (active.firstChild) active = active.firstChild;
    return {
      titleKey: active.data['docsTitleKey'] as string | undefined,
      packageId: active.paramMap.get('package'),
    };
  }
}
