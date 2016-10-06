import fs from 'fs';
import path from 'path';

export const fixtureRoot = path.join(__dirname, '..', 'test-fixtures');

export default function getFixture(name) {
  return fs.readFileSync(path.join(fixtureRoot, name)).toString();
}
