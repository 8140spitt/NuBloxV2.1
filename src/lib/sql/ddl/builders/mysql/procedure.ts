import { ProcedureDefinition } from '../../types';
import { escapeIdentifier } from './utils';

export function createProcedure(def: ProcedureDefinition): string {
  const name = def.schema ? `${escapeIdentifier(def.schema)}.${escapeIdentifier(def.name)}` : escapeIdentifier(def.name);
  return `CREATE PROCEDURE ${name}(${def.parameters}) BEGIN ${def.body} END`;
}
