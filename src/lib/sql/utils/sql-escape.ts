// src/lib/sql/utils/sql-escape.ts

import type { Dialect } from '$lib/sql/types/dialect';

/** Quote a SQL identifier (e.g., table or column name) */
export function quoteIdentifier(id: string, dialect: Dialect = 'mysql'): string {
    switch (dialect) {
        case 'postgres':
            return `"${id.replace(/"/g, '""')}"`;
        case 'sqlite':
        case 'mysql':
        default:
            return `\`${id.replace(/`/g, '``')}\``;
    }
}

/** Escape string literal for SQL */
export function quoteString(val: string): string {
    return `'${val.replace(/'/g, "''")}'`;
}

/** Format SQL-safe literal or expression for DEFAULT, VALUES, SET, WHERE */
export function formatDefault(value: any): string {
    if (value === null) return 'NULL';
    if (typeof value === 'boolean') return value ? 'TRUE' : 'FALSE';
    if (typeof value === 'number') return value.toString();

    const upper = typeof value === 'string' ? value.toUpperCase() : '';

    // Pass-through common SQL functions
    if (/^(NOW\(\)|CURRENT_TIMESTAMP|UUID\(\))$/i.test(upper)) {
        return value;
    }

    return quoteString(value);
}
