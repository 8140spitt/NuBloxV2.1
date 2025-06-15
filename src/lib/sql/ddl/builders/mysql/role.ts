import { RoleDefinition } from '../../types';
import { escapeIdentifier } from './utils';

export function createRole(def: RoleDefinition): string {
  return `CREATE ROLE ${escapeIdentifier(def.name)}`;
}
