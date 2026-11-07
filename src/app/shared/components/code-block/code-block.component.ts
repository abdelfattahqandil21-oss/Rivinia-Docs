import { Component, computed, input } from '@angular/core';

import { CopyButtonComponent } from '../copy-button/copy-button.component';
import { highlightCode } from '../../utils/code-highlight';
import type { CodeLanguage } from '../../utils/code-highlight';

@Component({
  imports: [CopyButtonComponent],
  selector: 'app-code-block',
  templateUrl: './code-block.component.html',
  styleUrl: './code-block.component.css',
})
export class CodeBlockComponent {
  readonly code = input.required<string>();
  readonly language = input.required<Exclude<CodeLanguage, 'typescript'>>();
  readonly filename = input<string | null>(null);
  readonly caption = input<string | null>(null);

  protected readonly tokens = computed(() => highlightCode(this.code(), this.language()));
  protected readonly languageName = computed(() => {
    const language = this.language();
    if (language === 'ts') return 'TypeScript';
    return language.toUpperCase();
  });
}
