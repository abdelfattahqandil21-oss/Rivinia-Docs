import {
  Component,
  DestroyRef,
  ElementRef,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { RiviniaI18n } from '@rivinia/i18n';
import { filter } from 'rxjs';

import { PACKAGE_MANIFEST } from '../../packages/package-manifest';
import { PACKAGE_METADATA } from '../../packages/package-metadata';
import { NavContextService } from '../../../layout/nav-context.service';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { docsLink } from '../shared/docs-link';
import {
  DOCS_PACKAGE_GROUPS,
  type DocsNavGroup,
  type DocsPackageGroup,
} from '../shared/models/docs-group.model';
import { DocsPackageSearchService } from '../shared/services/docs-package-search.service';
import { GETTING_STARTED_PAGES } from '../getting-started/models/docs-getting-started.model';
import { DocsPackageFilterComponent } from '../package-filter/docs-package-filter.component';

@Component({
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    NgTemplateOutlet,
    IconComponent,
    DocsPackageFilterComponent,
  ],
  providers: [DocsPackageSearchService],
  selector: 'app-docs-shell',
  templateUrl: './docs-shell.component.html',
  styleUrl: './docs-shell.component.css',
})
export class DocsShellComponent {
  private readonly router = inject(Router);
  private readonly title = inject(Title);
  private readonly navContext = inject(NavContextService);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly i18n = inject<RiviniaI18n<'ar' | 'en'>>(RiviniaI18n);
  protected readonly search = inject(DocsPackageSearchService);

  protected readonly groups = DOCS_PACKAGE_GROUPS;
  protected readonly gettingStartedPages = GETTING_STARTED_PAGES;
  protected readonly sidebarCollapsed = signal(false);
  protected readonly openGroup = signal<DocsNavGroup | null>(null);
  protected readonly announcement = signal('');
  protected readonly activeHeading = signal('');
  protected readonly pageHeadings = signal<readonly { id: string; text: string }[]>([]);
  protected readonly closeMenuLabel = this.i18n.t('docs.closeMenu');
  protected readonly collapseSidebarLabel = this.i18n.t('docs.collapseSidebar');
  protected readonly expandSidebarLabel = this.i18n.t('docs.expandSidebar');
  private readonly sidebarDialog = viewChild<ElementRef<HTMLDialogElement>>('sidebarDialog');
  private headingObserver?: IntersectionObserver;
  private lastPagePath = '';

  constructor() {
    this.navContext.docsRoute.set(true);
    effect(() => {
      const request = this.navContext.docsMenuRequest();
      if (request === 0) return;
      queueMicrotask(() => {
        const dialog = this.sidebarDialog()?.nativeElement;
        if (dialog && !dialog.open) {
          dialog.showModal();
          this.navContext.docsMenuOpen.set(true);
        }
      });
    });
    const subscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        const pagePath = event.urlAfterRedirects.split(/[?#]/, 1)[0];
        if (pagePath === this.lastPagePath) return;
        this.lastPagePath = pagePath;
        this.closeSidebarDialog();
        this.updatePageContext();
      });
    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
      this.headingObserver?.disconnect();
      this.closeSidebarDialog();
      this.navContext.docsRoute.set(false);
    });
    this.updateOpenGroupForCurrentPage();
  }

  protected packagesForGroup(group: DocsPackageGroup) {
    return this.search.forGroup(group);
  }

  protected packageLink(id: string): string {
    return docsLink(id);
  }

  protected gettingStartedLink(slug: string): string {
    return docsLink('getting-started', slug);
  }

  protected toggleSidebar(): void {
    this.sidebarCollapsed.update((collapsed) => !collapsed);
  }

  protected toggleGroup(group: DocsNavGroup): void {
    this.openGroup.update((openGroup) => (openGroup === group ? null : group));
  }

  protected closeSidebarDialog(): void {
    const dialog = this.sidebarDialog()?.nativeElement;
    if (dialog?.open) dialog.close();
  }

  protected onDialogClose(): void {
    this.navContext.docsMenuOpen.set(false);
    this.navContext.focusDocsMenuTrigger();
  }

  protected onDialogPointerDown(event: MouseEvent): void {
    if (event.target === this.sidebarDialog()?.nativeElement) this.closeSidebarDialog();
  }

  private updatePageContext(): void {
    this.lastPagePath = this.router.url.split(/[?#]/, 1)[0];
    let active = this.router.routerState.snapshot.root;
    while (active.firstChild) active = active.firstChild;
    const titleKey = active.data['docsTitleKey'] as string | undefined;
    const packageId = active.paramMap.get('package');
    this.syncOpenGroup(packageId);
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
    this.pageHeadings.set(
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

  private updateOpenGroupForCurrentPage(): void {
    this.lastPagePath = this.router.url.split(/[?#]/, 1)[0];
    let active = this.router.routerState.snapshot.root;
    while (active.firstChild) active = active.firstChild;
    this.syncOpenGroup(active.paramMap.get('package'));
  }

  private syncOpenGroup(packageId: string | null): void {
    const packageEntry = PACKAGE_MANIFEST.find((entry) => entry.id === packageId);
    if (packageEntry) this.openGroup.set(packageEntry.docs.group);
    else if (this.lastPagePath.startsWith('/docs/getting-started/')) {
      this.openGroup.set('getting-started');
    }
  }
}
