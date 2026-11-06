/**
 * Brand mark (shared/components/brand-mark).
 *
 * WHAT: the Rivinia emblem — four modules around a shared core, no wordmark.
 * WHO USES IT: the navbar and any surface that needs the logo.
 * WHEN/WHY: SVG stays inline so it scales with `size-*` and follows the
 *   `--rv-*` theme tokens instead of shipping two raster files.
 *
 * Gradient ids are unique per instance: two marks on one page would otherwise
 * share an id, and the second would inherit the first's fill.
 */

import { Component } from '@angular/core';

let nextBrandMarkId = 0;

@Component({
  selector: 'app-brand-mark',
  templateUrl: './brand-mark.component.html',
  styleUrl: './brand-mark.component.css',
})
export class BrandMarkComponent {
  protected readonly goldId = `rv-brand-gold-${nextBrandMarkId}`;
  protected readonly violetId = `rv-brand-violet-${nextBrandMarkId++}`;
}
