/**
 * Page header (shared/components/page-header).
 *
 * WHAT: the eyebrow / serif title / lead block shared by every page, so the
 *   hierarchy stays identical across routes.
 * WHO USES IT: feature pages.
 * WHEN/WHY: one heading scale instead of four slightly different ones; extra
 *   actions project through `<ng-content />`.
 */

import { Component, input } from '@angular/core';

@Component({
  selector: 'app-page-header',
  templateUrl: './page-header.component.html',
  styleUrl: './page-header.component.css',
})
export class PageHeaderComponent {
  readonly eyebrow = input<string | null>(null);
  readonly title = input.required<string>();
  readonly lead = input<string | null>(null);
}
