import { SequenceDefinition } from '../../types';
import { escapeIdentifier } from './utils';

export function createSequence(def: SequenceDefinition): string {
  const name = def.schema ? `${escapeIdentifier(def.schema)}.${escapeIdentifier(def.name)}` : escapeIdentifier(def.name);
  const parts = [`CREATE SEQUENCE ${name}`];
  if (def.start !== undefined) parts.push(`START WITH ${def.start}`);
  if (def.increment !== undefined) parts.push(`INCREMENT BY ${def.increment}`);
  if (def.minValue !== undefined) parts.push(`MINVALUE ${def.minValue}`);
  if (def.maxValue !== undefined) parts.push(`MAXVALUE ${def.maxValue}`);
  if (def.cycle) parts.push(`CYCLE`);
  if (def.cache !== undefined) parts.push(`CACHE ${def.cache}`);
  return parts.join(' ');
}
