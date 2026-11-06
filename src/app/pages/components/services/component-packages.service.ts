import { Service, signal } from '@angular/core';

import {
  COMPONENT_PAGE_PACKAGES,
  type ComponentPagePackage,
} from '../../../features/packages/package-manifest';

@Service()
export class ComponentPackagesService {
  private readonly state = signal<readonly ComponentPagePackage[]>(COMPONENT_PAGE_PACKAGES);

  readonly packages = this.state.asReadonly();
}
