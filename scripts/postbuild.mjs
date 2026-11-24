// Last step of `npm run build`. Publishes the original photos and logos as downloads
// and assembles the press kit ZIP, PDFs included. Reads only the two folders named below:
// nothing from resources/private can end up in dist/.
import { createWriteStream, cpSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { ZipArchive } from 'archiver';
import { isPublishable } from './publishable.mjs';

const downloads = 'dist/downloads';
const zipPath = join(downloads, 'hilldale-presskit.zip');

for (const folder of ['photos', 'logos']) {
  cpSync(join('resources', folder), join(downloads, folder), {
    recursive: true,
    filter: (source) => source === join('resources', folder) || isPublishable(source),
  });
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
// The one-sheets and tech sheets printed by build-pdfs.mjs.
for (const file of existsSync(downloads) ? readdirSync(downloads) : []) {
  if (file.endsWith('.pdf')) zip.file(join(downloads, file), { name: file });
}

await zip.finalize();
await written;
console.log(`Press kit written to ${zipPath}`);
