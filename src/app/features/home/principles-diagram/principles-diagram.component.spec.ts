import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';

import { PrinciplesDiagramComponent } from './principles-diagram.component';

describe('PrinciplesDiagramComponent', () => {
  let fixture: ComponentFixture<PrinciplesDiagramComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrinciplesDiagramComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(PrinciplesDiagramComponent);
  });

  it('uses the four explicit brand petals and keeps the diagram hidden from assistive technology', () => {
    fixture.detectChanges();

    const svg = fixture.nativeElement.querySelector('svg') as SVGSVGElement;
    const petals = [...svg.querySelectorAll('[data-petal]')];

    expect(svg.getAttribute('viewBox')).toBe('130 130 940 940');
    expect(svg.getAttribute('aria-hidden')).toBe('true');
    expect(petals.map((petal) => petal.getAttribute('data-petal'))).toEqual([
      'simplicity',
      'flexibility',
      'performance',
      'accessibility',
    ]);
    expect(svg.querySelector('use')).toBeNull();
  });

  it('highlights only the selected pillar and renders the localized core label', () => {
    fixture.componentRef.setInput('activePillar', 'flexibility');
    fixture.componentRef.setInput('coreLabel', 'تجربة المطوّر');
    fixture.detectChanges();

    const active = fixture.nativeElement.querySelector('[data-petal="flexibility"]');
    expect(active.classList.contains('is-active')).toBe(true);
    expect(fixture.nativeElement.querySelector('.core-label').textContent).toContain(
      'تجربة المطوّر',
    );
  });
});
