import { Component, inject } from '@angular/core';
import { RiviniaI18n, RvTranslatePipe } from '@rivinia/i18n';
import { injectRiviniaToast } from '@rivinia/toast';

@Component({
  imports: [RvTranslatePipe],
  selector: 'app-showcase-toast-example',
  templateUrl: './toast-example.component.html',
  styleUrl: './toast-example.component.css',
})
export class ToastExampleComponent {
  private readonly i18n = inject<RiviniaI18n<'ar' | 'en'>>(RiviniaI18n);
  private readonly toast = injectRiviniaToast();
  protected show(kind: 'success' | 'info' | 'warning'): void {
    this.toast.show({
      message: this.i18n.translate(`showcase.toast.${kind}Message`),
      kind,
      dedupeKey: 'showcase-toast-demo',
    });
  }
}
