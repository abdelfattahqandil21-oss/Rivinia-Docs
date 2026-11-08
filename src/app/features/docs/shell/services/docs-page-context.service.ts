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
  readonly activePackageId = signal<string | null>(null);
  readonly activeNavGroup = signal<DocsNavGroup | null>(null);
  readonly currentPath = signal('');

  private headingObserver?: IntersectionObserver;
  private headingLabelObserver?: MutationObserver;
  private pageContentObserver?: MutationObserver;
  private pageContentRefreshTimer?: ReturnType<typeof setTimeout>;
  private hashRestoreObserver?: MutationObserver;
  private hashRestoreTimer?: ReturnType<typeof setTimeout>;
  private pendingHashTimer?: ReturnType<typeof setTimeout>;
  private pendingHashTarget = '';
  private activeUpdateFrame?: number;
  private trackedHeadings: readonly HTMLElement[] = [];
  private lastPagePath = '';

  constructor() {
    window.addEventListener('hashchange', this.handleHashChange);
    window.addEventListener('scroll', this.handleViewportChange, { passive: true });
    window.addEventListener('resize', this.handleViewportChange, { passive: true });
    setTimeout(() => {
      this.observeHeadings();
      this.watchPageContent();
      this.scheduleHashRestore();
    });
    const subscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        const pagePath = event.urlAfterRedirects.split(/[?#]/, 1)[0];
        if (pagePath === this.lastPagePath) {
          this.scheduleHashRestore();
          return;
        }
        this.clearPendingHashTarget();
        this.lastPagePath = pagePath;
        this.updatePageContext();
      });
    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
      this.headingObserver?.disconnect();
      this.headingLabelObserver?.disconnect();
      this.pageContentObserver?.disconnect();
      if (this.pageContentRefreshTimer) clearTimeout(this.pageContentRefreshTimer);
      this.hashRestoreObserver?.disconnect();
      window.removeEventListener('hashchange', this.handleHashChange);
      window.removeEventListener('scroll', this.handleViewportChange);
      window.removeEventListener('resize', this.handleViewportChange);
      if (this.hashRestoreTimer) clearTimeout(this.hashRestoreTimer);
      if (this.pendingHashTimer) clearTimeout(this.pendingHashTimer);
      if (this.activeUpdateFrame !== undefined) window.cancelAnimationFrame(this.activeUpdateFrame);
    });
    this.lastPagePath = this.routePath();
    this.updatePageContext();
  }

  private updatePageContext(): void {
    this.lastPagePath = this.routePath();
    this.currentPath.set(this.lastPagePath);
    const { titleKey, packageId, section: routeSection } = this.currentRouteInfo();
    this.activePackageId.set(packageId);
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
    const sectionTitle =
      packageId === 'http' && routeSection
        ? this.i18n.translate(`docs.http.title.${routeSection}`)
        : null;
    let active = this.router.routerState.snapshot.root;
    while (active.firstChild) active = active.firstChild;
    const resolvedPageName =
      (active.data['docsSourceTitle'] as string | undefined) || sectionTitle || pageName;
    const documentTitle = packageName
      ? `${resolvedPageName} · ${packageName} · Rivinia Docs`
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
      this.watchPageContent();
      this.scheduleHashRestore();
      document
        .querySelector<HTMLElement>('.docs-sidebar a[aria-current="page"]')
        ?.scrollIntoView({ block: 'nearest' });
    });
  }

  private watchPageContent(): void {
    const content = document.querySelector('.docs-content-column');
    if (!content || this.pageContentObserver) return;
    this.pageContentObserver = new MutationObserver(() => {
      if (this.pageContentRefreshTimer) clearTimeout(this.pageContentRefreshTimer);
      this.pageContentRefreshTimer = setTimeout(() => this.observeHeadings());
    });
    this.pageContentObserver.observe(content, {
      childList: true,
      characterData: true,
      subtree: true,
    });
  }

  private observeHeadings(): void {
    this.headingObserver?.disconnect();
    this.headingLabelObserver?.disconnect();
    const headings = [
      ...document.querySelectorAll<HTMLElement>(
        '.docs-page-content h2[id], .docs-page-content h3[id]',
      ),
    ];
    this.trackedHeadings = headings;
    this.headings.set(
      headings.map((heading) => ({ id: heading.id, text: heading.textContent?.trim() ?? '' })),
    );
    this.scheduleHashRestore();
    this.headingLabelObserver = new MutationObserver(() => {
      const nextHeadings = headings.map((heading) => ({
        id: heading.id,
        text: heading.textContent?.trim() ?? '',
      }));
      const currentHeadings = this.headings();
      if (
        nextHeadings.some(
          (heading, index) =>
            heading.id !== currentHeadings[index]?.id ||
            heading.text !== currentHeadings[index]?.text,
        )
      ) {
        this.headings.set(nextHeadings);
        this.scheduleHashRestore();
        this.handleViewportChange();
      }
    });
    headings.forEach((heading) =>
      this.headingLabelObserver?.observe(heading, {
        childList: true,
        characterData: true,
        subtree: true,
      }),
    );
    this.activeHeading.set('');
    if (headings.length === 0) return;
    this.updateActiveHeading();
    if (typeof IntersectionObserver === 'undefined') return;

    this.headingObserver = new IntersectionObserver(() => this.handleViewportChange(), {
      threshold: [0, 0.25, 0.5, 0.75, 1],
    });
    headings.forEach((heading) => this.headingObserver?.observe(heading));
  }

  private readonly handleViewportChange = (): void => {
    if (this.activeUpdateFrame !== undefined || this.trackedHeadings.length === 0) return;
    this.activeUpdateFrame = window.requestAnimationFrame(() => {
      this.activeUpdateFrame = undefined;
      this.updateActiveHeading();
    });
  };

  private updateActiveHeading(): void {
    const article = document.querySelector<HTMLElement>('.docs-page-content');
    const viewportTop =
      Number.parseFloat(getComputedStyle(document.documentElement).scrollPaddingBlockStart) || 0;
    const viewportBottom = window.innerHeight;
    let active: HTMLElement | undefined;
    let maxVisibleHeight = -1;

    this.trackedHeadings.forEach((heading, index) => {
      const blockTop = heading.getBoundingClientRect().top;
      const blockBottom =
        this.trackedHeadings[index + 1]?.getBoundingClientRect().top ??
        article?.getBoundingClientRect().bottom ??
        viewportBottom;
      const visibleHeight = Math.max(
        0,
        Math.min(blockBottom, viewportBottom) - Math.max(blockTop, viewportTop),
      );
      if (visibleHeight > maxVisibleHeight) {
        active = heading;
        maxVisibleHeight = visibleHeight;
      }
    });

    if (!active) return;
    this.activeHeading.set(active.id);
    if (active.id === this.pendingHashTarget) this.clearPendingHashTarget();
    else if (!this.pendingHashTarget) this.syncLocationHash(active.id);
  }

  private scheduleHashRestore(): void {
    const fragment = this.router.parseUrl(this.router.url).fragment;
    if (!fragment) return;
    this.pendingHashTarget = decodeURIComponent(fragment);
    if (this.pendingHashTimer) clearTimeout(this.pendingHashTimer);
    this.pendingHashTimer = setTimeout(() => this.clearPendingHashTarget(), 1600);
    this.hashRestoreObserver ??= new MutationObserver(() => this.queueHashRestore());
    this.hashRestoreObserver.observe(document.body, {
      childList: true,
      characterData: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['dir', 'lang'],
    });
    this.queueHashRestore();
  }

  private readonly handleHashChange = (): void => {
    if (!window.location.hash) {
      this.clearPendingHashTarget();
      return;
    }
    this.scheduleHashRestore();
  };

  private clearPendingHashTarget(): void {
    this.pendingHashTarget = '';
    if (this.pendingHashTimer) clearTimeout(this.pendingHashTimer);
    this.pendingHashTimer = undefined;
    if (this.hashRestoreTimer) clearTimeout(this.hashRestoreTimer);
    this.hashRestoreTimer = undefined;
    this.hashRestoreObserver?.disconnect();
  }

  private queueHashRestore(): void {
    if (this.hashRestoreTimer) clearTimeout(this.hashRestoreTimer);
    this.hashRestoreTimer = setTimeout(() => {
      if (!this.pendingHashTarget) return;
      document.getElementById(this.pendingHashTarget)?.scrollIntoView?.({ block: 'start' });
      this.hashRestoreObserver?.disconnect();
    }, 120);
  }

  private syncLocationHash(headingId: string): void {
    const nextHash = `#${encodeURIComponent(headingId)}`;
    if (window.location.hash === nextHash) return;
    window.history.replaceState(
      window.history.state,
      '',
      `${window.location.pathname}${window.location.search}${nextHash}`,
    );
  }

  private syncActiveNavGroup(packageId: string | null): void {
    const packageEntry = PACKAGE_MANIFEST.find((entry) => entry.id === packageId);
    if (packageEntry) this.activeNavGroup.set(packageEntry.docs.group);
    else if (this.lastPagePath.startsWith('/docs/getting-started/')) {
      this.activeNavGroup.set('getting-started');
    }
  }

  private routePath(): string {
    return this.router.url.split(/[?#]/, 1)[0];
  }

  private currentRouteInfo(): {
    titleKey: string | undefined;
    packageId: string | null;
    section: string | null;
  } {
    let active = this.router.routerState.snapshot.root;
    while (active.firstChild) active = active.firstChild;
    return {
      titleKey: active.data['docsTitleKey'] as string | undefined,
      packageId:
        active.paramMap.get('package') ??
        (active.data['docsPackageId'] as string | undefined) ??
        null,
      section:
        active.paramMap.get('section') ?? (active.data['section'] as string | undefined) ?? null,
    };
  }
}
