import { Service, signal } from '@angular/core';

import { COMPONENT_PACKAGES, type ComponentPackage } from '../models/component-package.model';

@Service()
export class ComponentPackagesService {
  private readonly state = signal<readonly ComponentPackage[]>(COMPONENT_PACKAGES);

  readonly packages = this.state.asReadonly();
}
