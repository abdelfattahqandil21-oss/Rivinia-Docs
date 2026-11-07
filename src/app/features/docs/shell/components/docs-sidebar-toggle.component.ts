import { Component, inject, input } from '@angular/core';

import { DocsSidebarService } from '../services/docs-sidebar.service';

@Component({
  selector: 'button[app-docs-sidebar-toggle]',
  template: '{{ label() }}',
  styleUrl: './docs-sidebar-toggle.component.css',
  host: {
    type: 'button',
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
