import { readFile, readdir, stat } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { resolve, join } from 'node:path';
import assert from 'node:assert/strict';
const root=resolve(import.meta.dirname,'..');
for (const file of await readdir(join(root,'screenshots'))) {
  const bytes=await readFile(join(root,'screenshots',file));
  assert.equal(bytes.readUInt32BE(16),1280);
  assert.equal(bytes.readUInt32BE(20),720);
  assert(bytes.length<=262144,`${file}: ${bytes.length} exceeds 256 KiB`);
  console.log(`${file}: 1280×720, ${bytes.length} bytes`);
}
const first=await readFile(join(process.argv[2] || '/tmp/opencode/petalpost-revision-out','dossier.json'));
const second=await readFile(join(process.argv[3] || '/tmp/opencode/petalpost-revision-out-second','dossier.json'));
assert(first.equals(second),'Dossier runs differ');
const vendor=await readFile(join(root,'vendor','makefun-game.ts'));
const kitVendor=await readFile('/home/hatch/workspace/makefun/kits/best-game-01-kit/starter/vendor/makefun-game.ts');
assert(vendor.equals(kitVendor),'Vendor differs from kit');
async function walk(directory) {
  let total=0;
  for (const item of await readdir(directory,{withFileTypes:true})) {
    assert(!item.isSymbolicLink(),'No symlinks allowed');
    const path=join(directory,item.name);
    if (item.isDirectory()) total+=await walk(path);
    else total+=(await stat(path)).size;
  }
  return total;
}
console.log('Game bytes:',await walk(join(root,'game')));
console.log('Dossier bytes:',first.length);
console.log('Dossier SHA-256:',createHash('sha256').update(first).digest('hex'));
console.log('PASS: screenshot bounds, byte-identical dossier runs, unchanged kit vendor, plain game files.');
