import { Component, input } from '@angular/core';

import { PageHeaderComponent } from '../../../../../shared/components/page-header/page-header.component';

@Component({
  imports: [PageHeaderComponent],
  selector: 'header[app-docs-library-header]',
  templateUrl: './docs-library-header.component.html',
  styleUrl: './docs-library-header.component.css',
})
export class DocsLibraryHeaderComponent {
  readonly title = input.required<string>();
  readonly description = input.required<string>();
  readonly versionLabel = input.required<string>();
  readonly entryPoints = input.required<readonly string[]>();
  readonly entryPointsLabel = input.required<string>();
}
