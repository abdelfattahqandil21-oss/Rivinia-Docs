import { NgComponentOutlet } from '@angular/common';
import { Component, Type, effect, inject, input, signal } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import type { DocsExample } from '../../models/docs-example.model';
@Component({
  selector: 'app-docs-example-preview',
  imports: [NgComponentOutlet],
  template: `@if (example().meta.mode === 'frame') {
      <iframe
        sandbox="allow-scripts"
        [title]="example().meta.title"
        [srcdoc]="srcdoc()"
        [style.block-size.px]="example().meta.minHeight"
      ></iframe>
    } @else if (component(); as type) {
      <ng-container *ngComponentOutlet="type" />
    }`,
  styles: `
    :host {
      display: block;
    }
    iframe {
      display: block;
      border: 0;
      inline-size: 100%;
    }
  `,
})
export class DocsExamplePreviewComponent {
  readonly example = input.required<DocsExample>();
  readonly theme = input<'light' | 'dark'>('light');
  readonly direction = input<'ltr' | 'rtl'>('ltr');
  private readonly sanitizer = inject(DomSanitizer);
  protected readonly component = signal<Type<unknown> | null>(null);
  protected readonly srcdoc = signal(this.sanitizer.bypassSecurityTrustHtml(''));
  constructor() {
    effect((onCleanup) => {
      const example = this.example();
      let current = true;
      onCleanup(() => {
        current = false;
      });
      const bridge = `<script>document.documentElement.dir=${JSON.stringify(this.direction())};${example.meta.variants.includes('theme') ? `document.documentElement.setAttribute('data-rv-theme',${JSON.stringify(this.theme())});` : ''}</script>`;
      this.srcdoc.set(
        this.sanitizer.bypassSecurityTrustHtml(
          example.srcdoc.replace('</head>', bridge + '</head>'),
        ),
      );
      this.component.set(null);
      if (example.load)
        void example.load().then((component) => {
          if (current) this.component.set(component);
        });
    });
  }
}
