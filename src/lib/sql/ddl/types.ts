// src/lib/sql/ddl/types.ts

export type SqlDialects = 'mysql' | 'postgres' | 'sqlite';

export type DDLObjectType =
    | 'TABLE'
    | 'INDEX'
    | 'VIEW'
    | 'SEQUENCE'
    | 'FUNCTION'
    | 'PROCEDURE'
    | 'TRIGGER'
    | 'SCHEMA'
    | 'DATABASE'
    | 'USER'
    | 'ROLE'
    | 'EVENT';

export type SqlDefaultLiteral =
    | 'CURRENT_TIMESTAMP'
    | 'NULL'
    | 'TRUE'
    | 'FALSE'
    | string
    | number
    | boolean;

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
    default?: SqlDefaultLiteral;
    onUpdate?: SqlDefaultLiteral;
    comment?: string;
}

export interface TableConstraintDefinition {
    name?: string;
    type: 'PRIMARY KEY' | 'UNIQUE' | 'FOREIGN KEY' | 'CHECK';
    columns: string[];
    referenceTable?: string;
    referenceColumns?: string[];
    checkExpression?: string;
    onDelete?: 'CASCADE' | 'SET NULL' | 'RESTRICT' | 'NO ACTION';
    onUpdate?: 'CASCADE' | 'SET NULL' | 'RESTRICT' | 'NO ACTION';
    deferrable?: boolean;
    initiallyDeferred?: boolean;
}

export interface TableDefinition {
    name: string;
    columns: TableColumnDefinition[];
    constraints?: TableConstraintDefinition[];
    comment?: string;
    temporary?: boolean;
    ifNotExists?: boolean;
    schema?: string;
}

export interface ViewDefinition {
    name: string;
    query: string;
    replace?: boolean;
    temporary?: boolean;
    schema?: string;
}

export interface IndexDefinition {
    name: string;
    table: string;
    columns: string[];
    unique?: boolean;
    schema?: string;
}

export interface SchemaDefinition {
    name: string;
    ifNotExists?: boolean;
}

export interface DatabaseDefinition {
    name: string;
    ifNotExists?: boolean;
    charset?: string;
    collation?: string;
}

export interface SequenceDefinition {
    name: string;
    start?: number;
    increment?: number;
    minValue?: number;
    maxValue?: number;
    cycle?: boolean;
    cache?: number;
    schema?: string;
}

export interface FunctionDefinition {
    name: string;
    parameters: string;
    returns: string;
    body: string;
    deterministic?: boolean;
    schema?: string;
}

export interface ProcedureDefinition {
    name: string;
    parameters: string;
    body: string;
    schema?: string;
}

export interface TriggerDefinition {
    name: string;
    table: string;
    timing: 'BEFORE' | 'AFTER';
    event: 'INSERT' | 'UPDATE' | 'DELETE';
    body: string;
    schema?: string;
}

export interface EventDefinition {
    name: string;
    schedule: string;
    body: string;
    preserve?: boolean;
    enable?: boolean;
    schema?: string;
}

export interface UserDefinition {
    name: string;
    password?: string;
    host?: string;
}

export interface RoleDefinition {
    name: string;
}

export interface AlterTableAction {
    type:
    | 'ADD_COLUMN'
    | 'DROP_COLUMN'
    | 'MODIFY_COLUMN'
    | 'RENAME_COLUMN'
    | 'ADD_CONSTRAINT'
    | 'DROP_CONSTRAINT'
    | 'RENAME_TABLE'
    | 'TRUNCATE_TABLE'
    | 'CREATE_INDEX'
    | 'DROP_INDEX';
    column?: TableColumnDefinition;
    oldColumnName?: string;
    newColumnName?: string;
    constraint?: TableConstraintDefinition;
    constraintName?: string;
    newTableName?: string;
    indexName?: string;
    indexColumns?: string[];
    unique?: boolean;
}
