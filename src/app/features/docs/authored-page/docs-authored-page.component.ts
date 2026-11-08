import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { RiviniaI18n } from '@rivinia/i18n';
import { PACKAGE_METADATA } from '../../packages/package-metadata';
import { DOCS_CONTENT } from '../shared/docs-content';
import { DocsAstComponent } from '../shared/components/docs-ast/docs-ast.component';
import { DocsLibraryHeaderComponent } from '../library-overview/components/docs-library-header/docs-library-header.component';
import { DocsSequenceNavComponent } from '../getting-started/components/docs-sequence-nav/docs-sequence-nav.component';

@Component({
  selector: 'app-docs-authored-page',
  imports: [DocsAstComponent, DocsLibraryHeaderComponent, DocsSequenceNavComponent],
  templateUrl: './docs-authored-page.component.html',
})
export class DocsAuthoredPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly data = toSignal(this.route.data, { initialValue: this.route.snapshot.data });
  protected readonly i18n = inject<RiviniaI18n<'ar' | 'en'>>(RiviniaI18n);
  protected readonly pages = computed(() =>
    DOCS_CONTENT.filter((page) => page.package === this.data()['docsPackageId']),
  );
  protected readonly index = computed(() =>
    this.pages().findIndex((page) => page.section === this.data()['section']),
  );
  protected readonly page = computed(() => this.pages()[this.index()]);
  protected readonly metadata = computed(
    () => PACKAGE_METADATA[this.data()['docsPackageId'] as keyof typeof PACKAGE_METADATA],
  );
  protected readonly previous = computed(() => this.step(this.index() - 1));
  protected readonly next = computed(() => this.step(this.index() + 1));
  private step(index: number) {
    const page = this.pages()[index];
    return page ? { href: page.route, title: page.title } : null;
  }
}
