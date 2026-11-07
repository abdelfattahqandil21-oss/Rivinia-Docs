/**
 * Icon registry (shared/components/icon).
 *
 * WHAT: `iconLoaders` — kebab-case name → lazy Lucide component
 *   loader; `AppIconName` union of valid names.
 * WHO USES IT: `IconComponent` only.
 * WHEN/WHY: Adding an icon: 1) add loader here, 2) use
 *   `<app-icon name="...">` — nothing else reaches the bundle.
 *
 * @author Abdelfattah qandil
 */

import {
  LucideArrowRight,
  LucideChevronDown,
  LucideCode,
  LucideCheck,
  LucideMenu,
  LucideMoon,
  LucidePanelLeftClose,
  LucidePanelLeftOpen,
  LucideSettings,
  LucideSun,
  LucideX,
  LucideEye,
} from '@lucide/angular';

// Central icon registry. To use a new icon in templates:
// 1. import its Lucide* component above,
// 2. add it to appIcons below with its kebab-case lucide name,
// 3. use <app-icon name="..." /> anywhere (no other wiring needed).
// Only icons listed here reach the bundle (tree-shaken).
export const appIcons = {
  'arrow-right': LucideArrowRight,
  'chevron-down': LucideChevronDown,
  code: LucideCode,
  check: LucideCheck,
  eye: LucideEye,
  menu: LucideMenu,
  moon: LucideMoon,
  'panel-left-close': LucidePanelLeftClose,
  'panel-left-open': LucidePanelLeftOpen,
  settings: LucideSettings,
  sun: LucideSun,
  x: LucideX,
};

export type AppIconName = keyof typeof appIcons;
