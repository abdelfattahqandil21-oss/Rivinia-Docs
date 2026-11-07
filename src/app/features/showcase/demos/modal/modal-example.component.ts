import { Component, inject, signal, TemplateRef, viewChild } from '@angular/core';
import type { ModalGuard, ModalTemplateContext } from '@rivinia/modal';
import { injectRiviniaModal } from '@rivinia/modal';
import { RiviniaModalHost } from '@rivinia/modal/ui';
import { RiviniaI18n, RvTranslatePipe } from '@rivinia/i18n';
import { injectRiviniaToast, type Toast } from '@rivinia/toast';
import { RiviniaToastList } from '@rivinia/toast/ui';

interface PackageRecord {
  readonly name: string;
}

@Component({
  imports: [RiviniaModalHost, RiviniaToastList, RvTranslatePipe],
  selector: 'app-showcase-modal-example',
  templateUrl: './modal-example.component.html',
  styleUrl: './modal-example.component.css',
})
export class ModalExampleComponent {
  private readonly i18n = inject<RiviniaI18n<'ar' | 'en'>>(RiviniaI18n);
  private readonly toast = injectRiviniaToast();
  protected readonly modal = injectRiviniaModal();
  protected readonly toastManager = this.toast;
  protected readonly toastItems = this.toast.active;
  protected readonly editDraft = signal('Rivinia Select');
  protected readonly originalDraft = signal('Rivinia Select');
  protected readonly isDirty = signal(false);
  protected readonly deleteResult = signal('');

  private readonly detailsTemplate =
    viewChild.required<TemplateRef<ModalTemplateContext<PackageRecord>>>('detailsTemplate');
  private readonly workflowTemplate =
    viewChild.required<TemplateRef<ModalTemplateContext<PackageRecord>>>('workflowTemplate');
  private readonly deleteTemplate =
    viewChild.required<TemplateRef<ModalTemplateContext<PackageRecord>>>('deleteTemplate');
  private readonly editTemplate =
    viewChild.required<TemplateRef<ModalTemplateContext<PackageRecord>>>('editTemplate');

  protected readonly editGuard: ModalGuard = () => {
    if (!this.isDirty()) return true;
    this.toast.show({
      message: this.i18n.translate('showcase.modal.unsaved'),
      kind: 'warning',
      dedupeKey: 'modal-unsaved-changes',
      duration: 0,
    });
    return false;
  };

  protected openDetails(): void {
    this.modal.openModal<PackageRecord, boolean>(this.detailsTemplate(), {
      data: { name: '@rivinia/select' },
      ref: 'package-details',
      size: 'lg',
      metadata: { title: this.i18n.translate('showcase.modal.detailsTitle') },
    });
  }

  protected openWorkflow(currentModalId: string, record: PackageRecord): void {
    this.modal.close(currentModalId);
    this.modal.openModal<PackageRecord, boolean>(this.workflowTemplate(), {
      data: record,
      ref: 'package-workflow',
      size: 'md',
      metadata: { title: this.i18n.translate('showcase.modal.workflowTitle') },
    });
  }

  protected openDeleteConfirmation(currentModalId: string, record: PackageRecord): void {
    this.modal.close(currentModalId);
    this.modal.openModal<PackageRecord, boolean>(this.deleteTemplate(), {
      data: record,
      ref: 'package-delete-confirmation',
      size: 'sm',
      dismiss: { backdrop: 'static' },
      metadata: { title: this.i18n.translate('showcase.modal.deleteTitle') },
    });
  }

  protected confirmDelete(id: string, record: PackageRecord): void {
    this.deleteResult.set(record.name);
    this.modal.close(id, true);
    this.toast.show({
      message: this.i18n.translate('showcase.modal.deleted', { name: record.name }),
      kind: 'success',
      dedupeKey: 'modal-delete-result',
    });
  }

  protected openEdit(): void {
    this.editDraft.set('Rivinia Select');
    this.originalDraft.set('Rivinia Select');
    this.isDirty.set(false);
    this.modal.openModal<PackageRecord, boolean>(this.editTemplate(), {
      data: { name: '@rivinia/select' },
      ref: 'package-edit',
      size: 'lg',
      coversOthers: true,
      guards: [this.editGuard],
      metadata: { title: this.i18n.translate('showcase.modal.editTitle') },
    });
  }

  protected updateDraft(event: Event): void {
    const input = event.currentTarget;
    if (!(input instanceof HTMLInputElement)) return;
    this.editDraft.set(input.value);
    this.isDirty.set(input.value !== this.originalDraft());
  }

  protected saveEdit(id: string): void {
    this.originalDraft.set(this.editDraft());
    this.isDirty.set(false);
    this.modal.close(id, true);
    this.toast.show({
      message: this.i18n.translate('showcase.modal.saved', { name: this.editDraft() }),
      kind: 'success',
      dedupeKey: 'modal-edit-result',
    });
  }

  protected requestDismiss(id: string): void {
    void this.modal.requestDismiss(id, 'button');
  }

  protected dismissToast(toast: Toast): void {
    this.toast.dismiss(toast.id);
  }

  protected toastText(value: Toast['message']): string {
    return typeof value === 'string' ? value : value();
  }
}
