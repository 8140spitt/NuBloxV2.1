import { EventDefinition } from '../../types';
import { escapeIdentifier } from './utils';

export function createEvent(def: EventDefinition): string {
  const name = def.schema ? `${escapeIdentifier(def.schema)}.${escapeIdentifier(def.name)}` : escapeIdentifier(def.name);
  const preserve = def.preserve ? ' ON COMPLETION PRESERVE' : '';
  const status = def.enable === false ? ' DISABLE' : ' ENABLE';
  return `CREATE EVENT ${name} ON SCHEDULE ${def.schedule}${preserve} DO BEGIN ${def.body} END${status}`;
}
