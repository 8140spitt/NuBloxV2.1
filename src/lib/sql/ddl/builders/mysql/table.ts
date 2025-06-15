// src/lib/sql/ddl/builders/mysql/table.ts

import type { TableDefinition, TableColumnDefinition, TableConstraintDefinition } from '../../types';
import { escapeIdentifier, formatDefaultValue } from './utils';

export function createTable(def: TableDefinition): string {
    const tableName = def.schema
        ? `${escapeIdentifier(def.schema)}.${escapeIdentifier(def.name)}`
        : escapeIdentifier(def.name);

    const columns = def.columns.map(buildColumn).join(',\n  ');
    const constraints = def.constraints?.map(buildConstraint).join(',\n  ') ?? '';
    const body = [columns, constraints].filter(Boolean).join(',\n  ');

    const ifNotExists = def.ifNotExists ? 'IF NOT EXISTS ' : '';
    const temporary = def.temporary ? 'TEMPORARY ' : '';
    const comment = def.comment ? ` COMMENT='${def.comment.replace(/'/g, "''")}'` : '';

    return `CREATE ${temporary}TABLE ${ifNotExists}${tableName} (\n  ${body}\n)${comment}`;
}

function buildColumn(col: TableColumnDefinition): string {
    const parts: string[] = [];

    let type = col.type;
    if (col.length !== undefined) {
        const len = Array.isArray(col.length)
            ? `(${col.length.join(',')})`
            : `(${col.length})`;
        type += len;
    }

    parts.push(`${escapeIdentifier(col.name)} ${type}`);
    if (col.unsigned) parts.push('UNSIGNED');
    if (col.zerofill) parts.push('ZEROFILL');
    if (col.isNotNull) parts.push('NOT NULL');
    if (col.isAutoIncrement) parts.push('AUTO_INCREMENT');
    if (col.default !== undefined) parts.push(`DEFAULT ${formatDefaultValue(col.default)}`);
    if (col.onUpdate) parts.push(`ON UPDATE ${formatDefaultValue(col.onUpdate)}`);
    if (col.comment) parts.push(`COMMENT '${col.comment.replace(/'/g, "''")}'`);

    return parts.join(' ');
}

function buildConstraint(con: TableConstraintDefinition): string {
    switch (con.type) {
        case 'PRIMARY KEY':
            return buildPrimaryKey(con);
        case 'UNIQUE':
            return buildUnique(con);
        case 'FOREIGN KEY':
            return buildForeignKey(con);
        case 'CHECK':
            return buildCheck(con);
    }
}

function buildPrimaryKey(con: TableConstraintDefinition): string {
    const name = con.name ? `CONSTRAINT ${escapeIdentifier(con.name)} ` : '';
    const cols = con.columns.map(escapeIdentifier).join(', ');
    return `${name}PRIMARY KEY (${cols})`;
}

function buildUnique(con: TableConstraintDefinition): string {
    const name = con.name ? `CONSTRAINT ${escapeIdentifier(con.name)} ` : '';
    const cols = con.columns.map(escapeIdentifier).join(', ');
    return `${name}UNIQUE (${cols})`;
}

function buildForeignKey(con: TableConstraintDefinition): string {
    const name = con.name ? `CONSTRAINT ${escapeIdentifier(con.name)} ` : '';
    const cols = con.columns.map(escapeIdentifier).join(', ');
    const refs = (con.referenceColumns ?? []).map(escapeIdentifier).join(', ');
    let stmt = `${name}FOREIGN KEY (${cols}) REFERENCES ${escapeIdentifier(con.referenceTable!)} (${refs})`;
    if (con.onDelete) stmt += ` ON DELETE ${con.onDelete}`;
    if (con.onUpdate) stmt += ` ON UPDATE ${con.onUpdate}`;
    return stmt;
}

function buildCheck(con: TableConstraintDefinition): string {
    const name = con.name ? `CONSTRAINT ${escapeIdentifier(con.name)} ` : '';
    return `${name}CHECK (${con.checkExpression ?? 'TRUE'})`;
}
