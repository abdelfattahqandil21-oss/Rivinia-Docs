import { Component, computed, inject, signal } from '@angular/core';
import { RiviniaI18n, RvTranslatePipe } from '@rivinia/i18n';
import { RiviniaModalDialog } from '@rivinia/modal/ui';

@Component({
  imports: [RiviniaModalDialog, RvTranslatePipe],
  selector: 'app-showcase-modal-example',
  templateUrl: './modal-example.component.html',
  styleUrl: './modal-example.component.css',
})
export class ModalExampleComponent {
  protected readonly i18n = inject<RiviniaI18n<'ar' | 'en'>>(RiviniaI18n);
  protected readonly open = signal(false);
  protected readonly confirmed = signal(false);
  protected readonly title = computed(() => {
    this.i18n.currentLanguage();
    return this.i18n.translate('showcase.modal.title');
  });
  protected readonly description = computed(() => {
    this.i18n.currentLanguage();
    return this.i18n.translate('showcase.modal.description');
  });
  protected cancel(): void {
    this.open.set(false);
  }
  protected confirm(): void {
    this.confirmed.set(true);
    this.open.set(false);
  }
}
