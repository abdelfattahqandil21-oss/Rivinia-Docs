export const GETTING_STARTED_PAGES = [
  {
    slug: 'choose-the-package-for-your-task',
    titleKey: 'docs.startTitle',
    textKey: 'docs.startText',
    actionKey: 'docs.browsePackages',
    actionHref: '/components',
  },
  {
    slug: 'install-a-package',
    titleKey: 'docs.installTitle',
    textKey: 'docs.installText',
    followupKey: 'docs.installFollowup',
  },
  {
    slug: 'go-directly-to-the-area-you-need',
    titleKey: 'docs.continueTitle',
    cards: [
      { titleKey: 'nav.components', textKey: 'docs.componentsText', href: '/components' },
      { titleKey: 'nav.playground', textKey: 'docs.playgroundText', href: '/playground' },
    ],
  },
] as const;
