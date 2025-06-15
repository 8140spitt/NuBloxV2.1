// src/lib/sql/ddl/index.ts

import type { TableDefinition, SqlDialects } from './types';
import { createTable } from './builders/mysql/table';

export function sqlCreateTable(dialect: SqlDialects, def: TableDefinition): string {
    switch (dialect) {
        case 'mysql':
            return createTable(def);
        default:
            throw new Error(`Unsupported dialect: ${dialect}`);
    }
}
