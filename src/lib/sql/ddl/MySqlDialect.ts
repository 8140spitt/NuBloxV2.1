// src/lib/sql/MySQLDialect.ts

import {
    BaseDialect
} from './baseDialect';

import type {
    CreateTableDetails,
    DDLCommand,
    CreateIndexDetails,
    CreateViewDetails,
    CreateDatabaseDetails,
    CreateProcedureDetails,
    CreateFunctionDetails,
    CreateTriggerDetails,
} from './types';

import {
    validateTableColumnDefinition,
    validateIdentifier
} from './utils';

function quoteIdentifier(name: string) {
    validateIdentifier(name);
    return `\`${name}\``;
}

export class MySQLDialect extends BaseDialect {
    createTable(details: CreateTableDetails, cmd: DDLCommand): string {
        details.columns.forEach(validateTableColumnDefinition);

        const columns = details.columns.map(col => {
            let colDef = quoteIdentifier(col.name) + ' ' + col.type;
            if (col.length) {
                colDef += '(' + (Array.isArray(col.length) ? col.length.join(',') : col.length) + ')';
            }
            if (col.unsigned) colDef += ' UNSIGNED';
            if (col.zerofill) colDef += ' ZEROFILL';
            if (col.charset) colDef += ` CHARACTER SET ${col.charset}`;
            if (col.collation) colDef += ` COLLATE ${col.collation}`;
            if (col.isNotNull) colDef += ' NOT NULL';
            if (col.isUnique) colDef += ' UNIQUE';
            if (col.isAutoIncrement) colDef += ' AUTO_INCREMENT';
            if (col.default !== undefined && col.default !== null)
                colDef += ' DEFAULT ' + (typeof col.default === 'string' && !col.default.startsWith("'") ? `'${col.default}'` : col.default);
            if (col.onUpdate) colDef += ` ON UPDATE ${col.onUpdate}`;
            if (col.isGenerated && col.generationExpr) {
                colDef += ` GENERATED ALWAYS AS (${col.generationExpr}) ${col.generationType || ''}`.trim();
            }
            if (col.comment) colDef += ` COMMENT '${col.comment}'`;
            return colDef;
        });

        const constraints = details.constraints?.map(con => {
            switch (con.type) {
                case 'PRIMARY KEY':
                    return `PRIMARY KEY (${con.columns?.map(quoteIdentifier).join(', ')})`;
                case 'UNIQUE':
                    return `UNIQUE${con.name ? ' KEY ' + quoteIdentifier(con.name) : ''} (${con.columns?.map(quoteIdentifier).join(', ')})`;
                case 'FOREIGN KEY':
                    return `FOREIGN KEY${con.name ? ' ' + quoteIdentifier(con.name) : ''} (${con.columns?.map(quoteIdentifier).join(', ')}) REFERENCES ${quoteIdentifier(con.references!.table)} (${con.references!.columns.map(quoteIdentifier).join(', ')})` +
                        (con.references?.onDelete ? ` ON DELETE ${con.references.onDelete}` : '') +
                        (con.references?.onUpdate ? ` ON UPDATE ${con.references.onUpdate}` : '');
                case 'CHECK':
                    return `CHECK (${con.expression})${con.name ? ' /* ' + con.name + ' */' : ''}`;
                default:
                    throw new Error(`Unknown constraint type: ${con.type}`);
            }
        }) ?? [];

        const tableName = quoteIdentifier(cmd.objectName);
        let sql = `CREATE TABLE${cmd.ifNotExists ? ' IF NOT EXISTS' : ''} ${tableName} (\n  ` +
            [...columns, ...constraints].join(',\n  ') + '\n)';
        if (details.tableOptions?.engine) sql += ` ENGINE=${details.tableOptions.engine}`;
        if (details.tableOptions?.charset) sql += ` DEFAULT CHARSET=${details.tableOptions.charset}`;
        if (details.tableOptions?.collation) sql += ` COLLATE=${details.tableOptions.collation}`;
        if (details.tableOptions?.comment) sql += ` COMMENT='${details.tableOptions.comment}'`;
        sql += ';';
        return sql;
    }

    createIndex(details: CreateIndexDetails, cmd: DDLCommand): string {
        const unique = details.unique ? 'UNIQUE ' : '';
        const type = details.type ? details.type + ' ' : '';
        const idxName = quoteIdentifier(cmd.objectName);
        const table = quoteIdentifier(details.table);
        const cols = details.columns.map(quoteIdentifier).join(', ');
        return `CREATE ${unique}${type}INDEX ${idxName} ON ${table} (${cols});`;
    }

    createView(details: CreateViewDetails, cmd: DDLCommand): string {
        const cols = details.columns ? `(${details.columns.map(quoteIdentifier).join(', ')})` : '';
        const co = details.checkOption ? ` WITH ${details.checkOption} CHECK OPTION` : '';
        return `CREATE VIEW ${quoteIdentifier(cmd.objectName)}${cols} AS ${details.definition}${co};`;
    }

    createDatabase(details: CreateDatabaseDetails, cmd: DDLCommand): string {
        let sql = `CREATE DATABASE${cmd.ifNotExists ? ' IF NOT EXISTS' : ''} ${quoteIdentifier(cmd.objectName)}`;
        if (details.charset) sql += ` CHARACTER SET ${details.charset}`;
        if (details.collation) sql += ` COLLATE ${details.collation}`;
        sql += ';';
        return sql;
    }

    createProcedure(details: CreateProcedureDetails, cmd: DDLCommand): string {
        return `CREATE PROCEDURE ${quoteIdentifier(cmd.objectName)} (${details.parameters})\nBEGIN\n${details.body}\nEND;`;
    }

    createFunction(details: CreateFunctionDetails, cmd: DDLCommand): string {
        return `CREATE FUNCTION ${quoteIdentifier(cmd.objectName)} (${details.parameters}) RETURNS ${details.returns}\nBEGIN\n${details.body}\nEND;`;
    }

    createTrigger(details: CreateTriggerDetails, cmd: DDLCommand): string {
        return `CREATE TRIGGER ${quoteIdentifier(cmd.objectName)} ${details.timing} ${details.event} ON ${quoteIdentifier(details.table)} FOR EACH ${details.forEach || 'ROW'}\n${details.body};`;
    }
}
