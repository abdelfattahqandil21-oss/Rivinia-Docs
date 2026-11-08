import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdir, mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const manifest = await readFile(
  join(root, 'src/app/features/packages/package-manifest.ts'),
  'utf8',
);
const packages = [...manifest.matchAll(/\bid:\s*'([^']+)'/g)].map((match) => match[1]);
const selected = process.argv.find((arg) => arg.startsWith('--package='))?.split('=')[1];
if (selected && !packages.includes(selected)) throw new Error(`Unknown package: ${selected}`);
const checking = process.argv.includes('--check');
const hash = (data) => createHash('sha256').update(data).digest('hex');

for (const id of packages.filter((id) => !selected || selected === id)) {
  const installed = join(root, 'node_modules/@rivinia', id);
  const pkg = JSON.parse(await readFile(join(installed, 'package.json'), 'utf8'));
  if (pkg.version !== '1.0.4')
    throw new Error(`${pkg.name}: expected installed 1.0.4, got ${pkg.version}`);
  const target = join(root, 'src/content/library', id, pkg.version);
  if (existsSync(join(target, 'SOURCE.json'))) {
    const source = JSON.parse(await readFile(join(target, 'SOURCE.json'), 'utf8'));
    if (!source.sha256 || source.package !== pkg.name || source.version !== pkg.version)
      throw new Error(`${target}: invalid SOURCE.json`);
    for (const [file, expected] of Object.entries(source.sha256)) {
      if (hash(await readFile(join(target, file))) !== expected)
        throw new Error(`${id}/${file}: snapshot hash mismatch`);
    }
    console.log(`${id}@${pkg.version}: immutable snapshot verified`);
    continue;
  }
  if (checking) throw new Error(`${id}: snapshot missing`);
  let temporary;
  try {
    let sourceRoot;
    let sourceUsed;
    const existing = (await readdir(root)).filter((name) =>
      name.startsWith(`library-docs-${pkg.version}`),
    );
    for (const name of existing.filter((name) => !name.endsWith('.zip'))) {
      const candidate = join(root, name, 'library', id, pkg.version);
      if (existsSync(join(candidate, 'SOURCE.json'))) {
        sourceRoot = candidate;
        sourceUsed = name;
        break;
      }
    }
    if (!sourceRoot && existsSync(join(root, `library-docs-${pkg.version}.zip`))) {
      temporary = await mkdtemp(join(tmpdir(), 'rivinia-snapshot-'));
      execFileSync('unzip', ['-q', join(root, `library-docs-${pkg.version}.zip`), '-d', temporary]);
      sourceRoot = join(temporary, 'library', id, pkg.version);
      sourceUsed = `library-docs-${pkg.version}.zip`;
    }
    let provenance;
    if (sourceRoot)
      provenance = JSON.parse(await readFile(join(sourceRoot, 'SOURCE.json'), 'utf8'));
    else {
      temporary = await mkdtemp(join(tmpdir(), 'rivinia-snapshot-'));
      execFileSync(
        'git',
        [
          'clone',
          '--depth',
          '1',
          '--branch',
          `${id}/v${pkg.version}`,
          'https://github.com/abdelfattahqandil21-oss/Rivinia.git',
          temporary,
        ],
        { stdio: 'pipe' },
      );
      sourceRoot = temporary;
      sourceUsed = `git tag ${id}/v${pkg.version}`;
      provenance = {
        commit: execFileSync('git', ['-C', temporary, 'rev-parse', 'HEAD'], {
          encoding: 'utf8',
        }).trim(),
      };
    }
    const docsPath = sourceUsed.startsWith('git tag')
      ? join(sourceRoot, 'docs', id)
      : join(sourceRoot, 'docs');
    const files = ['README.md', 'CHANGELOG.md'];
    const docs = existsSync(docsPath)
      ? (await readdir(docsPath)).filter((name) => name.endsWith('.md'))
      : [];
    await mkdir(join(target, 'docs'), { recursive: true });
    const sha256 = {};
    for (const file of [...files, ...docs.map((name) => `docs/${name}`)]) {
      const data = await readFile(
        files.includes(file) ? join(installed, file) : join(docsPath, file.slice(5)),
      );
      await writeFile(join(target, file), data);
      sha256[file] = hash(data);
    }
    await writeFile(
      join(target, 'SOURCE.json'),
      JSON.stringify(
        {
          package: pkg.name,
          version: pkg.version,
          tag: `${id}/v${pkg.version}`,
          commit: provenance.commit,
          source: sourceUsed,
          readmeSource: `node_modules/${pkg.name}`,
          date: new Date().toISOString(),
          sha256,
        },
        null,
        2,
      ) + '\n',
    );
    console.log(`${id}@${pkg.version}: captured ${Object.keys(sha256).length} files`);
  } finally {
    if (temporary) await rm(temporary, { recursive: true, force: true });
  }
}
