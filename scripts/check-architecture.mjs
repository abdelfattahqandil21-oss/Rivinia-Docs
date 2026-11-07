import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const srcRoot = path.join(root, 'src');
const appRoot = path.join(root, 'src/app');
const layerOrder = ['core', 'shared', 'layout', 'features', 'pages', 'app'];

const TEMPORARY_ALLOWLIST = [];

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
      const showcaseSource = file.startsWith('src/app/features/showcase/');
      const packageMetadataAdapter =
        targetRelative === 'src/generated/package-meta.generated.ts' &&
        file === 'src/app/features/packages/package-metadata.ts';
      if (!showcaseSource && !packageMetadataAdapter) {
        report(
          'generated-import-boundary',
          filePath,
          entry.line,
          'generated demo sources may only be imported from features/showcase; package metadata may only be imported by features/packages/package-metadata.ts',
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

for (const filePath of walk(appRoot).filter((file) => file.endsWith('.html'))) {
  const file = relative(filePath);
  if (file === 'src/app/app.html') continue;
  const source = readFileSync(filePath, 'utf8');
  for (const match of source.matchAll(/<\/?main\b/gi)) {
    const line = source.slice(0, match.index).split(/\r?\n/).length;
    report(
      'nested-main-landmark',
      filePath,
      line,
      'only src/app/app.html may render the main landmark',
    );
  }
}

const homeShowcaseStyles = walk(appRoot).filter((filePath) => {
  if (!filePath.endsWith('.css')) return false;
  const file = relative(filePath);
  return file.startsWith('src/app/pages/home/') || file.startsWith('src/app/features/showcase/');
});
homeShowcaseStyles.push(path.join(root, 'src/styles.css'));

for (const filePath of homeShowcaseStyles) {
  const file = relative(filePath);
  const source = readFileSync(filePath, 'utf8').replace(/\/\*[\s\S]*?\*\//g, (comment) =>
    comment.replace(/[^\n]/g, ' '),
  );
  const blocks = /([^{}]+)\{([^{}]*)\}/g;
  for (const block of source.matchAll(blocks)) {
    const selector = block[1].trim();
    if (
      file === 'src/styles.css' &&
      !/(?:\.home-page|\.home-section|\.interactive-showcase|\.showcase-shell|\.example-tabs|\.showcase-workspace)/.test(
        selector,
      )
    ) {
      continue;
    }
    const declarations = block[2];
    const declarationPattern = /^\s*overflow(?:-y)?\s*:\s*(?:auto|scroll)\b/gim;
    for (const declaration of declarations.matchAll(declarationPattern)) {
      const listboxException =
        file === 'src/app/features/showcase/demos/select/select-example.component.css' &&
        selector === '.headless-options';
      if (listboxException) continue;
      const offset = (block.index ?? 0) + block[0].indexOf(declarations) + (declaration.index ?? 0);
      const line = source.slice(0, offset).split(/\r?\n/).length;
      report(
        'home-showcase-scroll',
        filePath,
        line,
        'nested scrolling is reserved for the Select .headless-options listbox',
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
  if (!relative(filePath).startsWith('src/generated/')) {
    report(
      'generated-location',
      filePath,
      1,
      'generated showcase files must live under src/generated/',
    );
  }
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
