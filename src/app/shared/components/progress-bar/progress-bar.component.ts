/**
 * Top progress bar (shared/components/progress-bar).
 *
 * WHAT: a 2px brand-gradient bar pinned to the top of the viewport.
 * WHO USES IT: the app shell, next to `ProgressBarDirective`.
 * WHEN/WHY: presentational only — value/visibility come from inputs, so it can
 *   be driven by the router (normal case) or by any other async task.
 */

import { Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrl: './progress-bar.component.css',
})
export class ProgressBarComponent {
  /** Completion percentage, clamped to 0–100. */
  readonly value = input(0);

  readonly visible = input(true);

  /** Accessible name announced for the progressbar role. */
  readonly label = input('Loading');

  protected readonly clamped = computed(() => Math.min(100, Math.max(0, this.value())));

  protected readonly rounded = computed(() => Math.round(this.clamped()));
}
