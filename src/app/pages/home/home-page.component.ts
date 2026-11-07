import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RiviniaI18n } from '@rivinia/i18n';

import { InteractiveShowcaseComponent } from '../../features/showcase/interactive-showcase.component';
import { CodeBlockComponent } from '../../shared/components/code-block/code-block.component';
import { BrandMarkComponent } from '../../shared/components/brand-mark/brand-mark.component';
import { PreferencesMenuComponent } from '../../layout/preferences-menu/preferences-menu.component';

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
    InteractiveShowcaseComponent,
    CodeBlockComponent,
    BrandMarkComponent,
    PreferencesMenuComponent,
  ],
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css',
})
export class HomePageComponent {
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
  protected setActiveDecision(id: DecisionId | null): void {
    this.activeDecision.set(id);
  }
}
