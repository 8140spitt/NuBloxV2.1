// src/lib/sql/ddl/types.ts

export type SqlDialects = 'mysql';

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
    type: 'PRIMARY KEY' | 'UNIQUE' | 'FOREIGN KEY';
    columns: string[];
    referenceTable?: string;
    referenceColumns?: string[];
    onDelete?: 'CASCADE' | 'SET NULL' | 'RESTRICT' | 'NO ACTION';
    onUpdate?: 'CASCADE' | 'SET NULL' | 'RESTRICT' | 'NO ACTION';
}

export interface TableDefinition {
    name: string;
    columns: TableColumnDefinition[];
    constraints?: TableConstraintDefinition[];
    comment?: string;
}
