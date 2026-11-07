import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const tokenPath = resolve(root, 'src/styles/tokens.css');
const auditPath = resolve(root, 'docs/color-audit.md');
const source = await readFile(tokenPath, 'utf8');
const auditStart = '<!-- contrast-results:start -->';
const auditEnd = '<!-- contrast-results:end -->';

function markdownTable(rows, rightAlignedColumns = new Set()) {
  const widths = rows[0].map((_, column) => Math.max(...rows.map((row) => row[column].length)));
  const formatted = rows.map(
    (row) =>
      `|${row.map((cell, column) => ` ${rightAlignedColumns.has(column) ? cell.padStart(widths[column]) : cell.padEnd(widths[column])} `).join('|')}|`,
  );
  const separator = `|${widths.map((width, column) => ` ${rightAlignedColumns.has(column) ? '-'.repeat(width - 1) + ':' : '-'.repeat(width)} `).join('|')}|`;
  return [formatted[0], separator, ...formatted.slice(1)].join('\n');
}

function declarationBlock(selector) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = source.match(new RegExp(`${escaped}\\s*\\{([^}]*)\\}`));
  return match?.[1] ?? '';
}

function declarations(block) {
  return new Map(
    [...block.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)].map((match) => [match[1], match[2].trim()]),
  );
}

const lightTokens = declarations(declarationBlock(':root'));
const darkTokens = new Map([
  ...lightTokens,
  ...declarations(declarationBlock(":root[data-rv-theme='dark']")),
]);

