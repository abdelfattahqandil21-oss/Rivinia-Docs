import { DOCUMENT } from '@angular/common';
import { Component, ElementRef, computed, inject, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { RiviniaI18n } from '@rivinia/i18n';

import { IconComponent } from '../../../../../shared/components/icon/icon.component';
import { PACKAGE_METADATA } from '../../../../packages/package-metadata';
import { GETTING_STARTED_PAGES } from '../../../getting-started/models/docs-getting-started.model';
import { docsLink } from '../../../shared/docs-link';
import { DOCS_PACKAGE_GROUPS } from '../../../shared/models/docs-group.model';
import { DocsPackageSearchService } from '../../../shared/services/docs-package-search.service';
import { DocsPageContextService } from '../../services/docs-page-context.service';
import { DocsSidebarService } from '../../services/docs-sidebar.service';

@Component({
  imports: [RouterLink, RouterLinkActive, IconComponent],
  selector: 'nav[app-docs-sidebar-nav]',
  templateUrl: './docs-sidebar-nav.component.html',
  styleUrl: './docs-sidebar-nav.component.css',
  host: { '[attr.aria-label]': 'navigationLabel()' },
})
export class DocsSidebarNavComponent {
  private readonly document = inject(DOCUMENT);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  readonly panelPrefix = input.required<string>();

  protected readonly i18n = inject<RiviniaI18n<'ar' | 'en'>>(RiviniaI18n);
  protected readonly search = inject(DocsPackageSearchService);
  protected readonly page = inject(DocsPageContextService);
  protected readonly sidebar = inject(DocsSidebarService);
  protected readonly groups = DOCS_PACKAGE_GROUPS;
  protected readonly gettingStartedPages = GETTING_STARTED_PAGES;
  protected readonly navigationLabel = this.i18n.t('docs.navigation');
  protected readonly backToPackagesLabel = this.i18n.t('docs.backToPackages');
  protected readonly packageMetadata = computed(() => {
    const packageId = this.sidebar.packageNavigationId();
    return packageId ? PACKAGE_METADATA[packageId as keyof typeof PACKAGE_METADATA] : null;
  });

  protected backToPackageList(): void {
    const packageId = this.sidebar.packageNavigationId();
    this.sidebar.backToPackageList();
    if (!packageId) return;

    requestAnimationFrame(() => {
      const packageLink = [
        ...this.host.querySelectorAll<HTMLAnchorElement>('[data-package-id]'),
      ].find((link) => link.dataset['packageId'] === packageId);
      packageLink?.focus();
    });
  }

  protected followSection(event: MouseEvent, sectionId: string): void {
    const dialog = (event.currentTarget as HTMLElement).closest<HTMLDialogElement>('dialog');
    if (!dialog?.open) return;

    dialog.close();
    requestAnimationFrame(() => {
      const heading = this.document.getElementById(sectionId);
      if (!heading) return;
      heading.tabIndex = -1;
      heading.focus({ preventScroll: true });
    });
  }

  protected packageLink(id: string): string {
    return docsLink(id);
  }

  protected sectionLink(sectionId: string): string {
    const packageId = this.sidebar.packageNavigationId();
    return packageId ? `${docsLink(packageId)}#${sectionId}` : `#${sectionId}`;
  }

  protected gettingStartedLink(slug: string): string {
    return docsLink('getting-started', slug);
  }
}
