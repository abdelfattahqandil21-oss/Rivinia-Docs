import { Component, afterNextRender, inject } from '@angular/core';
import { RiviniaI18n } from '@rivinia/i18n';

import { CodeBlockComponent } from '../../../../../shared/components/code-block/code-block.component';

@Component({
  imports: [CodeBlockComponent],
  selector: 'section[app-docs-env-guide]',
  templateUrl: './docs-env-guide.component.html',
  styleUrl: './docs-env-guide.component.css',
})
export class DocsEnvGuideComponent {
  protected readonly i18n = inject<RiviniaI18n<'ar' | 'en'>>(RiviniaI18n);

  constructor() {
    afterNextRender(() => {
      const targetId = decodeURIComponent(window.location.hash.slice(1));
      if (targetId.startsWith('env-')) {
        document.getElementById(targetId)?.scrollIntoView?.({ block: 'start' });
      }
    });
  }

  protected readonly installCommand = 'npm install @rivinia/env';
  protected readonly addCommand = 'ng add @rivinia/env';
  protected readonly contract = `import type { BaseEnvironment } from '@rivinia/env';

export interface AppEnvironment extends BaseEnvironment {
  readonly apiUrl: string;
}`;
  protected readonly usage = `import { environment } from '../environments/environment';

export const apiUrl = environment.apiUrl;`;
  protected readonly buildCommands = `ng build --configuration dev
ng build --configuration stag
ng build --configuration prod`;
  protected readonly replacement = `{
  "fileReplacements": [
    {
      "replace": "src/environments/environment.ts",
      "with": "src/environments/environment.prod.ts"
    }
  ]
}`;

  protected readonly outputPaths = `dev   → builds/dev
stag  → builds/stag
prod  → builds/prod`;
}
