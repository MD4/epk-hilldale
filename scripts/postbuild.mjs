// Runs after `astro build`. Publishes the original photos and logos as downloads
// and assembles the press kit ZIP. Reads only the two folders named below:
// nothing from resources/private can end up in dist/.
import { createWriteStream, cpSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { ZipArchive } from 'archiver';

const downloads = 'dist/downloads';
const zipPath = join(downloads, 'hilldale-presskit.zip');

for (const folder of ['photos', 'logos']) {
  cpSync(join('resources', folder), join(downloads, folder), { recursive: true });
}

const zip = new ZipArchive({ store: true });
const written = new Promise((resolve, reject) => {
  const out = createWriteStream(zipPath);
  out.on('close', resolve);
  zip.on('error', reject);
  zip.pipe(out);
});

for (const folder of ['photos', 'logos', 'bio']) {
  zip.directory(join(downloads, folder), folder);
}
// The generated one-sheets and tech sheets, once `npm run pdfs` has made them.
for (const file of existsSync(downloads) ? readdirSync(downloads) : []) {
  if (file.endsWith('.pdf')) zip.file(join(downloads, file), { name: file });
}

await zip.finalize();
await written;
console.log(`Press kit written to ${zipPath}`);
