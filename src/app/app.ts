import { DOCUMENT } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { RiviniaI18n } from '@rivinia/i18n';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ProgressBarService } from './layout/progress-bar/progress-bar.service';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { ProgressBarComponent } from './layout/progress-bar/progress-bar.component';
import { ProgressBarDirective } from './layout/progress-bar/progress-bar.directive';

@Component({
  imports: [RouterOutlet, NavbarComponent, ProgressBarComponent, ProgressBarDirective],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  private readonly i18n = inject<RiviniaI18n<'ar' | 'en'>>(RiviniaI18n);
  private readonly document = inject(DOCUMENT);
  private readonly progressBar = inject(ProgressBarService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly skipLabel = this.i18n.t('nav.skipToContent');
  protected readonly skipLinkHref = signal(this.skipHref(this.router.url));
  protected readonly loadingLabel = this.i18n.t('common.loading');

  protected readonly progressValue = this.progressBar.value;
  protected readonly progressVisible = this.progressBar.visible;

  protected focusMainContent(): void {
    this.document.getElementById('main-content')?.focus();
  }

  constructor() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.skipLinkHref.set(this.skipHref(event.urlAfterRedirects));
        }
      });
  }

  private skipHref(url: string): string {
    const path = url.split(/[?#]/, 1)[0];
    return `${path || '/'}#main-content`;
  }
}
