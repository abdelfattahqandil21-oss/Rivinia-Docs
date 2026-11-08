import { posix } from 'node:path';
import { docsLink } from '../../src/app/features/docs/shared/docs-link.ts';

export function rewriteLink(href, context, registry) {
  const [withoutHash, anchor] = href.split('#');
  if (!withoutHash)
    return { href: `${context.route}${anchor ? `#${anchor}` : ''}`, external: false };
  let target;
  const readme = withoutHash.match(/(?:projects\/)([\w-]+)\/README\.md$/);
  const github = withoutHash.match(
    /^https:\/\/github\.com\/[^/]+\/Rivinia\/blob\/(?:[^/]+\/v[^/]+|[^/]+)\/docs\/([\w-]+)\/([^?#]+\.md)$/,
  );
  if (readme) target = `${readme[1]}/README.md`;
  else if (github) target = `${github[1]}/docs/${github[2]}`;
  else if (/^(https?:|mailto:)/.test(withoutHash))
    return { href: href.replace(/^http:/, 'https:'), external: true };
  else if (/^\.\.\/[\w-]+\/[^/]+\.md$/.test(withoutHash)) {
    const [, pkg, file] = withoutHash.split('/');
    target = `${pkg}/docs/${file}`;
  } else if (withoutHash.endsWith('.md')) {
    const resolved = posix.normalize(posix.join(posix.dirname(context.file), withoutHash));
    target = resolved;
  }
  if (!target || !registry[target]) throw new Error(`${context.file}: unresolved link ${href}`);
  const mapped = registry[target];
  const split = anchor && mapped.anchors?.[anchor];
  return {
    href: `${split?.route ?? mapped.route}${anchor ? `#${split?.id ?? anchor}` : ''}`,
    external: false,
  };
}
export function topicRoute(pkg, slug) {
  return docsLink(pkg, 'guides', slug);
}
