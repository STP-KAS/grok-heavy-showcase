import {writeFile} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {runFreezeLab} from './freeze-lab.mjs';
import {runDepegLab} from './depeg-lab.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const json = (value) =>
  JSON.stringify(
    value,
    (_k, v) => (typeof v === 'bigint' ? v.toString() : v),
    2,
  );

const freeze = runFreezeLab();
const depeg = runDepegLab();
await writeFile(path.join(ROOT, 'artifacts', 'freeze-lab.json'), json(freeze));
await writeFile(path.join(ROOT, 'artifacts', 'depeg-lab.json'), json(depeg));
console.log('freeze verdict', freeze.verdict);
console.log('depeg bps', String(depeg.after.depegBps));
console.log('wrote artifacts/freeze-lab.json and artifacts/depeg-lab.json');
