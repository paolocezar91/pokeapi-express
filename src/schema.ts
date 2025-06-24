import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function loadSchemas(schemaDir: string) {
  const indexPath = path.join(schemaDir, 'index.json');
  const schema = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
  return schema.required;
}

export function getResources(): Record<string, string> {
  const schemaDir = path.join(__dirname, '../data/schema/v2');
  return loadSchemas(schemaDir).reduce((acc, resource) => {
      return {...acc, [resource]: resource}
  }, {});
}
