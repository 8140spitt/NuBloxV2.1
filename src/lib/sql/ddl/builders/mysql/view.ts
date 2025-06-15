import { ViewDefinition } from '../../types';
import { escapeIdentifier } from './utils';

export function createView(def: ViewDefinition): string {
  const name = def.schema ? `${escapeIdentifier(def.schema)}.${escapeIdentifier(def.name)}` : escapeIdentifier(def.name);
  const temporary = def.temporary ? 'TEMPORARY ' : '';
  const replace = def.replace ? 'OR REPLACE ' : '';
  return `CREATE ${replace}${temporary}VIEW ${name} AS ${def.query.trim()}`;
}
