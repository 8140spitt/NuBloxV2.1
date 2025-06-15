import type { DatabaseDefinition } from '../../types';
import { escapeIdentifier } from './utils';

export function createDatabase(def: DatabaseDefinition): string {
  const ifNotExists = def.ifNotExists ? 'IF NOT EXISTS ' : '';
  const charset = def.charset ? ` DEFAULT CHARACTER SET ${def.charset}` : '';
  const collation = def.collation ? ` COLLATE ${def.collation}` : '';
  return `CREATE DATABASE ${ifNotExists}${escapeIdentifier(def.name)}${charset}${collation}`;
}
