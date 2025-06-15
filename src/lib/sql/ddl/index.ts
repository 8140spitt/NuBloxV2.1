// src/lib/sql/ddl/index.ts

import type { TableDefinition, SqlDialects } from './types';
import { mysqlCreateTable } from './builders/mysql/createTable';

export function createTable(dialect: SqlDialects, def: TableDefinition): string {
    switch (dialect) {
        case 'mysql':
            return mysqlCreateTable(def);
        default:
            throw new Error(`Unsupported dialect: ${dialect}`);
    }
}
