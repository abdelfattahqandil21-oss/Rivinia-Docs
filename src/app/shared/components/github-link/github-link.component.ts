/**
 * GitHub link (shared/components/github-link).
 *
 * WHAT: the project's GitHub destination as one accessible, self-contained
 *   link — mark, optional label, and the "opens in a new tab" hint.
 * WHO USES IT: the navbar — a quiet icon at the end of the desktop header and
 *   a full-width row at the bottom of the mobile panel.
 * WHEN/WHY: Lucide ships no brand icons, so the mark is inline SVG; keeping it
 *   here means the navbar never repeats the path. `variant` covers the three
 *   placements without a second template.
 */

import { Component, computed, input } from '@angular/core';

import { GITHUB_LINK } from '../../../core/config/navigation';

export type GithubLinkVariant = 'icon' | 'pill' | 'row';

@Component({
  selector: 'app-github-link',
  templateUrl: './github-link.component.html',
  styleUrl: './github-link.component.css',
})
export class GithubLinkComponent {
  readonly label = input.required<string>();

  /** Announced after the label, e.g. "opens in a new tab". */
  readonly newTabLabel = input('');

  /**
   * `icon` — a square button for the header.
   * `pill` — mark plus label, for inline placement.
   * `row` — full-width row with a centred label, for the mobile panel.
   */
  readonly variant = input<GithubLinkVariant>('pill');

  protected readonly href = GITHUB_LINK.href;

  protected readonly accessibleLabel = computed(() => {
    const hint = this.newTabLabel();
    return hint ? `${this.label()} (${hint})` : this.label();
  });

  protected readonly linkClass = computed(() => {
    switch (this.variant()) {
      case 'icon':
        return 'inline-grid size-11 place-items-center rounded-full border border-rv-border text-rv-muted transition-colors duration-150 hover:border-rv-accent hover:text-rv-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rv-accent motion-reduce:transition-none';
      case 'row':
        return 'flex h-12 w-full items-center justify-center gap-2 rounded-lg border border-rv-border text-sm font-medium text-rv-muted transition-colors duration-150 hover:border-rv-accent hover:text-rv-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rv-accent motion-reduce:transition-none';
      default:
        return 'inline-flex items-center gap-2 rounded-lg border border-rv-border px-3 py-2 text-sm font-medium text-rv-muted transition-colors duration-150 hover:border-rv-accent hover:text-rv-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rv-accent motion-reduce:transition-none';
    }
  });
}
