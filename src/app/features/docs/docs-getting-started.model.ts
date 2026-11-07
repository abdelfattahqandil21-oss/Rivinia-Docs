export const GETTING_STARTED_PAGES = [
  {
    slug: 'choose-the-package-for-your-task',
    titleKey: 'docs.startTitle',
    navTitleKey: 'docs.startNavTitle',
    textKey: 'docs.startText',
    actionKey: 'docs.browsePackages',
    actionHref: '/components',
  },
  {
    slug: 'install-a-package',
    titleKey: 'docs.installTitle',
    navTitleKey: 'docs.installNavTitle',
    textKey: 'docs.installText',
    followupKey: 'docs.installFollowup',
  },
  {
    slug: 'go-directly-to-the-area-you-need',
    titleKey: 'docs.continueTitle',
    navTitleKey: 'docs.continueNavTitle',
    cards: [
      { titleKey: 'nav.components', textKey: 'docs.componentsText', href: '/components' },
      { titleKey: 'nav.playground', textKey: 'docs.playgroundText', href: '/playground' },
    ],
  },
] as const;
