import { Component, signal } from '@angular/core';
import { RvTranslatePipe } from '@rivinia/i18n';
import { RiviniaModalDialog } from '@rivinia/modal/ui';

@Component({
  imports: [RiviniaModalDialog, RvTranslatePipe],
  selector: 'app-showcase-modal-example',
  templateUrl: './modal-example.component.html',
  styleUrl: './modal-example.component.css',
})
export class ModalExampleComponent {
  protected readonly open = signal(false);
  protected readonly confirmed = signal(false);
  protected cancel(): void {
    this.open.set(false);
  }
  protected confirm(): void {
    this.confirmed.set(true);
    this.open.set(false);
  }
}
