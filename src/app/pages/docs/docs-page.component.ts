import { afterNextRender, Component, DestroyRef, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { RiviniaI18n } from '@rivinia/i18n';

import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';

@Component({
  imports: [RouterLink, RouterLinkActive, PageHeaderComponent],
  selector: 'app-docs-page',
  host: { class: 'block' },
  templateUrl: './docs-page.component.html',
})
export class DocsPageComponent {
  private readonly destroyRef = inject(DestroyRef);

  protected readonly i18n = inject<RiviniaI18n<'ar' | 'en'>>(RiviniaI18n);
  protected readonly activeHeading = signal('');
  protected readonly routeMatchOptions = {
    paths: 'exact',
    queryParams: 'ignored',
    matrixParams: 'ignored',
    fragment: 'exact',
  } as const;

  protected readonly title = this.i18n.t('page.docs.title');
  protected readonly lead = this.i18n.t('page.docs.lead');

  constructor() {
    afterNextRender(() => {
      if (typeof IntersectionObserver === 'undefined') return;

      const headings = ['start-title', 'install-title', 'areas-title']
        .map((id) => document.getElementById(id))
        .filter((element): element is HTMLElement => element !== null);
      const inView = new Set<HTMLElement>();
      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            const heading = entry.target as HTMLElement;
            if (entry.isIntersecting) inView.add(heading);
            else inView.delete(heading);
          }
          const current = [...inView].sort(
            (first, second) =>
              first.getBoundingClientRect().top - second.getBoundingClientRect().top,
          )[0];
          this.activeHeading.set(current?.id ?? '');
        },
        { rootMargin: '-15% 0px -70% 0px' },
      );

      for (const heading of headings) observer.observe(heading);
      this.destroyRef.onDestroy(() => observer.disconnect());
    });
  }
}
