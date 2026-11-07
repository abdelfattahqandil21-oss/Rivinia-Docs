import { Component, input, output } from '@angular/core';

export type PillarId = 'simplicity' | 'flexibility' | 'performance' | 'accessibility';

@Component({
  selector: 'app-principles-diagram',
  templateUrl: './principles-diagram.component.html',
  styleUrl: './principles-diagram.component.css',
})
export class PrinciplesDiagramComponent {
  readonly activePillar = input<PillarId | null>(null);
  readonly coreLabel = input('Developer experience');
  readonly labels = input.required<Record<PillarId, string>>();
  readonly pillarSelect = output<PillarId>();

  protected selectPillar(id: PillarId): void {
    this.pillarSelect.emit(id);
  }

  protected activatePillar(event: KeyboardEvent, id: PillarId): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.selectPillar(id);
    }
  }
}
