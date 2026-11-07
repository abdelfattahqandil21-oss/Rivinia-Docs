import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { Title } from '@angular/platform-browser';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { RiviniaI18n } from '@rivinia/i18n';
import { filter } from 'rxjs';

import { PACKAGE_MANIFEST } from '../packages/package-manifest';
import { NavContextService } from '../../layout/nav-context.service';
import { docsLink } from './docs-link';

const DOCS_GROUPS = ['foundations', 'components', 'primitives'] as const;

@Component({
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  selector: 'app-docs-shell',
  templateUrl: './docs-shell.component.html',
  styleUrl: './docs-shell.component.css',
})
export class DocsShellComponent {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly title = inject(Title);
  private readonly navContext = inject(NavContextService);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly i18n = inject<RiviniaI18n<'ar' | 'en'>>(RiviniaI18n);

  protected readonly groups = DOCS_GROUPS;
  protected readonly packages = PACKAGE_MANIFEST;
  protected readonly filterText = signal('');
  protected readonly announcement = signal('');
  protected readonly activeHeading = signal('');
  protected readonly pageHeadings = signal<readonly { id: string; text: string }[]>([]);
  protected readonly visiblePackages = computed(() => {
    const query = this.filterText().trim().toLocaleLowerCase();
    return this.packages.filter(
      (entry) =>
        !query ||
        entry.id.toLocaleLowerCase().includes(query) ||
        entry.name.toLocaleLowerCase().includes(query),
    );
  });
  protected readonly resultsAnnouncement = computed(() =>
    this.i18n.translate('docs.filter.count', { count: this.visiblePackages().length }),
  );
  protected readonly homeLink = docsLink();
  private headingObserver?: IntersectionObserver;
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
      this.headingObserver?.disconnect();
      this.navContext.docsRoute.set(false);
    });
  }

  protected packagesForGroup(group: (typeof DOCS_GROUPS)[number]) {
    return this.visiblePackages().filter((entry) => entry.docs.group === group);
  }

  protected packageLink(id: string): string {
    return docsLink(id);
  }

  protected clearFilter(): void {
    this.filterText.set('');
  }

  protected onFilterInput(event: Event): void {
    this.filterText.set((event.target as HTMLInputElement).value);
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
}
