import { UserDefinition } from '../../types';
import { escapeIdentifier } from './utils';

export function createUser(def: UserDefinition): string {
  const host = def.host ?? '%';
  const password = def.password ? ` IDENTIFIED BY '${def.password}'` : '';
  return `CREATE USER '${def.name}'@'${host}'${password}`;
}
