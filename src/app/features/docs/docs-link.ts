export function docsLink(...segments: readonly string[]): string {
  const path = segments.map((segment) => encodeURIComponent(segment.trim())).filter(Boolean);
  return path.length === 0 ? '/docs' : `/docs/${path.join('/')}`;
}
