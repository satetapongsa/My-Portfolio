/**
 * Generates web-optimized WebP derivatives. Originals are never modified.
 *
 *   npm run images
 *
 * - Certificates: public/assets/legacy/certificates/* (originals, kept for
 *   download / full-size view) → public/assets/optimized/certificates/
 *   <slug>-640.webp (grid thumbnail) and <slug>-1600.webp (viewer preview).
 * - Project screenshots: public/assets/projects/<id>/*.png → <name>-720.webp
 *   (card) and <name>-1440.webp (detail view). Re-run after adding screenshots.
 */
import { mkdir, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve(import.meta.dirname, '..', 'public', 'assets');

const slug = (name) =>
  name
    .replace(/\.[^.]+$/, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

async function derive(src, outDir, base, widths, quality) {
  await mkdir(outDir, { recursive: true });
  const results = [];
  for (const width of widths) {
    const out = path.join(outDir, `${base}-${width}.webp`);
    await sharp(src).resize({ width, withoutEnlargement: true }).webp({ quality, effort: 5 }).toFile(out);
    results.push([path.relative(root, out), (await stat(out)).size]);
  }
  return results;
}

const certDir = path.join(root, 'legacy', 'certificates');
for (const file of await readdir(certDir)) {
  if (!/\.(png|jpe?g)$/i.test(file)) continue;
  const res = await derive(path.join(certDir, file), path.join(root, 'optimized', 'certificates'), slug(file), [640, 1600], 80);
  console.log(file, '→', res.map(([p, s]) => `${path.basename(p)} ${(s / 1024).toFixed(0)}KB`).join(', '));
}

const projectsDir = path.join(root, 'projects');
for (const id of await readdir(projectsDir)) {
  const dir = path.join(projectsDir, id);
  for (const file of await readdir(dir)) {
    if (!/\.(png|jpe?g)$/i.test(file)) continue;
    const res = await derive(path.join(dir, file), dir, slug(file), [720, 1440], 82);
    console.log(`${id}/${file}`, '→', res.map(([p, s]) => `${path.basename(p)} ${(s / 1024).toFixed(0)}KB`).join(', '));
  }
}
