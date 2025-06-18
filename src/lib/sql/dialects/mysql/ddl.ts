// src/lib/sql/dialects/mysql/ddl.ts

import {
    DatabaseIR,
    TableIR,
    ColumnIR,
    SQLType,
    UniqueKeyIR,
    IndexIR,
    ForeignKeyIR
} from '$lib/types/ir-ddl';

import { quoteIdentifier as q, quoteString as s, formatDefault } from '$lib/sql/utils/sql-escape';
import { mapSQLType } from '$lib/sql/utils/type-mapper';

export function generateDDL(database: DatabaseIR): string {
    const out: string[] = [];

    if (database.charset || database.collation) {
        out.push(generateCreateDatabase(database));
        out.push(`USE ${q(database.name)};`);
    }

    for (const table of database.tables) {
        out.push(generateCreateTable(table));
    }

    return out.join('\n\n');
}

function generateCreateDatabase(db: DatabaseIR): string {
    const parts = [`CREATE DATABASE IF NOT EXISTS ${q(db.name)}`];

    if (db.charset) parts.push(`DEFAULT CHARACTER SET ${db.charset}`);
    if (db.collation) parts.push(`COLLATE ${db.collation}`);

    return parts.join(' ') + ';';
}

function generateCreateTable(table: TableIR): string {
    const lines: string[] = table.columns.map(generateColumn);

    if (table.primaryKey?.length) {
        lines.push(`  PRIMARY KEY (${table.primaryKey.map(q).join(', ')})`);
    }

    table.uniqueKeys?.forEach(uq => {
        lines.push(`  UNIQUE KEY ${q(uq.name ?? `uniq_${uq.columns.join('_')}`)} (${uq.columns.map(q).join(', ')})`);
    });

    table.indexes?.forEach(ix => {
        lines.push(
            `  ${ix.unique ? 'UNIQUE ' : ''}KEY ${q(ix.name ?? `idx_${ix.columns.join('_')}`)} (${ix.columns.map(q).join(', ')})`
        );
    });

    table.foreignKeys?.forEach(fk => {
        lines.push(generateForeignKey(fk));
    });

    const tableComment = table.comment ? ` COMMENT=${s(table.comment)}` : '';
    const engine = table.engine ? ` ENGINE=${table.engine}` : '';

    return `CREATE TABLE ${q(table.name)} (\n${lines.join(',\n')}\n)${engine}${tableComment};`;
}

function generateColumn(col: ColumnIR): string {
    const parts: string[] = [];

    parts.push(`  ${q(col.name)}`);
    parts.push(mapSQLType(col.type, 'mysql'));
    parts.push(col.nullable ? 'NULL' : 'NOT NULL');

    if (col.default !== undefined) {
        parts.push(`DEFAULT ${f
