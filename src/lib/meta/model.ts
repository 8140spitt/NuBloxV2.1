// src/lib/meta/model.ts

/** TABLE */
export interface TableMeta {
    name: string;
    schema?: string; // For Postgres/Oracle, etc.
    label?: string;
    fields: FieldMeta[];
    primaryKey?: PrimaryKeyMeta;
    foreignKeys?: ForeignKeyMeta[];
    indexes?: IndexMeta[];
    uniqueConstraints?: UniqueConstraintMeta[];
    checks?: CheckConstraintMeta[];
    options?: TableOptionMeta[];
    comment?: string;
}

/** TABLE OPTION */
export interface TableOptionMeta {
    name: string;
    value?: any;
    comment?: string;
}

/** FIELD / COLUMN */
export interface FieldMeta {
    name: string;
    type: string;
    isNullable?: boolean;
    defaultValue?: any;
    isUnique?: boolean;
    length?: number;
    // ...other column options
    comment?: string;
}

/** VIEW */
export interface ViewMeta {
    name: string;
    schema?: string;
    definition: string; // SQL for the view
    comment?: string;
}

/** INDEX */
export interface IndexMeta {
    name: string;
    columns: string[];
    isUnique?: boolean;
    type?: string; // btree, hash, gin, etc.
    comment?: string;
}

/** PRIMARY KEY */
export interface PrimaryKeyMeta {
    columns: string[];
    name?: string;
}

/** FOREIGN KEY */
export interface ForeignKeyMeta {
    name?: string;
    columns: string[];
    referencedTable: string;
    referencedColumns: string[];
    onUpdate?: string;
    onDelete?: string;
}

/** UNIQUE CONSTRAINT */
export interface UniqueConstraintMeta {
    name?: string;
    columns: string[];
}

/** CHECK CONSTRAINT */
export interface CheckConstraintMeta {
    name?: string;
    expression: string;
}

/** SEQUENCE */
export interface SequenceMeta {
    name: string;
    schema?: string;
    start?: number;
    increment?: number;
    minValue?: number;
    maxValue?: number;
    cycle?: boolean;
    comment?: string;
}

/** TRIGGER */
export interface TriggerMeta {
    name: string;
    table: string;
    event: 'INSERT' | 'UPDATE' | 'DELETE';
    timing: 'BEFORE' | 'AFTER' | 'INSTEAD OF';
    function: string; // or definition
    comment?: string;
}

/** PROCEDURE / FUNCTION */
export interface ProcedureMeta {
    name: string;
    schema?: string;
    args: ProcedureArgMeta[];
    returnType?: string;
    definition: string;
    language?: string;
    comment?: string;
}
export interface ProcedureArgMeta {
    name: string;
    type: string;
    mode?: 'IN' | 'OUT' | 'INOUT';
}

/** USER / ROLE */
export interface UserMeta {
    name: string;
    password?: string;
    roles?: string[];
    privileges?: string[];
    comment?: string;
}
export interface RoleMeta {
    name: string;
    privileges?: string[];
    comment?: string;
}

/** DOMAIN (custom type, e.g. Postgres) */
export interface DomainMeta {
    name: string;
    type: string;
    constraints?: string[];
    defaultValue?: any;
    comment?: string;
}

/** APP META (root object) */
export interface AppMeta {
    name: string;
    schemas?: string[];
    tables?: TableMeta[];
    views?: ViewMeta[];
    sequences?: SequenceMeta[];
    triggers?: TriggerMeta[];
    procedures?: ProcedureMeta[];
    users?: UserMeta[];
    roles?: RoleMeta[];
    domains?: DomainMeta[];
    // add more as needed!
}
