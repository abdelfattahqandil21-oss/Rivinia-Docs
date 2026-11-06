/**
 * Icon renderer (shared/components/icon).
 *
 * WHAT: `<app-icon name size strokeWidth title>` — resolves the
 *   `AppIconName` through lazy `iconLoaders` so `@lucide/angular`
 *   stays out of the initial bundle.
 * WHO USES IT: Every template needing an icon.
 * WHEN/WHY: One icon API; new icons = one registry line.
 *
 * @author Abdelfattah qandil
 */

import { Component, input } from '@angular/core';
import { LucideDynamicIcon } from '@lucide/angular';

import type { AppIconName } from './icon-registry';

@Component({
  imports: [LucideDynamicIcon],
  selector: 'app-icon',
  templateUrl: './icon.component.html',
  styleUrl: './icon.component.css',
})
export class IconComponent {
  readonly name = input.required<AppIconName>();

  readonly size = input<number | string>(24);

  readonly strokeWidth = input<number | string>(2);

  readonly title = input<string | null>(null);
}
