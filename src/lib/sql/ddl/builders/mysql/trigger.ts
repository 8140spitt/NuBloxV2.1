import { TriggerDefinition } from '../../types';
import { escapeIdentifier } from './utils';

export function createTrigger(def: TriggerDefinition): string {
  const name = def.schema ? `${escapeIdentifier(def.schema)}.${escapeIdentifier(def.name)}` : escapeIdentifier(def.name);
  const table = escapeIdentifier(def.table);
  return `CREATE TRIGGER ${name} ${def.timing} ${def.event} ON ${table} FOR EACH ROW BEGIN ${def.body} END`;
}
