import { DOCUMENT } from '@angular/common';
import { Component, computed, DestroyRef, inject, input, signal } from '@angular/core';
import { RiviniaI18n } from '@rivinia/i18n';

type CopyStatus = 'idle' | 'copying' | 'copied' | 'failed';

@Component({
  selector: 'app-copy-button',
  templateUrl: './copy-button.component.html',
  styleUrl: './copy-button.component.css',
})
export class CopyButtonComponent {
  readonly code = input.required<string>();
  readonly label = input<string | null>(null);
  readonly copiedMessage = input<string | null>(null);
  readonly errorMessage = input<string | null>(null);
  readonly icon = input<'copy' | 'link'>('copy');

  protected readonly status = signal<CopyStatus>('idle');
  protected readonly accessibleName = computed(
    () => this.label() ?? this.i18n.translate('common.copyCodeLabel'),
  );
  protected readonly announcement = computed(() => {
    if (this.status() === 'copied') {
      return this.copiedMessage() ?? this.i18n.translate('common.copyCodeSuccess');
    }
    if (this.status() === 'failed') {
      return this.errorMessage() ?? this.i18n.translate('common.copyCodeError');
    }
    return '';
  });

  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  private readonly i18n = inject<RiviniaI18n<'ar' | 'en'>>(RiviniaI18n);
  private requestId = 0;
  private cancelPendingCopy: (() => void) | null = null;
  private operationTimer: number | null = null;
  private displayTimer: number | null = null;

  constructor() {
    this.destroyRef.onDestroy(() => {
      this.requestId += 1;
      this.cancelCopy();
      this.clearDisplayTimer();
    });
  }

  protected async copy(): Promise<void> {
    this.cancelCopy();
    this.clearDisplayTimer();
    const requestId = ++this.requestId;
    this.status.set('copying');

    const view = this.document.defaultView;
    if (!view) {
      this.showStatus('failed', 2500);
      return;
    }

    const clipboard = view.navigator.clipboard;
    let copied: boolean | null = false;
    if (clipboard?.writeText) {
      let cancelThisCopy: (() => void) | null = null;
      let operationTimer: number | null = null;
      try {
        copied = await new Promise<boolean | null>((resolve) => {
          cancelThisCopy = () => resolve(null);
          this.cancelPendingCopy = cancelThisCopy;
          operationTimer = view.setTimeout(() => resolve(null), 2500);
          this.operationTimer = operationTimer;
          void clipboard.writeText(this.code()).then(
            () => resolve(true),
            () => resolve(false),
          );
        });
      } catch {
        copied = false;
      }
      if (operationTimer !== null) view.clearTimeout(operationTimer);
      if (this.operationTimer === operationTimer) this.operationTimer = null;
      if (this.cancelPendingCopy === cancelThisCopy) this.cancelPendingCopy = null;
    }

    if (requestId !== this.requestId) return;

    if (copied === null) {
      this.showStatus('failed', 2500);
      return;
    }

    if (!copied) copied = this.copyWithTextarea(view);
    this.showStatus(copied ? 'copied' : 'failed', copied ? 2000 : 2500);
  }

  private copyWithTextarea(view: Window): boolean {
    const textarea = this.document.createElement('textarea');
    const activeElement = this.document.activeElement as HTMLElement | null;
    textarea.value = this.code();
    textarea.dir = 'ltr';
    textarea.setAttribute('aria-hidden', 'true');
    textarea.tabIndex = -1;
    textarea.style.position = 'fixed';
    textarea.style.insetInlineStart = '-9999px';
    textarea.style.opacity = '0';
    this.document.body.append(textarea);
    textarea.select();

    let copied = false;
    try {
      copied = this.document.execCommand('copy');
    } catch {
      copied = false;
    } finally {
      textarea.remove();
      if (activeElement?.isConnected) activeElement.focus({ preventScroll: true });
    }

    return copied;
  }

  private showStatus(status: 'copied' | 'failed', duration: number): void {
    this.status.set(status);
    const view = this.document.defaultView;
    if (view) this.displayTimer = view.setTimeout(() => this.status.set('idle'), duration);
  }

  private clearOperationTimer(): void {
    const view = this.document.defaultView;
    if (view && this.operationTimer !== null) view.clearTimeout(this.operationTimer);
    this.operationTimer = null;
  }

  private cancelCopy(): void {
    this.cancelPendingCopy?.();
    this.cancelPendingCopy = null;
    this.clearOperationTimer();
  }

  private clearDisplayTimer(): void {
    const view = this.document.defaultView;
    if (view && this.displayTimer !== null) view.clearTimeout(this.displayTimer);
    this.displayTimer = null;
  }
}
