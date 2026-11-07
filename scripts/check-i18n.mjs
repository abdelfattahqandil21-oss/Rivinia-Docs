import { readFile, readdir } from 'node:fs/promises';
import { extname, relative, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const appRoot = resolve(root, 'src/app');
const localePaths = ['public/i18n/en.json', 'public/i18n/ar.json'];
const sourceExtensions = new Set(['.html', '.ts']);
const locales = new Map();

async function collectSources(folder) {
  const entries = await readdir(folder, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const path = resolve(folder, entry.name);
    if (entry.isDirectory()) files.push(...(await collectSources(path)));
    else if (sourceExtensions.has(extname(entry.name)) && !path.includes('/generated/'))
      files.push(path);
  }
  return files;
}

for (const path of localePaths) {
  const locale = JSON.parse(await readFile(resolve(root, path), 'utf8'));
  locales.set(path, new Set(Object.keys(locale)));
}

const [englishPath, arabicPath] = localePaths;
const englishKeys = locales.get(englishPath);
const arabicKeys = locales.get(arabicPath);
const localeMismatches = [
  ...[...englishKeys]
    .filter((key) => !arabicKeys.has(key))
    .map((key) => `${arabicPath}: missing key ${key}`),
  ...[...arabicKeys]
    .filter((key) => !englishKeys.has(key))
    .map((key) => `${englishPath}: missing key ${key}`),
];
const missingUsages = [];

function checkUsage(path, source, index, key) {
  const line = source.slice(0, index).split('\n').length;
  for (const [localePath, keys] of locales) {
    if (!keys.has(key))
      missingUsages.push(`${relative(root, path)}:${line}: ${localePath} is missing ${key}`);
  }
}

for (const path of await collectSources(appRoot)) {
  const source = await readFile(path, 'utf8');
  if (path.endsWith('.html')) {
    const expressions = /\{\{([\s\S]*?)\}\}|(?:\[[^\]]+\]|[\w:.-]+)\s*=\s*"([^"]*)"/g;
    for (const expression of source.matchAll(expressions)) {
      const text = expression[1] ?? expression[2];
      if (!text.includes('rvTranslate') || text.includes('+')) continue;
      for (const literalKey of text.matchAll(/(['"])([\w-]+(?:\.[\w-]+)+)\1/g)) {
        checkUsage(path, source, expression.index + literalKey.index, literalKey[2]);
      }
    }
  }
  const calls = /\b(?:translate|t)\s*\(\s*(['"])([\w.-]+)\1\s*[,)]/g;
  for (const match of source.matchAll(calls)) checkUsage(path, source, match.index, match[2]);
}

const errors = [...localeMismatches, ...missingUsages];
if (errors.length) {
  console.error(`i18n check failed (${errors.length} issue(s)):\n${errors.join('\n')}`);
  process.exitCode = 1;
} else {
  console.log(
    `i18n check passed (${englishKeys.size} matching keys across en/ar; all literal app usages resolve).`,
  );
}
