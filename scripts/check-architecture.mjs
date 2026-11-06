import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const srcRoot = path.join(root, 'src');
const appRoot = path.join(root, 'src/app');
const layerOrder = ['core', 'shared', 'layout', 'features', 'pages', 'app'];

// Temporary exceptions are tied to approved Phase 2 steps. Remove each entry
// when its migration step lands; this list must be empty at the end of Phase 2.
// TODO Phase 2 Step 1: co-locate each demo's templates/styles and table spec.
// TODO Phase 2 Step 3: move generated output to src/generated and ignore it.
const TEMPORARY_ALLOWLIST = [
  {
    rule: 'component-asset-path',
    files: [
      'src/app/pages/home/showcase/examples/components/datepicker-example.component.ts',
      'src/app/pages/home/showcase/examples/components/modal-example.component.ts',
      'src/app/pages/home/showcase/examples/components/select-example.component.ts',
      'src/app/pages/home/showcase/examples/components/table-example.component.ts',
      'src/app/pages/home/showcase/examples/components/toast-example.component.ts',
    ],
    step: 'Phase 2 Step 1',
    reason: 'demo assets will become sibling files',
  },
  {
    rule: 'tests-directory',
    files: ['src/app/pages/home/showcase/examples/tests'],
    step: 'Phase 2 Step 1',
    reason: 'the table spec will be co-located with its demo',
  },
  {
    rule: 'generated-location',
    files: [
      'src/app/pages/home/showcase/examples/generated/datepicker-example.source.generated.ts',
      'src/app/pages/home/showcase/examples/generated/modal-example.source.generated.ts',
      'src/app/pages/home/showcase/examples/generated/select-example.source.generated.ts',
      'src/app/pages/home/showcase/examples/generated/table-example.source.generated.ts',
      'src/app/pages/home/showcase/examples/generated/toast-example.source.generated.ts',
    ],
    step: 'Phase 2 Step 3',
    reason: 'generated showcase output will move to src/generated',
  },
  {
    rule: 'generated-ignore',
    files: ['.gitignore'],
    step: 'Phase 2 Step 3',
    reason: 'src/generated will be added to Git ignore rules',
  },
];

function walk(directory) {
  if (!existsSync(directory)) return [];
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(directory, entry.name);
    return entry.isDirectory() ? walk(fullPath) : [fullPath];
  });
}

function walkDirectories(directory) {
  if (!existsSync(directory)) return [];
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    if (!entry.isDirectory()) return [];
    const fullPath = path.join(directory, entry.name);
    return [fullPath, ...walkDirectories(fullPath)];
  });
}

function relative(filePath) {
  return path.relative(root, filePath).split(path.sep).join('/');
}

function isAllowed(rule, filePath) {
  const file = relative(filePath);
  return TEMPORARY_ALLOWLIST.find((item) => item.rule === rule && item.files.includes(file));
}

function layerFor(filePath) {
  const relativeToApp = path.relative(appRoot, filePath).split(path.sep);
  // Root files are app composition roots and may depend on any application layer.
  if (relativeToApp.length === 1) return 'app';
  const first = relativeToApp[0];
  return layerOrder.includes(first) ? first : 'app';
}

function resolveImport(importer, specifier) {
  if (!specifier.startsWith('.')) return null;
  const base = path.resolve(path.dirname(importer), specifier);
  const candidates = [base, `${base}.ts`, path.join(base, 'index.ts')];
  return candidates.find((candidate) => existsSync(candidate)) ?? base;
}

function staticImportStatements(source) {
  const statements = [];
  const lines = source.split(/\r?\n/);
  for (let index = 0; index < lines.length; index += 1) {
    if (!/^\s*(?:import|export)\b/.test(lines[index])) continue;
    const start = index;
    let statement = lines[index];
    while (!statement.includes(';') && index + 1 < lines.length) {
      index += 1;
      statement += `\n${lines[index]}`;
    }
    const from = /\bfrom\s*['"]([^'"]+)['"]/.exec(statement);
    const sideEffect = /^\s*import\s*['"]([^'"]+)['"]/.exec(statement);
    const specifier = from?.[1] ?? sideEffect?.[1];
    if (specifier) statements.push({ line: start + 1, specifier });
  }
  return statements;
}

function dynamicImportStatements(source) {
  const statements = [];
  const lines = source.split(/\r?\n/);
  lines.forEach((line, index) => {
    for (const match of line.matchAll(/\bimport\s*\(\s*['"]([^'"]+)['"]\s*\)/g)) {
      statements.push({ line: index + 1, specifier: match[1] });
    }
  });
  return statements;
}

const errors = [];
const allowed = new Map();
function report(rule, filePath, line, message) {
  const item = isAllowed(rule, filePath);
  const location = `${relative(filePath)}:${line}`;
  if (item) {
    const key = `${rule}:${relative(filePath)}`;
    if (!allowed.has(key)) allowed.set(key, { location, ...item });
    return;
  }
  errors.push(`${location}: ${message}`);
}

for (const filePath of walk(appRoot).filter((file) => file.endsWith('.ts'))) {
  const file = relative(filePath);
  const source = readFileSync(filePath, 'utf8');

  if (!file.endsWith('.source.generated.ts')) {
    for (const match of source.matchAll(/\b(templateUrl|styleUrl)\s*:\s*['"]([^'"]+)['"]/g)) {
      if (match[2].includes('../')) {
        const line = source.slice(0, match.index).split(/\r?\n/).length;
        report(
          'component-asset-path',
          filePath,
          line,
          `${match[1]} must use a sibling './<name>.component.html|css' path`,
        );
      }
    }
  }

  const imports = [...staticImportStatements(source), ...dynamicImportStatements(source)];
  for (const entry of imports) {
    const target = resolveImport(filePath, entry.specifier);
    if (!target) continue;

    const targetRelative = path.relative(root, target).split(path.sep).join('/');
    if (targetRelative === 'src/generated' || targetRelative.startsWith('src/generated/')) {
      if (!file.startsWith('src/app/features/showcase/')) {
        report(
          'generated-import-boundary',
          filePath,
          entry.line,
          'src/generated may only be imported from features/showcase',
        );
      }
    }

    if (!target.startsWith(`${appRoot}${path.sep}`)) continue;
    const importerLayer = layerFor(filePath);
    const targetLayer = layerFor(target);
    if (layerOrder.indexOf(targetLayer) > layerOrder.indexOf(importerLayer)) {
      report(
        'layer-import',
        filePath,
        entry.line,
        `${importerLayer} may not import ${targetLayer}; import only the same or a leftward layer`,
      );
    }
  }
}

for (const directoryPath of walkDirectories(appRoot)) {
  if (path.basename(directoryPath) === 'tests') {
    report('tests-directory', directoryPath, 1, 'remove tests/; co-locate the spec');
  }
}

for (const filePath of walk(srcRoot).filter((file) => file.endsWith('.source.generated.ts'))) {
  report(
    'generated-location',
    filePath,
    1,
    'generated showcase files must live under src/generated/',
  );
}

const gitignorePath = path.join(root, '.gitignore');
const gitignore = readFileSync(gitignorePath, 'utf8');
if (!/^\s*\/?src\/generated\/?\s*(?:#.*)?$/m.test(gitignore)) {
  report('generated-ignore', gitignorePath, 1, 'add src/generated/ to .gitignore');
}

for (const item of allowed.values()) {
  console.warn(`TEMPORARY ALLOWLIST ${item.step}: ${item.location} — ${item.reason}`);
}

if (errors.length > 0) {
  console.error(errors.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`Architecture check passed (${allowed.size} temporary exception(s)).`);
}
