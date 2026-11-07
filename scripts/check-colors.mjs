import { readFile, readdir, writeFile } from 'node:fs/promises';
import { extname, relative, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const auditPath = resolve(root, 'docs/color-audit.md');
const supportedFiles = new Set(['.css', '.html', '.ts']);
const allowlisted = new Set([
  'src/styles/tokens.css',
  'src/app/shared/components/brand-mark/brand-mark.component.html',
]);
const namedColors =
  'aliceblue antiquewhite aqua aquamarine azure beige bisque blanchedalmond blue blueviolet brown burlywood cadetblue chartreuse chocolate coral cornflowerblue cornsilk crimson cyan darkblue darkcyan darkgoldenrod darkgray darkgreen darkgrey darkkhaki darkmagenta darkolivegreen darkorange darkorchid darkred darksalmon darkseagreen darkslateblue darkslategray darkslategrey darkturquoise darkviolet deeppink deepskyblue dimgray dimgrey dodgerblue firebrick floralwhite forestgreen fuchsia gainsboro ghostwhite gold goldenrod gray green greenyellow grey honeydew hotpink indianred indigo ivory khaki lavender lavenderblush lawngreen lemonchiffon lightblue lightcoral lightcyan lightgoldenrodyellow lightgray lightgreen lightgrey lightpink lightsalmon lightseagreen lightskyblue lightslategray lightslategrey lightsteelblue lightyellow lime limegreen linen magenta maroon mediumaquamarine mediumblue mediumorchid mediumpurple mediumseagreen mediumslateblue mediumspringgreen mediumturquoise mediumvioletred midnightblue mintcream mistyrose moccasin navajowhite navy oldlace olive olivedrab orange orangered orchid palegoldenrod palegreen paleturquoise palevioletred papayawhip peachpuff peru pink plum powderblue purple rebeccapurple red rosybrown royalblue saddlebrown salmon sandybrown seagreen seashell sienna silver skyblue slateblue slategray slategrey snow springgreen steelblue tan teal thistle tomato turquoise violet wheat white whitesmoke yellow yellowgreen'.split(
    ' ',
  );
const colorPatterns = [
  /#[\da-f]{3,8}\b/gi,
  /\b(?:rgb|rgba|hsl|hsla|oklch)\s*\([^)]*\)/gi,
  new RegExp(`(?<![-\\w])(?:${namedColors.join('|')})(?![-\\w])`, 'gi'),
  /\b(?:bg|text|border|outline|ring|fill|stroke|decoration|from|via|to)-(?:white|black|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)(?:-(?:50|100|200|300|400|500|600|700|800|900|950))?\b/gi,
];

function markdownTable(rows, rightAlignedColumns = new Set()) {
  const widths = rows[0].map((_, column) => Math.max(...rows.map((row) => row[column].length)));
  const formatted = rows.map(
    (row) =>
      `|${row.map((cell, column) => ` ${rightAlignedColumns.has(column) ? cell.padStart(widths[column]) : cell.padEnd(widths[column])} `).join('|')}|`,
  );
  const separator = `|${widths.map((width, column) => ` ${rightAlignedColumns.has(column) ? '-'.repeat(width - 1) + ':' : '-'.repeat(width)} `).join('|')}|`;
  return [formatted[0], separator, ...formatted.slice(1)].join('\n');
}

async function collectFiles(folder) {
  const entries = await readdir(folder, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = resolve(folder, entry.name);
    if (entry.isDirectory()) files.push(...(await collectFiles(path)));
    else if (supportedFiles.has(extname(entry.name))) {
      files.push(path);
    }
  }
  return files;
}

function findLiterals(source) {
  const withoutComments = source
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .replace(/<!--(?:[\s\S]*?)-->/g, ' ')
    .replace(/(^|\s)\/\/[^\r\n]*/gm, '$1 ');
  const found = [];
  for (const pattern of colorPatterns) {
    for (const match of withoutComments.matchAll(pattern)) found.push(match[0]);
  }
  return found;
}

const files = [
  ...(await collectFiles(resolve(root, 'src/app'))),
  ...(await collectFiles(resolve(root, 'src/styles'))),
];
const counts = [];
const violations = [];
for (const file of files) {
  const path = relative(root, file);
  if (allowlisted.has(path)) continue;
  const literals = findLiterals(await readFile(file, 'utf8'));
  if (!literals.length) continue;
  counts.push({ path, count: literals.length, literals: [...new Set(literals)] });
  if (path.startsWith('src/app/features/docs/') || path.startsWith('src/app/pages/docs/')) {
    violations.push(`${path}: ${[...new Set(literals)].join(', ')}`);
  }
}

const start = '<!-- global-color-literal-counts:start -->';
const end = '<!-- global-color-literal-counts:end -->';
let audit = await readFile(auditPath, 'utf8');
const startIndex = audit.indexOf(start);
const endIndex = audit.indexOf(end);
if (startIndex < 0 || endIndex < startIndex) {
  throw new Error('Color audit is missing the global literal-count markers.');
}
const report = counts.length
  ? markdownTable(
      [
        ['Source file', 'Count', 'Distinct literals'],
        ...counts.map(({ path, count, literals }) => [
          `\`${path}\``,
          String(count),
          literals.map((value) => `\`${value}\``).join(', '),
        ]),
      ],
      new Set([1]),
    )
  : 'No color literals found outside the allowlist.';
audit = `${audit.slice(0, startIndex + start.length)}\n\n${report}\n\n${audit.slice(endIndex)}`;
await writeFile(auditPath, audit);

if (violations.length) {
  console.error(`Color literals found in Docs UI sources:\n${violations.join('\n')}`);
  process.exitCode = 1;
} else {
  console.log(
    `Color check passed; ${counts.reduce((sum, item) => sum + item.count, 0)} pre-existing literals reported in ${counts.length} non-token source files.`,
  );
}
