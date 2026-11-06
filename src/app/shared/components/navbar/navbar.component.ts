/**
 * Site navbar (shared/components/navbar).
 *
 * WHAT: sticky, responsive primary navigation with brand, desktop links,
 *   theme + language controls, a "get started" CTA and a mobile disclosure
 *   panel.
 * WHO USES IT: the app shell (`app.html`).
 * WHEN/WHY: links come from `core/config/navigation.ts`, so the component is
 *   reused as-is; active state is derived from the router, and the optional
 *   `active` input overrides it for static previews.
 *
 * Accessibility: native `<nav>`/`<a>`/`<button>` only (no ARIA menu roles — a
 * site nav is not a menu widget), `aria-current="page"` on the active link,
 * `aria-expanded`/`aria-controls` on the disclosure button, Escape closes and
 * returns focus to it, and the mobile panel is removed from the DOM (not just
 * hidden) when closed.
 *
 * @author Abdelfattah qandil
 */

import {
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { toSignal, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { RiviniaI18n } from '@rivinia/i18n';
import { distinctUntilChanged, filter, map, startWith } from 'rxjs';

import { GITHUB_LINK, NAV_LINKS } from '../../../core/config/navigation';
import type { NavLink } from '../../../core/models/nav-link.model';
import { BrandMarkComponent } from '../brand-mark/brand-mark.component';
import { GithubLinkComponent } from '../github-link/github-link.component';
import { IconComponent } from '../icon/icon.component';
import { PreferencesMenuComponent } from '../preferences-menu/preferences-menu.component';

let nextNavbarId = 0;

@Component({
  imports: [
    RouterLink,
    BrandMarkComponent,
    GithubLinkComponent,
    IconComponent,
    PreferencesMenuComponent,
  ],
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
  host: {
    '(document:keydown.escape)': 'onEscape()',
    '(document:pointerdown)': 'onPointerDown($event)',
  },
})
export class NavbarComponent {
  readonly i18n = inject<RiviniaI18n<'ar' | 'en'>>(RiviniaI18n);

  /** Link set to render. Defaults to the site's primary navigation. */
  readonly links = input<readonly NavLink[]>(NAV_LINKS);

  /**
   * Explicit active override — a link id (`docs`) or a path (`/docs`).
   * Leave it unset in the app: the router decides. It exists so the component
   * can be embedded on a page that is not the active route (previews, docs).
   */
  readonly active = input<string | null>(null);

  protected readonly mobileNavId = `rv-mobile-nav-${nextNavbarId++}`;

  protected readonly menuOpen = signal(false);

  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly menuButton = viewChild<ElementRef<HTMLButtonElement>>('menuButton');
  private readonly menuPanel = viewChild<ElementRef<HTMLElement>>('menuPanel');

  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects),
      startWith(this.router.url),
      distinctUntilChanged(),
    ),
    { initialValue: this.router.url },
  );

  protected readonly activeId = computed(() => {
    const forced = this.active();
    if (forced) {
      return forced;
    }

    const url = this.currentUrl().split(/[?#]/)[0];
    const match = this.links().find((link) =>
      link.exact ? url === link.path : url === link.path || url.startsWith(`${link.path}/`),
    );

    return match?.id ?? null;
  });

  protected readonly primaryNavLabel = this.i18n.t('nav.primary');
  protected readonly mobileNavLabel = this.i18n.t('nav.mobile');
  protected readonly openMenuLabel = this.i18n.t('nav.openMenu');
  protected readonly closeMenuLabel = this.i18n.t('nav.closeMenu');
  protected readonly getStartedLabel = this.i18n.t('nav.getStarted');
  protected readonly githubLabel = this.i18n.t(GITHUB_LINK.labelKey);
  protected readonly newTabLabel = this.i18n.t('nav.opensInNewTab');

  constructor() {
    // A navigation always ends the mobile disclosure.
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => this.menuOpen.set(false));

    // Collapse the panel when the viewport grows past the mobile breakpoint,
    // so a resize cannot leave an orphaned open state.
    const view = inject(DOCUMENT).defaultView;
    const media =
      view && typeof view.matchMedia === 'function'
        ? view.matchMedia('(min-width: 768px)')
        : undefined;
    const onChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        this.menuOpen.set(false);
      }
    };
    media?.addEventListener('change', onChange);
    this.destroyRef.onDestroy(() => media?.removeEventListener('change', onChange));
  }

  protected isActive(link: NavLink): boolean {
    const active = this.activeId();
    return active === link.id || active === link.path;
  }

  protected toggleMenu(event: MouseEvent): void {
    const open = !this.menuOpen();
    this.menuOpen.set(open);

    if (open && event.detail === 0) {
      // Keyboard activation: move focus into the panel once it exists.
      setTimeout(() => this.firstPanelLink()?.focus());
    }
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
  }

  protected onEscape(): void {
    if (!this.menuOpen()) {
      return;
    }

    this.closeMenu();
    this.menuButton()?.nativeElement.focus();
  }

  protected onPointerDown(event: Event): void {
    if (!this.menuOpen()) {
      return;
    }

    const target = event.target;
    if (target instanceof Node && !this.host.nativeElement.contains(target)) {
      this.closeMenu();
    }
  }

  private firstPanelLink(): HTMLAnchorElement | null {
    return this.menuPanel()?.nativeElement.querySelector('a') ?? null;
  }
}
