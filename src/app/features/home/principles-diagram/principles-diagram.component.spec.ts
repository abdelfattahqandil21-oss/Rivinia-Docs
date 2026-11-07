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
    fixture.componentRef.setInput('labels', {
      simplicity: 'Simplicity',
      flexibility: 'Flexibility',
      performance: 'Performance',
      accessibility: 'Accessibility',
    });
  });

  it('exposes the four brand petals as labeled keyboard-focusable buttons', () => {
    fixture.detectChanges();

    const svg = fixture.nativeElement.querySelector('svg') as SVGSVGElement;
    const petals = [...svg.querySelectorAll('[data-petal]')];

    expect(svg.getAttribute('viewBox')).toBe('130 130 940 940');
    expect(svg.getAttribute('role')).toBe('group');
    expect(petals.map((petal) => petal.getAttribute('data-petal'))).toEqual([
      'simplicity',
      'flexibility',
      'performance',
      'accessibility',
    ]);
    expect(svg.querySelector('use')).toBeNull();
    expect(petals.every((petal) => petal.getAttribute('role') === 'button')).toBe(true);
    expect(petals.every((petal) => petal.getAttribute('tabindex') === '0')).toBe(true);
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

  it('emits a selected pillar on pointer and keyboard activation', () => {
    const selected: string[] = [];
    fixture.componentInstance.pillarSelect.subscribe((id) => selected.push(id));
    fixture.detectChanges();

    const flexibility = fixture.nativeElement.querySelector(
      '[data-petal="flexibility"]',
    ) as SVGGElement;
    flexibility.dispatchEvent(new MouseEvent('pointerenter', { bubbles: true }));
    flexibility.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));

    expect(selected).toEqual(['flexibility', 'flexibility']);
  });
});
