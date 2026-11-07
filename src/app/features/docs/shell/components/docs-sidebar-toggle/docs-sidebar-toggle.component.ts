import { Component, inject, input } from '@angular/core';

import { IconComponent } from '../../../../../shared/components/icon/icon.component';
import { DocsSidebarService } from '../../services/docs-sidebar.service';

@Component({
  imports: [IconComponent],
  selector: 'button[app-docs-sidebar-toggle]',
  template: `
    <app-icon
      [name]="expanded() ? 'panel-left-close' : 'panel-left-open'"
      [size]="18"
      aria-hidden="true"
    />
  `,
  styleUrl: './docs-sidebar-toggle.component.css',
  host: {
    type: 'button',
    '[attr.aria-label]': 'label()',
    '[attr.aria-controls]': 'controls()',
    '[attr.aria-expanded]': 'expanded()',
    '(click)': 'sidebar.toggleSidebar()',
  },
})
export class DocsSidebarToggleComponent {
  readonly label = input.required<string>();
  readonly controls = input.required<string>();
  readonly expanded = input.required<boolean>();

  protected readonly sidebar = inject(DocsSidebarService);
}
