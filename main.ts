import { mkdirSync, cpSync, writeFileSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-game.ts';

// Packaging is independent of the browser runtime and uses no installed packages.
const sourceDirectory = fileURLToPath(new URL('.', import.meta.url));
const outputDirectory = resolve(process.env.MAKEFUN_OUTPUT_DIR || '/output');
mkdirSync(outputDirectory, { recursive: true });
for (const directory of ['game', 'screenshots']) {
  cpSync(join(sourceDirectory, directory), join(outputDirectory, directory), { recursive: true });
}
const dossier = buildDossier(outputDirectory, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  game_max_files: 993,
  game_max_bytes: 50331648,
  game_path_max_bytes: 1000,
});
writeFileSync(join(outputDirectory, 'dossier.json'), dossier);
