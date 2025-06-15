import type { SchemaDefinition } from '../../types';
import { escapeIdentifier } from './utils';

export function createSchema(def: SchemaDefinition): string {
  const ifNotExists = def.ifNotExists ? 'IF NOT EXISTS ' : '';
  return `CREATE SCHEMA ${ifNotExists}${escapeIdentifier(def.name)}`;
}
