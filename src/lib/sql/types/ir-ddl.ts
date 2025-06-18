// src/lib/types/ir-ddl.ts

export interface DatabaseIR {
    name: string;
    schema?: string;           // PostgreSQL-specific
    charset?: string;          // MySQL-specific
    collation?: string;        // MySQL-specific
    tables: TableIR[];
}

export interface TableIR {
    name: string;
    comment?: string;
    columns: ColumnIR[];
    primaryKey?: string[];         // Composite PK support
    uniqueKeys?: UniqueKeyIR[];
    indexes?: IndexIR[];
    foreignKeys?: ForeignKeyIR[];
    engine?: string;               // MySQL (e.g. InnoDB)
}

export interface ColumnIR {
    name: string;
    type: SQLType;
    nullable?: boolean;
    default?: string;              // SQL-safe string: `'value'`, `NOW()`
    autoIncrement?: boolean;
    unique?: boolean;
    comment?: string;
    generated?: GeneratedIR;       // Virtual/computed columns
}


export interface SQLType {
    baseType: string;             // abstract: 'uuid', 'int', 'varchar'
    length?: number;              // varchar(255)
    precision?: number;           // decimal(10,2)
    scale?: number;
    unsigned?: boolean;           // MySQL
    timeZone?: boolean;           // Postgres timestamp
}

export interface GeneratedIR {
    expression: string;           // SQL expression
    stored: boolean;              // STORED vs VIRTUAL
}

export interface UniqueKeyIR {
    name?: string;
    columns: string[];
}

export interface IndexIR {
    name?: string;
    columns: string[];
    unique?: boolean;
    using?: string;               // e.g. 'btree'
}

export interface ForeignKeyIR {
    name?: string;
    columns: string[];
    referencedTable: string;
    referencedColumns: string[];
    onUpdate?: ReferentialAction;
    onDelete?: ReferentialAction;
}

export type ReferentialAction =
    | 'CASCADE'
    | 'SET NULL'
    | 'SET DEFAULT'
    | 'RESTRICT'
    | 'NO ACTION';
