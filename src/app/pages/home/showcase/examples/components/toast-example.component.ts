import { Component, inject } from '@angular/core';
import { RiviniaI18n, RvTranslatePipe } from '@rivinia/i18n';
import { injectRiviniaToast } from '@rivinia/toast';
import { RiviniaToastList } from '@rivinia/toast/ui';

@Component({
  imports: [RiviniaToastList, RvTranslatePipe],
  selector: 'app-showcase-toast-example',
  templateUrl: '../templates/toast-example.component.html',
  styleUrl: '../styles/toast-example.component.css',
})
export class ToastExampleComponent {
  private readonly i18n = inject<RiviniaI18n<'ar' | 'en'>>(RiviniaI18n);
  private readonly toast = injectRiviniaToast();
  protected readonly toastManager = this.toast;

  protected show(kind: 'success' | 'info' | 'warning'): void {
    this.toast.show({
      message: this.i18n.translate(`showcase.toast.${kind}Message`),
      kind,
      dedupeKey: 'showcase-toast-demo',
    });
  }
}
