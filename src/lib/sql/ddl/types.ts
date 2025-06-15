// src/lib/sql/ddl/types.ts

/**
 * Supported SQL dialects.
 */
export type SqlDialect = 'mysql' | 'postgres' | 'sqlite' | 'mssql';

/**
 * Column definition for CREATE TABLE.
 */
export interface TableColumnDefinition {
    name: string;
    type: string;
    length?: number | [number, number];
    unsigned?: boolean;
    zerofill?: boolean;
    charset?: string;
    collation?: string;
    isPrimaryKey?: boolean;
    isUnique?: boolean;
    isNotNull?: boolean;
    isAutoIncrement?: boolean;
    isGenerated?: boolean;
    generationExpr?: string;
    generationType?: 'VIRTUAL' | 'STORED';
    default?: string | number | boolean | null;
    onUpdate?: string;
    comment?: string;
}

/**
 * Constraint definition (PK, Unique, FK, Check).
 */
export interface TableConstraintDefinition {
    type: 'PRIMARY KEY' | 'UNIQUE' | 'FOREIGN KEY' | 'CHECK';
    name?: string;
    columns?: string[];
    references?: {
        table: string;
        columns: string[];
        onDelete?: string;
        onUpdate?: string;
    };
    expression?: string;
}

/**
 * Table creation details.
 */
export interface CreateTableDetails {
    columns: TableColumnDefinition[];
    constraints?: TableConstraintDefinition[];
    tableOptions?: Record<string, any>;
    comment?: string;
}

export interface CreateIndexDetails {
    columns: string[];
    unique?: boolean;
    type?: 'BTREE' | 'HASH';
    table: string;
    name?: string;
}

export interface CreateViewDetails {
    definition: string;
    columns?: string[];
    checkOption?: 'CASCADED' | 'LOCAL';
}

export interface CreateDatabaseDetails {
    charset?: string;
    collation?: string;
}

export interface CreateProcedureDetails {
    parameters: string;
    body: string;
}

export interface CreateFunctionDetails {
    parameters: string;
    returns: string;
    body: string;
}

export interface CreateTriggerDetails {
    event: string;
    timing: string;
    table: string;
    body: string;
    forEach?: 'ROW' | 'STATEMENT';
}

/**
 * Base DDL command info.
 */
export interface DDLCommandBase {
    type: 'CREATE' | 'ALTER' | 'DROP' | 'TRUNCATE' | 'RENAME';
    objectType: 'TABLE' | 'DATABASE' | 'INDEX' | 'VIEW' | 'PROCEDURE' | 'FUNCTION' | 'TRIGGER';
    objectName: string;
    dialect?: SqlDialect;
    ifNotExists?: boolean;
    rawSql?: string;
}

export type DDLDetails =
    | CreateTableDetails
    | CreateIndexDetails
    | CreateViewDetails
    | CreateDatabaseDetails
    | CreateProcedureDetails
    | CreateFunctionDetails
    | CreateTriggerDetails;

export interface DDLCommand extends DDLCommandBase {
    details?: DDLDetails;
}


