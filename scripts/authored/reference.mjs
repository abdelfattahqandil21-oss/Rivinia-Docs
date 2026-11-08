import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export async function auditImports(code, root, file) {
  for (const match of code.matchAll(
    /import\s+(?:type\s+)?\{([^}]+)\}\s+from\s+['"](@rivinia\/[^'"]+)['"]/g,
  )) {
    const [, names, specifier] = match;
    const [, pkg, ...parts] = specifier.split('/');
    const folder = join(root, 'node_modules/@rivinia', pkg);
    const manifest = JSON.parse(await readFile(join(folder, 'package.json'), 'utf8'));
    const entry = manifest.exports[parts.length ? `./${parts.join('/')}` : '.'];
    if (!entry?.types) throw new Error(`${file}: unknown typed entry point ${specifier}`);
    const declarations = await readFile(join(folder, entry.types), 'utf8');
    const exports = new Set(
      [
        ...declarations.matchAll(
          /export\s+(?:declare\s+)?(?:abstract\s+)?(?:class|function|const|interface|type|enum|let|var)\s+([\w$]+)/g,
        ),
      ].map((item) => item[1]),
    );
    for (const group of declarations.matchAll(/export\s+(?:type\s+)?\{([^}]*)\}/g))
      for (const name of group[1].split(',')) {
        const found = /([\w$]+)\s*$/.exec(name.trim());
        if (found) exports.add(found[1]);
      }
    for (const value of names.split(',')) {
      const name = value
        .trim()
        .replace(/^type\s+/, '')
        .split(/\s+as\s+/)[0];
      if (name && !exports.has(name))
        throw new Error(`${file}: ${name} is not exported by ${specifier}`);
    }
  }
}
export async function tokenRows(root) {
  const css = await readFile(join(root, 'node_modules/@rivinia/theme/styles/theme.css'), 'utf8');
  const rules = css.slice(css.indexOf('@layer rivinia-theme'));
  const values = (text) =>
    Object.fromEntries(
      [...text.matchAll(/(--rv-[\w-]+):\s*([^;]+);/g)].map((match) => [match[1], match[2].trim()]),
    );
  const light = values(rules.slice(0, rules.indexOf('@media')));
  const dark = {
    ...light,
    ...values(rules.slice(rules.indexOf('@media'), rules.indexOf(":root[data-rv-theme='dark']"))),
  };
  return Object.entries(light).map(([name, value]) => ({ name, light: value, dark: dark[name] }));
}
