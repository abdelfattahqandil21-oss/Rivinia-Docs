import { Component, input } from '@angular/core';

export type PillarId = 'simplicity' | 'flexibility' | 'performance' | 'accessibility';

@Component({
  selector: 'app-principles-diagram',
  templateUrl: './principles-diagram.component.html',
  styleUrl: './principles-diagram.component.css',
})
export class PrinciplesDiagramComponent {
  readonly activePillar = input<PillarId | null>(null);
  readonly coreLabel = input('Developer experience');
}
