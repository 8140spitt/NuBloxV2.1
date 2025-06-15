// src/lib/sql/BaseDialect.ts

import type {
    CreateTableDetails,
    DDLCommand,
    CreateIndexDetails,
    CreateViewDetails,
    CreateDatabaseDetails,
    CreateProcedureDetails,
    CreateFunctionDetails,
    CreateTriggerDetails
} from './types';

export abstract class BaseDialect {
    abstract createTable(details: CreateTableDetails, cmd: DDLCommand): string;
    abstract createIndex(details: CreateIndexDetails, cmd: DDLCommand): string;
    abstract createView(details: CreateViewDetails, cmd: DDLCommand): string;
    abstract createDatabase(details: CreateDatabaseDetails, cmd: DDLCommand): string;
    abstract createProcedure(details: CreateProcedureDetails, cmd: DDLCommand): string;
    abstract createFunction(details: CreateFunctionDetails, cmd: DDLCommand): string;
    abstract createTrigger(details: CreateTriggerDetails, cmd: DDLCommand): string;
    // Add more as needed for ALTER/DROP, etc.
}
