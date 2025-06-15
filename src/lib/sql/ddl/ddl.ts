// src/lib/sql/DDL.ts

import type { DDLCommand, SqlDialect } from './types';
import { MySQLDialect } from './MySqlDialect';

// Register dialects here:
const dialects: Record<SqlDialect, any> = {
    mysql: new MySQLDialect(),
    postgres: null, // When implemented
    sqlite: null, // When implemented
    mssql: null, // When implemented
};

export function generateDDL(command: DDLCommand): string {
    if (command.rawSql) return command.rawSql;
    if (!command.dialect) throw new Error('Dialect is required');
    const dialect = dialects[command.dialect];
    if (!dialect) throw new Error(`Unsupported dialect: ${command.dialect}`);

    switch (command.objectType) {
        case 'TABLE':
            return dialect.createTable(command.details, command);
        case 'INDEX':
            return dialect.createIndex(command.details, command);
        case 'VIEW':
            return dialect.createView(command.details, command);
        case 'DATABASE':
            return dialect.createDatabase(command.details, command);
        case 'PROCEDURE':
            return dialect.createProcedure(command.details, command);
        case 'FUNCTION':
            return dialect.createFunction(command.details, command);
        case 'TRIGGER':
            return dialect.createTrigger(command.details, command);
        default:
            throw new Error('Unsupported object type');
    }
}
