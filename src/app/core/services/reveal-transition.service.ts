import { DOCUMENT } from '@angular/common';
import { inject, Service } from '@angular/core';

/** `expand` reveals the new state outward; `collapse` folds it back in. */
export type RevealDirection = 'expand' | 'collapse';

/**
 * Origin-aware reveal for a DOM update.
 *
 * WHAT: runs `update()` inside a View Transition and animates a circle either
 *   outward from the element the visitor pressed (`expand`) or back into it
 *   (`collapse`).
 * WHO USES IT: the preferences menu — theme and language switches share the
 *   same reveal, in both directions.
 * WHEN/WHY: one place owns the origin maths, the CSS custom properties the
 *   `::view-transition` rules read, and the cleanup. The animated clip lives on
 *   a snapshot layer, so it is composited without touching layout or paint of
 *   the live page. Without the View Transition API (or with reduced motion) it
 *   applies the update plainly, so the control never becomes the thing that
 *   breaks.
 */
@Service()
export class RevealTransitionService {
  private readonly document = inject(DOCUMENT);
  private running = false;

  /** Applies `update`, revealing it from `origin`'s centre when supported. */
  run(origin: HTMLElement | null, update: () => void, direction: RevealDirection = 'expand'): void {
    const view = this.document.defaultView;
    const root = this.document.documentElement;
    const reducedMotion = view?.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;

    if (
      this.running ||
      !view ||
      typeof this.document.startViewTransition !== 'function' ||
      reducedMotion
    ) {
      update();
      return;
    }

    const bounds = origin?.getBoundingClientRect();
    const originX = bounds ? bounds.left + bounds.width / 2 : view.innerWidth / 2;
    const originY = bounds ? bounds.top + bounds.height / 2 : view.innerHeight / 2;
    const radius = Math.max(
      Math.hypot(originX, originY),
      Math.hypot(view.innerWidth - originX, originY),
      Math.hypot(originX, view.innerHeight - originY),
      Math.hypot(view.innerWidth - originX, view.innerHeight - originY),
    );

    root.style.setProperty('--rv-reveal-x', `${originX}px`);
    root.style.setProperty('--rv-reveal-y', `${originY}px`);
    root.style.setProperty('--rv-reveal-radius', `${radius}px`);
    root.setAttribute('data-rv-reveal', direction);

    const finish = () => {
      this.running = false;
      root.removeAttribute('data-rv-reveal');
      root.style.removeProperty('--rv-reveal-x');
      root.style.removeProperty('--rv-reveal-y');
      root.style.removeProperty('--rv-reveal-radius');
    };

    this.running = true;
    try {
      const transition = this.document.startViewTransition(update);
      void transition.finished.then(finish, finish);
    } catch {
      // The API exists but refused to start (hidden document, duplicate name):
      // apply the update plainly instead of leaving the reveal armed.
      finish();
      update();
    }
  }
}
