// src/lib/sql/ddl/builders/mysql/table.ts

import type { TableDefinition, TableColumnDefinition, TableConstraintDefinition } from '../../types';
import { escapeIdentifier, formatDefaultValue } from './utils';

export function mysqlCreateTable(def: TableDefinition): string {
    const columns = def.columns.map(mysqlColumnBuilder).join(',\n  ');
    const constraints = def.constraints?.map(mysqlConstraintBuilder).join(',\n  ') ?? '';

    const body = [columns, constraints].filter(Boolean).join(',\n  ');

    return `CREATE TABLE \`${def.name}\` (\n  ${body}\n)`;
}

function mysqlColumnBuilder(col: TableColumnDefinition): string {
    const parts: string[] = [];
    parts.push(`\`${col.name}\` ${col.type}`);

    if (col.length !== undefined) {
        if (Array.isArray(col.length)) {
            parts[0] += `(${col.length.join(',')})`;
        } else {
            parts[0] += `(${col.length})`;
        }
    }

    if (col.unsigned) parts.push('UNSIGNED');
    if (col.zerofill) parts.push('ZEROFILL');
    if (col.isNotNull) parts.push('NOT NULL');
    if (col.isAutoIncrement) parts.push('AUTO_INCREMENT');
    if (col.default !== undefined) parts.push(`DEFAULT ${formatDefaultValue(col.default)}`);
    if (col.onUpdate) parts.push(`ON UPDATE ${formatDefaultValue(col.onUpdate)}`);
    if (col.comment) parts.push(`COMMENT '${col.comment.replace(/'/g, "''")}'`);

    return parts.join(' ');
}

function mysqlConstraintBuilder(con: TableConstraintDefinition): string {
    const cols = con.columns.map(c => `\`${c}\``).join(', ');
    switch (con.type) {
        case 'PRIMARY KEY':
            return `PRIMARY KEY (${cols})`;
        case 'UNIQUE':
            return `UNIQUE (${cols})`;
        case 'FOREIGN KEY':
            return `FOREIGN KEY (${cols}) REFERENCES \`${con.referenceTable}\` (${con.referenceColumns?.map(c => `\`${c}\``).join(', ')})` +
                (con.onDelete ? ` ON DELETE ${con.onDelete}` : '') +
                (con.onUpdate ? ` ON UPDATE ${con.onUpdate}` : '');
    }
}

