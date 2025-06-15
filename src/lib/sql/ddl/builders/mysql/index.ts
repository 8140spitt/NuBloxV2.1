import { IndexDefinition } from '../../types';
import { escapeIdentifier } from './utils';

export function createIndex(def: IndexDefinition): string {
  const unique = def.unique ? 'UNIQUE ' : '';
  const name = escapeIdentifier(def.name);
  const table = def.schema ? `${escapeIdentifier(def.schema)}.${escapeIdentifier(def.table)}` : escapeIdentifier(def.table);
  const cols = def.columns.map(escapeIdentifier).join(', ');
  return `CREATE ${unique}INDEX ${name} ON ${table} (${cols})`;
}
