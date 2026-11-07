import { ComponentFixture, TestBed } from '@angular/core/testing';
import { customLoader, provideRiviniaI18n } from '@rivinia/i18n';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { CopyButtonComponent } from './copy-button.component';

const translations = {
  'common.copyCodeLabel': 'Copy code',
  'common.copyCodeSuccess': 'Code copied',
  'common.copyCodeError': 'Could not copy code',
};

describe('CopyButtonComponent', () => {
  let fixture: ComponentFixture<CopyButtonComponent>;
  let clipboardDescriptor: PropertyDescriptor | undefined;
  let execCommandDescriptor: PropertyDescriptor | undefined;

  beforeEach(async () => {
    clipboardDescriptor = Object.getOwnPropertyDescriptor(navigator, 'clipboard');
    execCommandDescriptor = Object.getOwnPropertyDescriptor(document, 'execCommand');
    await TestBed.configureTestingModule({
      imports: [CopyButtonComponent],
      providers: [
        provideRiviniaI18n({
          defaultLanguage: 'en',
          languages: [{ id: 'en', nativeName: 'English', dir: 'ltr' }],
          loader: customLoader(async () => translations),
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CopyButtonComponent);
    fixture.componentRef.setInput('code', 'npm i @rivinia/select');
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture?.destroy();
    if (clipboardDescriptor) {
      Object.defineProperty(navigator, 'clipboard', clipboardDescriptor);
    } else {
      Reflect.deleteProperty(navigator, 'clipboard');
    }
    if (execCommandDescriptor) {
      Object.defineProperty(document, 'execCommand', execCommandDescriptor);
    } else {
      Reflect.deleteProperty(document, 'execCommand');
    }
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('keeps a stable accessible name and announces success for two seconds', async () => {
    vi.useFakeTimers();
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: vi.fn().mockResolvedValue(undefined) },
    });

    fixture.nativeElement.querySelector('button').click();
    await Promise.resolve();
    await Promise.resolve();
    await Promise.resolve();
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(button.getAttribute('aria-label')).toBe('Copy code');
    expect(button.dataset['state']).toBe('copied');
    expect(button.querySelector('[aria-live]')?.textContent).toContain('Code copied');

    await vi.advanceTimersByTimeAsync(2000);
    fixture.detectChanges();
    expect(button.dataset['state']).toBe('idle');
  });

  it('falls back to a temporary textarea when the clipboard write is rejected', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: vi.fn().mockRejectedValue(new Error('permission denied')) },
    });
    const execCommand = vi.fn().mockReturnValue(true);
    Object.defineProperty(document, 'execCommand', {
      configurable: true,
      value: execCommand,
    });

    fixture.nativeElement.querySelector('button').click();
    await Promise.resolve();
    await Promise.resolve();
    await Promise.resolve();
    fixture.detectChanges();

    expect(execCommand).toHaveBeenCalledWith('copy');
    expect(document.querySelector('textarea')).toBeNull();
    expect(fixture.nativeElement.querySelector('button').dataset['state']).toBe('copied');
  });

  it('reports failure when the clipboard does not settle within 2500ms', async () => {
    vi.useFakeTimers();
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: vi.fn(() => new Promise<void>(() => undefined)) },
    });

    fixture.nativeElement.querySelector('button').click();
    await vi.advanceTimersByTimeAsync(2500);
    await Promise.resolve();
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    expect(button.dataset['state']).toBe('failed');
    expect(button.querySelector('[aria-live]')?.textContent).toContain('Could not copy code');
  });

  it('clears pending timers when the component is destroyed', async () => {
    vi.useFakeTimers();
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: vi.fn().mockResolvedValue(undefined) },
    });
    const clearTimeout = vi.spyOn(window, 'clearTimeout');

    fixture.nativeElement.querySelector('button').click();
    await Promise.resolve();
    fixture.detectChanges();
    fixture.destroy();

    expect(clearTimeout).toHaveBeenCalled();
  });
});
