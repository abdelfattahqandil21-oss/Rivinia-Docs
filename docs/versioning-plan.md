# Documentation versioning plan

The unprefixed `/docs` routes always describe the latest published package metadata.

When an older major version is documented, place it under `/docs/v<major>/`. Show a banner on those pages with the localized message “You are viewing v<major> docs. Go to latest” and a link to the corresponding unprefixed page. Add a version selector only after more than one documented version exists. The current Docs IA does not implement version routing, banners, or selectors.
