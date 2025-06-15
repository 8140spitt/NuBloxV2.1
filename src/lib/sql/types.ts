export type SqlDialects =
    | 'mysql'
    | 'postgresql'
    | 'sqlite'
    | 'mssql'
    | 'oracle'
    | 'mongodb'
    | 'cassandra'
    | 'redis';

export interface SqlIdentifier {
    name: string;
    schema?: string;
    database?: string;
    as?: string;
}

// Generic SQL Expression
export type SqlExpr =
    | string
    | { subquery: SqlSelect; as?: string }
    | { func: string; args: SqlExpr[]; as?: string }
    | { value: any }
    | { raw: string; as?: string };

// Condition tree
export type SqlCondition =
    | { [col: string]: any }
    | { op: 'AND' | 'OR'; conditions: SqlCondition[] }
    | { not: SqlCondition }
    | { raw: string }
    | { left: SqlExpr; operator: string; right: SqlExpr };

// Join clause
export interface SqlJoin {
    type?: 'INNER' | 'LEFT' | 'RIGHT' | 'FULL' | 'CROSS';
    table: SqlIdentifier | { subquery: SqlSelect; as: string };
    on?: SqlCondition;
}

// CTE
export interface SqlCTE {
    name: string;
    query: SqlSelect | SqlInsert | SqlUpdate | SqlDelete;
}

// Window function
export interface SqlWindow {
    partitionBy?: SqlExpr[];
    orderBy?: Array<{ expr: SqlExpr; direction?: 'ASC' | 'DESC' }>;
    frame?: string;
}

export interface SqlDDL {
    type: 'CREATE' | 'ALTER' | 'DROP' | 'TRUNCATE' | 'RENAME';
    objectType: 'TABLE' | 'DATABASE' | 'INDEX' | 'VIEW' | 'SCHEMA' | 'SEQUENCE' | 'PROCEDURE' | 'FUNCTION' | 'TRIGGER' | string;
    name: SqlIdentifier;
    details?: Record<string, any>; // columns, constraints, options, etc.
    ifNotExists?: boolean;
    ifExists?: boolean;
    cascade?: boolean;
    restrict?: boolean;
    rawSql?: string;
}

export interface SqlInsert {
    type: 'INSERT' | 'REPLACE';
    table: SqlIdentifier;
    columns?: string[];
    values?: Array<Record<string, any> | SqlExpr[]>;
    select?: SqlSelect; // INSERT ... SELECT ...
    onDuplicateKeyUpdate?: Record<string, SqlExpr>;
    rawSql?: string;
}

export interface SqlUpdate {
    type: 'UPDATE';
    table: SqlIdentifier;
    set: Record<string, SqlExpr>;
    where?: SqlCondition;
    from?: SqlIdentifier | { subquery: SqlSelect; as: string };
    returning?: SqlExpr[];
    rawSql?: string;
}

export interface SqlDelete {
    type: 'DELETE';
    table: SqlIdentifier;
    where?: SqlCondition;
    using?: SqlIdentifier[]; // for some dialects
    returning?: SqlExpr[];
    rawSql?: string;
}


export interface SqlSelect {
    type: 'SELECT';
    columns: SqlExpr[] | '*';
    from: SqlIdentifier | { subquery: SqlSelect; as: string };
    joins?: SqlJoin[];
    where?: SqlCondition;
    groupBy?: SqlExpr[];
    having?: SqlCondition;
    orderBy?: Array<{ expr: SqlExpr; direction?: 'ASC' | 'DESC' }>;
    limit?: number;
    offset?: number;
    ctes?: SqlCTE[];
    unions?: Array<{ all?: boolean; query: SqlSelect }>;
    windows?: { [alias: string]: SqlWindow };
    rawSql?: string;
}

export interface SqlDCL {
    type: 'GRANT' | 'REVOKE';
    privilege: string | string[];
    on?: { objectType: string; objectName: string };
    to: string | string[]; // user(s) or role(s)
    withGrantOption?: boolean;
    rawSql?: string;
}

export interface SqlTCL {
    type: 'BEGIN' | 'COMMIT' | 'ROLLBACK' | 'SAVEPOINT' | 'RELEASE SAVEPOINT' | 'SET TRANSACTION';
    savepointName?: string;
    options?: Record<string, any>;
    rawSql?: string;
}