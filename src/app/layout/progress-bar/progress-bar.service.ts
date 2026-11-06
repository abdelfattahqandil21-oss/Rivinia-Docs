import { DOCUMENT } from '@angular/common';
import { DestroyRef, inject, Service, signal } from '@angular/core';

/**
 * Top progress bar state (single source of truth).
 *
 * WHAT: visible + value signals with a trickle that eases towards 92%.
 * WHO USES IT: `ProgressBarComponent` (renders) and `ProgressBarDirective`
 *   (starts/finishes on navigation).
 * WHEN/WHY: keeping the timing here means any trigger (router, link clicks,
 *   a manual import) drives the same bar.
 *
 * SSR-safe: with no `defaultView` nothing starts, so the server renders the
 * bar hidden and no timer is scheduled.
 */
@Service()
export class ProgressBarService {
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);

  private readonly visibleState = signal(false);
  private readonly valueState = signal(0);

  readonly visible = this.visibleState.asReadonly();
  readonly value = this.valueState.asReadonly();

  private trickleId: number | undefined;
  private hideId: number | undefined;

  constructor() {
    this.destroyRef.onDestroy(() => this.clearTimers());
  }

  /** Shows the bar and begins the trickle. Idempotent while already running. */
  start(): void {
    const view = this.document.defaultView;
    if (!view) {
      return;
    }

    if (this.visibleState() && this.valueState() < 100) {
      return;
    }

    this.clearTimers();
    this.visibleState.set(true);
    this.valueState.set(8);

    // Never reach 100% on its own: the bar only completes when navigation does.
    this.trickleId = view.setInterval(() => {
      const current = this.valueState();
      if (current >= 92) {
        return;
      }

      this.valueState.set(Math.min(92, current + Math.max(0.6, (92 - current) * 0.06)));
    }, 220);
  }

  /** Jumps to 100% and fades out after the width transition. */
  complete(): void {
    if (!this.visibleState()) {
      return;
    }

    const view = this.document.defaultView;
    this.clearTimers();
    this.valueState.set(100);

    if (!view) {
      this.reset();
      return;
    }

    this.hideId = view.setTimeout(() => this.reset(), 260);
  }

  /** Hides immediately — used when navigation fails. */
  fail(): void {
    this.clearTimers();
    this.reset();
  }

  private reset(): void {
    this.visibleState.set(false);
    this.valueState.set(0);
  }

  private clearTimers(): void {
    const view = this.document.defaultView;

    if (this.trickleId !== undefined) {
      view?.clearInterval(this.trickleId);
      this.trickleId = undefined;
    }

    if (this.hideId !== undefined) {
      view?.clearTimeout(this.hideId);
      this.hideId = undefined;
    }
  }
}
