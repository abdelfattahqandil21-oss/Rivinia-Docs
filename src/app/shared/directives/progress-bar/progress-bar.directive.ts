/**
 * Progress bar trigger (shared/directives/progress-bar).
 *
 * WHAT: `[appProgressBar]` — starts the top bar on a same-origin link click and
 *   on `NavigationStart`, completes on `NavigationEnd`/`NavigationCancel`, and
 *   hides on `NavigationError`.
 * WHO USES IT: the app shell, on the `app-progress-bar` element.
 * WHEN/WHY: clicking a link starts feedback before the lazy chunk resolves;
 *   the router events finish it. External, download, hash and new-tab links
 *   are ignored so the bar never lies about leaving the app.
 *
 * The click listener runs in the capture phase on purpose: it fires before
 * RouterLink's own handler, so the bar appears immediately.
 */

import { DOCUMENT } from '@angular/common';
import { DestroyRef, Directive, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationSkipped,
  NavigationStart,
  Router,
} from '@angular/router';

import { ProgressBarService } from '../../../core/services/progress-bar.service';

@Directive({
  selector: '[appProgressBar]',
})
export class ProgressBarDirective {
  private readonly router = inject(Router);
  private readonly progressBar = inject(ProgressBarService);
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);

  /** Fallback for a click that never turns into a router navigation. */
  private clickWatchdogId: number | undefined;

  private readonly onClick = (event: MouseEvent): void => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    const target = event.target;
    const view = this.document.defaultView;
    if (!(target instanceof Element) || !view) {
      return;
    }

    const anchor = target.closest('a[href]');
    if (!anchor || anchor.hasAttribute('download')) {
      return;
    }

    const anchorTarget = anchor.getAttribute('target');
    if (anchorTarget && anchorTarget !== '_self') {
      return;
    }

    const href = anchor.getAttribute('href');
    if (!href || href.startsWith('#') || /^(mailto|tel):/i.test(href)) {
      return;
    }

    const url = new URL(href, view.location.href);
    if (url.origin !== view.location.origin) {
      return;
    }

    this.progressBar.start();
    this.clearClickWatchdog();
    this.clickWatchdogId = view.setTimeout(() => {
      this.clickWatchdogId = undefined;
      this.progressBar.complete();
    }, 1500);
  };

  constructor() {
    this.router.events.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.clearClickWatchdog();
        this.progressBar.start();
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationSkipped
      ) {
        this.progressBar.complete();
      } else if (event instanceof NavigationError) {
        this.progressBar.fail();
      }
    });

    this.document.addEventListener('click', this.onClick, { capture: true });
    this.destroyRef.onDestroy(() => {
      this.document.removeEventListener('click', this.onClick, { capture: true });
      this.clearClickWatchdog();
    });
  }

  private clearClickWatchdog(): void {
    if (this.clickWatchdogId === undefined) {
      return;
    }

    this.document.defaultView?.clearTimeout(this.clickWatchdogId);
    this.clickWatchdogId = undefined;
  }
}