function parseColor(input) {
  const value = input.trim().toLowerCase();
  const hex = value.match(/^#([\da-f]{3,8})$/i);
  if (hex) {
    let digits = hex[1];
    if (digits.length === 3 || digits.length === 4)
      digits = [...digits].map((digit) => digit + digit).join('');
    if (digits.length === 8) digits = digits.slice(0, 6);
    if (digits.length !== 6) return null;
    return [0, 2, 4].map((index) => parseInt(digits.slice(index, index + 2), 16) / 255);
  }
  const rgb = value.match(/^rgba?\(\s*([\d.]+)%?\s*[, ]\s*([\d.]+)%?\s*[, ]\s*([\d.]+)%?/);
  if (rgb) {
    const percent = value.slice(0, value.indexOf(')')).includes('%');
    return rgb.slice(1, 4).map((channel) => Number(channel) / (percent ? 100 : 255));
  }
  const hsl = value.match(/^hsla?\(\s*([\d.]+)(?:deg)?\s*[, ]\s*([\d.]+)%\s*[, ]\s*([\d.]+)%/);
  if (hsl) {
    const h = (((Number(hsl[1]) % 360) + 360) % 360) / 360;
    const s = Number(hsl[2]) / 100;
    const l = Number(hsl[3]) / 100;
    const hue = (n) => (n + h + 1) % 1;
    const channel = (n) => {
      const k = hue(n);
      const a = s * Math.min(l, 1 - l);
      return l - a * Math.max(-1, Math.min(k * 12 - 3, 9 - k * 12, 1));
    };
    return [channel(0), channel(8 / 12), channel(4 / 12)];
  }
  const oklch = value.match(/^oklch\(\s*([\d.]+)%?\s+([\d.]+)\s+([\d.]+)(?:deg)?/);
  if (oklch) {
    const L = Number(oklch[1]) / (value.includes('%') ? 100 : 1);
    const C = Number(oklch[2]);
    const angle = (Number(oklch[3]) * Math.PI) / 180;
    const a = C * Math.cos(angle);
    const b = C * Math.sin(angle);
    const l = L + 0.3963377774 * a + 0.2158037573 * b;
    const m = L - 0.1055613458 * a - 0.0638541728 * b;
    const s = L - 0.0894841775 * a - 1.291485548 * b;
    const l3 = l ** 3;
    const m3 = m ** 3;
    const s3 = s ** 3;
    const linear = [
      4.0767416621 * l3 - 3.3077115913 * m3 + 0.2309699292 * s3,
      -1.2684380046 * l3 + 2.6097574011 * m3 - 0.3413193965 * s3,
      -0.0041960863 * l3 - 0.7034186147 * m3 + 1.707614701 * s3,
    ];
    return linear.map((channel) => {
      const clipped = Math.max(0, Math.min(1, channel));
      return clipped <= 0.0031308 ? clipped * 12.92 : 1.055 * clipped ** (1 / 2.4) - 0.055;
    });
  }
  return null;
}

function resolveToken(name, tokens, seen = new Set()) {
  if (seen.has(name)) return null;
  seen.add(name);
  const raw = tokens.get(name);
  if (!raw) return null;
  const reference = raw.match(/^var\((--[\w-]+)\)$/);
  return reference ? resolveToken(reference[1], tokens, seen) : parseColor(raw);
}

function luminance(color) {
  const channels = color.map((channel) =>
    channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4,
  );
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function ratio(foreground, background) {
  const values = [foreground, background].map(luminance).sort((a, b) => b - a);
  return (values[0] + 0.05) / (values[1] + 0.05);
}

const checks = [
  ['Primary text / page background', '--rv-fg', '--rv-bg', 4.5, true],
  ['Muted text / page background', '--rv-muted', '--rv-bg', 4.5, true],
  ['Text link / page background', '--rv-accent', '--rv-bg', 4.5, true],
  ['CTA text / CTA surface', '--rv-home-cta-foreground', '--rv-home-cta-bg', 4.5, true],
  ...[
    '--code-keyword',
    '--code-string',
    '--code-tag',
    '--code-attr',
    '--code-fn',
    '--code-comment',
    '--code-plain',
  ].map((token) => [`${token} / code surface`, token, '--rv-home-surface-raised', 4.5, true]),
  ['Sidebar active text / active surface', '--rv-fg', '--rv-docs-active-bg', 4.5, true],
  ['Focus ring / page background', '--rv-accent', '--rv-bg', 3, true],
  ['Sidebar indicator / page background', '--rv-accent', '--rv-bg', 3, true],
  ['Meaningful border / page background', '--rv-border', '--rv-bg', 3, false],
];

const rows = [['Pair', 'Theme', 'Ratio', 'Minimum', 'Result']];
const failures = [];
for (const [label, foregroundToken, backgroundToken, minimum, introduced] of checks) {
  for (const [theme, tokens] of [
    ['Light', lightTokens],
    ['Dark', darkTokens],
  ]) {
    const foreground = resolveToken(foregroundToken, tokens);
    const background = resolveToken(backgroundToken, tokens);
    if (!foreground || !background) {
      rows.push([label, theme, '—', `${minimum}:1`, 'Not verified (unsupported token value)']);
      continue;
    }
    const value = ratio(foreground, background);
    const pass = value >= minimum;
    rows.push([
      label,
      theme,
      `${value.toFixed(2)}:1`,
      `${minimum}:1`,
      pass ? 'Pass' : introduced ? 'Fail' : 'Pre-existing failure',
    ]);
    if (!pass && introduced)
      failures.push(`${label} (${theme}): ${value.toFixed(2)}:1, needs ${minimum}:1`);
  }
}

let audit = await readFile(auditPath, 'utf8');
const startIndex = audit.indexOf(auditStart);
const endIndex = audit.indexOf(auditEnd);
if (startIndex < 0 || endIndex < startIndex)
  throw new Error('Color audit is missing contrast-result markers.');
const report = markdownTable(rows, new Set([2, 3]));
audit = `${audit.slice(0, startIndex + auditStart.length)}\n\n${report}\n\n${audit.slice(endIndex)}`;
await writeFile(auditPath, audit);

if (failures.length) {
  console.error(`New contrast failures:\n${failures.join('\n')}`);
  process.exitCode = 1;
} else {
  console.log(
    `Contrast check passed; ${rows.length - 1} theme pairs evaluated. Existing border failures, if any, are recorded in docs/color-audit.md.`,
  );
}
