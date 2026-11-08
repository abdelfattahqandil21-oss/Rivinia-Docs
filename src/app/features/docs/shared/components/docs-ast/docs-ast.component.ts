import { Component, inject, input } from '@angular/core';
import { RiviniaI18n } from '@rivinia/i18n';
import { CodeBlockComponent } from '../../../../../shared/components/code-block/code-block.component';
import { DocsExampleComponent } from '../docs-example/docs-example.component';
import type { DocsNode } from '../../models/docs-content.model';

@Component({
  selector: 'app-docs-ast',
  imports: [CodeBlockComponent, DocsExampleComponent],
  templateUrl: './docs-ast.component.html',
  styleUrl: './docs-ast.component.css',
  host: { style: 'display: contents' },
})
export class DocsAstComponent {
  readonly package = input('theme');
  readonly nodes = input.required<readonly DocsNode[]>();
  protected readonly i18n = inject(RiviniaI18n);
}
