import { FunctionDefinition } from '../../types';
import { escapeIdentifier } from './utils';

export function createFunction(def: FunctionDefinition): string {
  const name = def.schema ? `${escapeIdentifier(def.schema)}.${escapeIdentifier(def.name)}` : escapeIdentifier(def.name);
  const deterministic = def.deterministic ? ' DETERMINISTIC' : '';
  return `CREATE FUNCTION ${name}(${def.parameters}) RETURNS ${def.returns}${deterministic} BEGIN ${def.body} END`;
}
