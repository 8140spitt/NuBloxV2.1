// --- Native validation (no third-party) ---

import type { TableColumnDefinition } from './types';

export function validateIdentifier(name: string, kind: string = 'identifier'): void {
    if (!name || typeof name !== 'string') throw new Error(`${kind} is required`);
    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(name)) throw new Error(`Invalid ${kind}: ${name}`);
}

export function validateTableColumnDefinition(col: TableColumnDefinition): void {
    validateIdentifier(col.name, 'column name');
    if (!col.type || typeof col.type !== 'string') throw new Error('Column type is required');
    if (col.length !== undefined) {
        if (
            typeof col.length !== 'number' &&
            !(Array.isArray(col.length) && col.length.length <= 2 && col.length.every(n => typeof n === 'number'))
        ) {
            throw new Error(`Invalid length property for column ${col.name}`);
        }
    }
}