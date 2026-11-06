import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { RiviniaI18n } from '@rivinia/i18n';

import { ProgressBarService } from './layout/progress-bar/progress-bar.service';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { ProgressBarComponent } from './layout/progress-bar/progress-bar.component';
import { ProgressBarDirective } from './layout/progress-bar/progress-bar.directive';

@Component({
  imports: [RouterOutlet, NavbarComponent, ProgressBarComponent, ProgressBarDirective],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  private readonly i18n = inject<RiviniaI18n<'ar' | 'en'>>(RiviniaI18n);
  private readonly progressBar = inject(ProgressBarService);

  protected readonly skipLabel = this.i18n.t('nav.skipToContent');
  protected readonly loadingLabel = this.i18n.t('common.loading');

  protected readonly progressValue = this.progressBar.value;
  protected readonly progressVisible = this.progressBar.visible;
}
