import { Component, DestroyRef, ElementRef, effect, inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { RiviniaI18n } from '@rivinia/i18n';
import { filter } from 'rxjs';

import { NavContextService } from '../../../../layout/nav-context.service';
import { IconComponent } from '../../../../shared/components/icon/icon.component';
import { DocsPackageFilterComponent } from '../../package-filter/docs-package-filter.component';
import { DocsPackageSearchService } from '../../shared/services/docs-package-search.service';
import { DocsSidebarNavComponent } from './docs-sidebar-nav.component';

@Component({
  imports: [IconComponent, DocsPackageFilterComponent, DocsSidebarNavComponent],
  selector: 'dialog[app-docs-menu-dialog]',
  templateUrl: './docs-menu-dialog.component.html',
  styleUrl: './docs-menu-dialog.component.css',
  host: {
    '(close)': 'onDialogClose()',
    '(click)': 'onDialogPointerDown($event)',
  },
})
export class DocsMenuDialogComponent {
  private readonly dialog = inject(ElementRef).nativeElement as HTMLDialogElement;
  private readonly navContext = inject(NavContextService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly i18n = inject<RiviniaI18n<'ar' | 'en'>>(RiviniaI18n);
  protected readonly search = inject(DocsPackageSearchService);
  protected readonly closeMenuLabel = this.i18n.t('docs.closeMenu');
  private lastPagePath = this.router.url.split(/[?#]/, 1)[0];

  constructor() {
    effect(() => {
      const request = this.navContext.docsMenuRequest();
      if (request === 0) return;
      queueMicrotask(() => this.open());
    });
    const subscription = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        const pagePath = event.urlAfterRedirects.split(/[?#]/, 1)[0];
        if (pagePath === this.lastPagePath) return;
        this.lastPagePath = pagePath;
        this.close();
      });
    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
      this.close();
    });
  }

  protected close(): void {
    if (this.dialog.open) this.dialog.close();
  }

  protected onDialogClose(): void {
    this.navContext.docsMenuOpen.set(false);
    this.navContext.focusDocsMenuTrigger();
  }

  protected onDialogPointerDown(event: MouseEvent): void {
    if (event.target === this.dialog) this.close();
  }

  private open(): void {
    if (this.dialog.open) return;
    this.dialog.showModal();
    this.navContext.docsMenuOpen.set(true);
  }
}
