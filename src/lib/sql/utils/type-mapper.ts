// src/lib/sql/utils/type-mapper.ts

import type { SQLType } from '$lib/sql/types/ir-ddl';
import type { Dialect } from '$lib/sql/types/dialect';

export function mapSQLType(type: SQLType, dialect: Dialect): string {
    switch (dialect) {
        case 'mysql':
            return mapMySQLType(type);
        case 'postgres':
            return mapPostgresType(type);
        case 'sqlite':
            return mapSQLiteType(type);
        default:
            throw new Error(`Unsupported dialect: ${dialect}`);
    }
}

// --- MYSQL ---
function mapMySQLType(type: SQLType): string {
    const base = type.baseType.toLowerCase();

    switch (base) {
        case 'uuid': return 'CHAR(36)';
        case 'json': return 'JSON';
        case 'int':
        case 'integer': return type.unsigned ? 'INT UNSIGNED' : 'INT';
        case 'decimal': return `DECIMAL(${type.precision ?? 10}, ${type.scale ?? 2})`;
        case 'varchar': return `VARCHAR(${type.length ?? 255})`;
        case 'char': return `CHAR(${type.length ?? 1})`;
        case 'text': return 'TEXT';
        case 'boolean': return 'TINYINT(1)';
        case 'datetime': return 'DATETIME';
        default: return base.toUpperCase();
    }
}

// --- POSTGRES ---
function mapPostgresType(type: SQLType): string {
    const base = type.baseType.toLowerCase();

    switch (base) {
        case 'uuid': return 'UUID';
        case 'json': return 'JSONB';
        case 'int':
        case 'integer': return 'INTEGER';
        case 'decimal': return `NUMERIC(${type.precision ?? 10}, ${type.scale ?? 2})`;
        case 'varchar': return `VARCHAR(${type.length ?? 255})`;
        case 'char': return `CHAR(${type.length ?? 1})`;
        case 'text': return 'TEXT';
        case 'boolean': return 'BOOLEAN';
        case 'datetime': return 'TIMESTAMP' + (type.timeZone ? ' WITH TIME ZONE' : '');
        default: return base.toUpperCase();
    }
}

// --- SQLITE ---
function mapSQLiteType(type: SQLType): string {
    const base = type.baseType.toLowerCase();

    switch (base) {
        case 'uuid':
        case 'json':
        case 'varchar':
        case 'char':
        case 'text':
        case 'datetime':
            return 'TEXT';
        case 'boolean':
        case 'int':
        case 'integer':
            return 'INTEGER';
        case 'decimal':
        case 'float':
        case 'double':
            return 'REAL';
        default:
            return base.toUpperCase();
    }
}
