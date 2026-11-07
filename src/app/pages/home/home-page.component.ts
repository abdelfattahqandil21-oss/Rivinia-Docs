import { DOCUMENT } from '@angular/common';
import { afterNextRender, Component, DestroyRef, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RiviniaI18n } from '@rivinia/i18n';

import { InteractiveShowcaseComponent } from '../../features/showcase/interactive-showcase.component';
import { highlightShowcaseCode } from '../../features/showcase/showcase-code-highlight';
import { BrandMarkComponent } from '../../shared/components/brand-mark/brand-mark.component';
import { PreferencesMenuComponent } from '../../layout/preferences-menu/preferences-menu.component';

type DecisionId = 'api' | 'flexibility' | 'signals' | 'accessibility';
type HomeSectionId = 'hero' | 'experience' | 'decisions' | 'start';

interface HomeCodeStep {
  readonly id: 'install' | 'import' | 'use';
  readonly titleKey: string;
  readonly filename: string;
  readonly language: string;
  readonly code: string;
}

@Component({
  imports: [RouterLink, InteractiveShowcaseComponent, BrandMarkComponent, PreferencesMenuComponent],
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
})
export class HomePageComponent {
  protected readonly i18n = inject<RiviniaI18n<'ar' | 'en'>>(RiviniaI18n);
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly copyStatus = signal('');
  protected readonly copiedStepId = signal<HomeCodeStep['id'] | null>(null);
  protected readonly failedStepId = signal<HomeCodeStep['id'] | null>(null);
  protected readonly activeDecision = signal<DecisionId | null>(null);
  protected readonly activeSection = signal<HomeSectionId>('hero');
  protected readonly homeSections: readonly HomeSectionId[] = [
    'hero',
    'experience',
    'decisions',
    'start',
  ];
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
  protected readonly headlessTokens = highlightShowcaseCode(this.headlessSnippet, 'typescript');
  protected readonly uiTokens = highlightShowcaseCode(this.uiSnippet, 'html');
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
      language: 'TypeScript',
      code: `import { Component } from '@angular/core';\nimport { RiviniaSelectComponent } from '@rivinia/select/ui';`,
    },
    {
      id: 'use',
      titleKey: 'home.step.use',
      filename: 'example.component.html',
      language: 'HTML',
      code: `<rv-select\n  mode="single"\n  [options]="options()"\n  [label]="'Choose capabilities'"\n  [searchable]="true"\n  [value]="singleValue()"\n  (valueChange)="singleValue.set($event)"\n/>`,
    },
  ];
  constructor() {
    afterNextRender(() => {
      const view = this.document.defaultView;
      if (!view || typeof view.IntersectionObserver !== 'function') {
        return;
      }

      const sections = this.document.querySelectorAll<HTMLElement>('.home-page .home-section');
      const visibleRatios = new Map<Element, number>();
      const revealedSections = new Set<Element>();
      const observer = new view.IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              if (!revealedSections.has(entry.target)) {
                entry.target.classList.add('is-visible');
                revealedSections.add(entry.target);
              }
            }
            visibleRatios.set(entry.target, entry.isIntersecting ? entry.intersectionRatio : 0);
          }

          const active = [...visibleRatios.entries()].sort((a, b) => b[1] - a[1])[0]?.[0];
          if (active?.id && this.homeSections.includes(active.id as HomeSectionId)) {
            this.activeSection.set(active.id as HomeSectionId);
          }
        },
        { rootMargin: '-20% 0px -20% 0px', threshold: [0, 0.12, 0.25, 0.5, 0.75] },
      );

      sections.forEach((section) => {
        section.classList.add('section-reveal');
        visibleRatios.set(section, 0);
        observer.observe(section);
      });
      this.destroyRef.onDestroy(() => observer.disconnect());
    });
  }

  protected setActiveDecision(id: DecisionId | null): void {
    this.activeDecision.set(id);
  }

  protected async copyStep(step: HomeCodeStep): Promise<void> {
    const clipboard = this.document.defaultView?.navigator.clipboard;
    if (!clipboard) {
      this.failedStepId.set(step.id);
      this.copiedStepId.set(null);
      return;
    }

    try {
      await clipboard.writeText(step.code);
      this.copiedStepId.set(step.id);
      this.failedStepId.set(null);
    } catch {
      this.failedStepId.set(step.id);
      this.copiedStepId.set(null);
    }
  }

  protected async copyInstall(): Promise<void> {
    const clipboard = this.document.defaultView?.navigator.clipboard;
    if (!clipboard) {
      this.copyStatus.set(this.i18n.translate('home.copyError'));
      return;
    }

    try {
      await clipboard.writeText('npm i @rivinia/select');
      this.copyStatus.set(this.i18n.translate('home.copySuccess'));
    } catch {
      this.copyStatus.set(this.i18n.translate('home.copyError'));
    }
  }
}
