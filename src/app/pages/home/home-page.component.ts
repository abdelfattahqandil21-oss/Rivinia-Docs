import {
  afterNextRender,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RiviniaI18n } from '@rivinia/i18n';

import { CodeBlockComponent } from '../../shared/components/code-block/code-block.component';
import { BrandMarkComponent } from '../../shared/components/brand-mark/brand-mark.component';
import { PreferencesMenuComponent } from '../../layout/preferences-menu/preferences-menu.component';

type ShowcaseComponent =
  typeof import('../../features/showcase/interactive-showcase.component').InteractiveShowcaseComponent;
type ExperienceState = 'placeholder' | 'loading' | 'ready' | 'error';

type DecisionId = 'api' | 'flexibility' | 'signals' | 'accessibility';
interface HomeCodeStep {
  readonly id: 'install' | 'import' | 'use';
  readonly titleKey: string;
  readonly filename: string;
  readonly language: 'bash' | 'ts' | 'html';
  readonly code: string;
}

@Component({
  imports: [
    RouterLink,
    NgComponentOutlet,
    CodeBlockComponent,
    BrandMarkComponent,
    PreferencesMenuComponent,
  ],
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
})
export class HomePageComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly experienceHost = viewChild<ElementRef<HTMLElement>>('experienceHost');
  private experienceModule: Promise<ShowcaseComponent> | null = null;
  private revealObserver: IntersectionObserver | null = null;
  protected readonly experienceState = signal<ExperienceState>('placeholder');
  protected readonly experienceComponent = signal<ShowcaseComponent | null>(null);
  protected readonly revealExperience = signal(false);
  protected readonly i18n = inject<RiviniaI18n<'ar' | 'en'>>(RiviniaI18n);
  protected readonly activeDecision = signal<DecisionId | null>(null);
  protected readonly headlessSnippet = `import { RiviniaSelect } from '@rivinia/select';

const select = new RiviniaSelect('multi');
select.syncOptions(options);
select.toggle(option.id);`;
  protected readonly uiSnippet = `<rv-select
  mode="single"
  [options]="options()"
  [label]="'Choose capabilities'"
  [searchable]="true"
  [value]="singleValue()"
  (valueChange)="singleValue.set($event)"
/>`;
  protected readonly gettingStartedSteps: readonly HomeCodeStep[] = [
    {
      id: 'install',
      titleKey: 'home.step.install',
      filename: 'terminal',
      language: 'bash',
      code: 'npm i @rivinia/select',
    },
    {
      id: 'import',
      titleKey: 'home.step.import',
      filename: 'example.component.ts',
      language: 'ts',
      code: `import { Component } from '@angular/core';\nimport { RiviniaSelectComponent } from '@rivinia/select/ui';`,
    },
    {
      id: 'use',
      titleKey: 'home.step.use',
      filename: 'example.component.html',
      language: 'html',
      code: `<rv-select\n  mode="single"\n  [options]="options()"\n  [label]="'Choose capabilities'"\n  [searchable]="true"\n  [value]="singleValue()"\n  (valueChange)="singleValue.set($event)"\n/>`,
    },
  ];

  constructor() {
    afterNextRender(() => {
      this.observeExperience();
      this.prefetchExperienceOnIdle();
    });
  }

  protected setActiveDecision(id: DecisionId | null): void {
    this.activeDecision.set(id);
  }

  protected retryExperience(): void {
    void this.loadExperience();
  }

  private observeExperience(): void {
    const host = this.experienceHost()?.nativeElement;
    if (!host || typeof IntersectionObserver === 'undefined') {
      void this.loadExperience();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          void this.loadExperience();
        }
      },
      { rootMargin: '0px' },
    );
    observer.observe(host);
    this.destroyRef.onDestroy(() => observer.disconnect());
  }

  private prefetchExperienceOnIdle(): void {
    if (typeof window.requestIdleCallback === 'function') {
      const idleId = window.requestIdleCallback(() => {
        void this.getExperienceModule().catch(() => undefined);
      });
      this.destroyRef.onDestroy(() => window.cancelIdleCallback(idleId));
      return;
    }

    const timeoutId = window.setTimeout(() => {
      void this.getExperienceModule().catch(() => undefined);
    }, 1000);
    this.destroyRef.onDestroy(() => window.clearTimeout(timeoutId));
  }

  private getExperienceModule(): Promise<ShowcaseComponent> {
    this.experienceModule ??= import('../../features/showcase/interactive-showcase.component')
      .then((module) => module.InteractiveShowcaseComponent)
      .catch((error: unknown) => {
        this.experienceModule = null;
        throw error;
      });
    return this.experienceModule;
  }

  private async loadExperience(): Promise<void> {
    if (this.experienceState() === 'loading' || this.experienceState() === 'ready') return;

    const startedAt = performance.now();
    this.experienceState.set('loading');
    let timeoutId: number | undefined;

    try {
      const timeout = new Promise<never>((_, reject) => {
        timeoutId = window.setTimeout(() => reject(new Error('Experience load timed out')), 300);
      });
      const component = await Promise.race([this.getExperienceModule(), timeout]);
      await this.keepExperienceLoadingVisible(startedAt);
      this.experienceComponent.set(component);
      this.revealWhenVisible();
      this.experienceState.set('ready');
    } catch {
      await this.keepExperienceLoadingVisible(startedAt);
      this.experienceState.set('error');
    } finally {
      if (timeoutId !== undefined) window.clearTimeout(timeoutId);
    }
  }

  private async keepExperienceLoadingVisible(startedAt: number): Promise<void> {
    const remainingMinimum = 100 - (performance.now() - startedAt);
    if (remainingMinimum > 0) {
      await new Promise<void>((resolve) => window.setTimeout(resolve, remainingMinimum));
    }
  }

  private revealWhenVisible(): void {
    const host = this.experienceHost()?.nativeElement;
    if (!host) return;

    const revealIfNotPast = (): void => {
      if (host.getBoundingClientRect().bottom > 0) this.revealExperience.set(true);
    };
    const rect = host.getBoundingClientRect();
    if (rect.bottom <= 0) return;
    if (rect.top < window.innerHeight || typeof IntersectionObserver === 'undefined') {
      revealIfNotPast();
      return;
    }

    this.revealObserver = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        this.revealObserver?.disconnect();
        revealIfNotPast();
      }
    });
    this.revealObserver.observe(host);
    this.destroyRef.onDestroy(() => this.revealObserver?.disconnect());
  }
}
