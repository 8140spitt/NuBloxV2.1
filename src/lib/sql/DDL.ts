//src/lib/sql/DDL.ts

// --- SQL DIALECTS ---
export type SqlDialects = 'mysql';

// --- COLUMN DEFINITION ---
export interface TableColumnDefinition {
    name: string;
    type: string; // e.g. "varchar", "int", "decimal"
    length?: number | [number, number]; // e.g. varchar(255), decimal(10,2)
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
    generationType?: 'VIRTUAL' | 'STORED'; // MySQL only
    default?: string | number | boolean | null;
    onUpdate?: string;
    comment?: string;
}

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
    expression?: string; // for CHECK
}

// --- OBJECT DETAILS ---
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
    checkOption?: 'CASCADED' | 'LOCAL'; // MySQL/Oracle
}

export interface CreateDatabaseDetails {
    charset?: string;
    collation?: string;
}

export interface CreateProcedureDetails {
    parameters: string; // (x int, y int)
    body: string;
}

export interface CreateFunctionDetails {
    parameters: string;
    returns: string;
    body: string;
}

export interface CreateTriggerDetails {
    event: string; // INSERT | UPDATE | DELETE
    timing: string; // BEFORE | AFTER
    table: string;
    body: string;
    forEach?: 'ROW' | 'STATEMENT';
}

// --- DDL COMMAND BASE ---
export interface DDLCommandBase {
    type: 'CREATE' | 'ALTER' | 'DROP' | 'TRUNCATE' | 'RENAME';
    objectType: 'TABLE' | 'DATABASE' | 'INDEX' | 'VIEW' | 'PROCEDURE' | 'FUNCTION' | 'TRIGGER';
    objectName: string;
    dialect?: SqlDialects;
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

// --- DDL COMMAND ---
export interface DDLCommand extends DDLCommandBase {
    details?: DDLDetails;
}

// --- MySQL DDL GENERATOR ---
function quoteIdentifier(name: string) {
    return `\`${name}\``;
}

export const ddlGenerators = {
    mysql: {
        createTable: (details: CreateTableDetails, cmd: DDLCommand) => {
            const columns = details.columns.map(col => {
                let colDef = quoteIdentifier(col.name) + ' ' + col.type;
                if (col.length) {
                    colDef += '(' + (Array.isArray(col.length) ? col.length.join(',') : col.length) + ')';
                }
                if (col.unsigned) colDef += ' UNSIGNED';
                if (col.zerofill) colDef += ' ZEROFILL';
                if (col.charset) colDef += ` CHARACTER SET ${col.charset}`;
                if (col.collation) colDef += ` COLLATE ${col.collation}`;
                if (col.isNotNull) colDef += ' NOT NULL';
                if (col.isUnique) colDef += ' UNIQUE';
                if (col.isAutoIncrement) colDef += ' AUTO_INCREMENT';
                if (col.default !== undefined && col.default !== null)
                    colDef += ' DEFAULT ' + (typeof col.default === 'string' && !col.default.startsWith("'") ? `'${col.default}'` : col.default);
                if (col.onUpdate) colDef += ` ON UPDATE ${col.onUpdate}`;
                if (col.isGenerated && col.generationExpr) {
                    colDef += ` GENERATED ALWAYS AS (${col.generationExpr}) ${col.generationType || ''}`.trim();
                }
                if (col.comment) colDef += ` COMMENT '${col.comment}'`;
                return colDef;
            });

            const constraints = details.constraints?.map(con => {
                switch (con.type) {
                    case 'PRIMARY KEY':
                        return `PRIMARY KEY (${con.columns?.map(quoteIdentifier).join(', ')})`;
                    case 'UNIQUE':
                        return `UNIQUE${con.name ? ' KEY ' + quoteIdentifier(con.name) : ''} (${con.columns?.map(quoteIdentifier).join(', ')})`;
                    case 'FOREIGN KEY':
                        return `FOREIGN KEY${con.name ? ' ' + quoteIdentifier(con.name) : ''} (${con.columns?.map(quoteIdentifier).join(', ')}) REFERENCES ${quoteIdentifier(con.references!.table)} (${con.references!.columns.map(quoteIdentifier).join(', ')})` +
                            (con.references?.onDelete ? ` ON DELETE ${con.references.onDelete}` : '') +
                            (con.references?.onUpdate ? ` ON UPDATE ${con.references.onUpdate}` : '');
                    case 'CHECK':
                        return `CHECK (${con.expression})${con.name ? ' /* ' + con.name + ' */' : ''}`;
                }
            }) ?? [];

            const tableName = quoteIdentifier(cmd.objectName);
            let sql = `CREATE TABLE${cmd.ifNotExists ? ' IF NOT EXISTS' : ''} ${tableName} (\n  ` +
                [...columns, ...constraints].join(',\n  ') + '\n)';
            if (details.tableOptions?.engine) sql += ` ENGINE=${details.tableOptions.engine}`;
            if (details.tableOptions?.charset) sql += ` DEFAULT CHARSET=${details.tableOptions.charset}`;
            if (details.tableOptions?.collation) sql += ` COLLATE=${details.tableOptions.collation}`;
            if (details.tableOptions?.comment) sql += ` COMMENT='${details.tableOptions.comment}'`;
            sql += ';';
            return sql;
        },
        createIndex: (details: CreateIndexDetails, cmd: DDLCommand) => {
            const unique = details.unique ? 'UNIQUE ' : '';
            const type = details.type ? details.type + ' ' : '';
            const idxName = quoteIdentifier(cmd.objectName);
            const table = quoteIdentifier(details.table);
            const cols = details.columns.map(quoteIdentifier).join(', ');
            return `CREATE ${unique}${type}INDEX ${idxName} ON ${table} (${cols});`;
        },
        createView: (details: CreateViewDetails, cmd: DDLCommand) => {
            const cols = details.columns ? `(${details.columns.map(quoteIdentifier).join(', ')})` : '';
            const co = details.checkOption ? ` WITH ${details.checkOption} CHECK OPTION` : '';
            return `CREATE VIEW ${quoteIdentifier(cmd.objectName)}${cols} AS ${details.definition}${co};`;
        },
        createDatabase: (details: CreateDatabaseDetails, cmd: DDLCommand) => {
            let sql = `CREATE DATABASE${cmd.ifNotExists ? ' IF NOT EXISTS' : ''} ${quoteIdentifier(cmd.objectName)}`;
            if (details.charset) sql += ` CHARACTER SET ${details.charset}`;
            if (details.collation) sql += ` COLLATE ${details.collation}`;
            sql += ';';
            return sql;
        },
        createProcedure: (details: CreateProcedureDetails, cmd: DDLCommand) => {
            return `CREATE PROCEDURE ${quoteIdentifier(cmd.objectName)} (${details.parameters})\nBEGIN\n${details.body}\nEND;`;
        },
        createFunction: (details: CreateFunctionDetails, cmd: DDLCommand) => {
            return `CREATE FUNCTION ${quoteIdentifier(cmd.objectName)} (${details.parameters}) RETURNS ${details.returns}\nBEGIN\n${details.body}\nEND;`;
        },
        createTrigger: (details: CreateTriggerDetails, cmd: DDLCommand) => {
            return `CREATE TRIGGER ${quoteIdentifier(cmd.objectName)} ${details.timing} ${details.event} ON ${quoteIdentifier(details.table)} FOR EACH ${details.forEach || 'ROW'}\n${details.body};`;
        }
    }
};

// --- MASTER GENERATE FUNCTION ---
export function generateDDL(command: DDLCommand): string {
    if (!command.dialect || !(command.dialect in ddlGenerators))
        throw new Error('Dialect required and not supported');
    if (!command.details) throw new Error('No details provided');

    const gen = ddlGenerators[command.dialect];
    switch (command.objectType) {
        case 'TABLE': return gen.createTable(command.details as CreateTableDetails, command);
        case 'INDEX': return gen.createIndex(command.details as CreateIndexDetails, command);
        case 'VIEW': return gen.createView(command.details as CreateViewDetails, command);
        case 'DATABASE': return gen.createDatabase(command.details as CreateDatabaseDetails, command);
        case 'PROCEDURE': return gen.createProcedure(command.details as CreateProcedureDetails, command);
        case 'FUNCTION': return gen.createFunction(command.details as CreateFunctionDetails, command);
        case 'TRIGGER': return gen.createTrigger(command.details as CreateTriggerDetails, command);
        default: throw new Error('Unsupported object type');
    }
}

// --- EXAMPLES: REAL-WORLD USAGE ---

// CREATE TABLE
const createTableCommand: DDLCommand = {
    type: 'CREATE',
    objectType: 'TABLE',
    objectName: 'users',
    dialect: 'mysql',
    ifNotExists: true,
    details: {
        columns: [
            { name: 'id', type: 'int', isPrimaryKey: true, isAutoIncrement: true },
            { name: 'username', type: 'varchar', length: 50, isNotNull: true },
            { name: 'email', type: 'varchar', length: 100, isUnique: true },
            { name: 'created_at', type: 'datetime', default: 'CURRENT_TIMESTAMP' }
        ],
        constraints: [
            { type: 'UNIQUE', name: 'uq_username', columns: ['username'] },
            { type: 'CHECK', expression: 'email LIKE \'%@%\'', name: 'chk_email_format' }
        ],
        tableOptions: {
            engine: 'InnoDB',
            charset: 'utf8mb4',
            collation: 'utf8mb4_unicode_ci',
            comment: 'User table'
        }
    }
};

console.log('-- CREATE TABLE --\n' + generateDDL(createTableCommand));

// CREATE INDEX
const createIndexCommand: DDLCommand = {
    type: 'CREATE',
    objectType: 'INDEX',
    objectName: 'idx_users_email',
    dialect: 'mysql',
    details: {
        table: 'users',
        columns: ['email'],
        unique: true,
        type: 'BTREE'
    }
};
console.log('\n-- CREATE INDEX --\n' + generateDDL(createIndexCommand));

// CREATE VIEW
const createViewCommand: DDLCommand = {
    type: 'CREATE',
    objectType: 'VIEW',
    objectName: 'active_users_view',
    dialect: 'mysql',
    details: {
        columns: ['id', 'username', 'email'],
        definition: 'SELECT id, username, email FROM users WHERE is_active = 1',
        checkOption: 'CASCADED'
    }
};
console.log('\n-- CREATE VIEW --\n' + generateDDL(createViewCommand));

// CREATE DATABASE
const createDbCommand: DDLCommand = {
    type: 'CREATE',
    objectType: 'DATABASE',
    objectName: 'company_db',
    dialect: 'mysql',
    ifNotExists: true,
    details: {
        charset: 'utf8mb4',
        collation: 'utf8mb4_unicode_ci'
    }
};
console.log('\n-- CREATE DATABASE --\n' + generateDDL(createDbCommand));

// CREATE PROCEDURE
const createProcCommand: DDLCommand = {
    type: 'CREATE',
    objectType: 'PROCEDURE',
    objectName: 'reset_user_password',
    dialect: 'mysql',
    details: {
        parameters: 'IN userId INT, IN newPassword VARCHAR(255)',
        body: `
    UPDATE users SET password = newPassword WHERE id = userId;
    INSERT INTO audit_log(user_id, action) VALUES (userId, 'Password Reset');
`
    }
};
console.log('\n-- CREATE PROCEDURE --\n' + generateDDL(createProcCommand));

// CREATE FUNCTION
const createFuncCommand: DDLCommand = {
    type: 'CREATE',
    objectType: 'FUNCTION',
    objectName: 'calculate_discount',
    dialect: 'mysql',
    details: {
        parameters: 'price DECIMAL(10,2), discount DECIMAL(5,2)',
        returns: 'DECIMAL(10,2)',
        body: `
    RETURN price - (price * discount / 100);
`
    }
};
console.log('\n-- CREATE FUNCTION --\n' + generateDDL(createFuncCommand));

// CREATE TRIGGER
const createTriggerCommand: DDLCommand = {
    type: 'CREATE',
    objectType: 'TRIGGER',
    objectName: 'before_user_insert',
    dialect: 'mysql',
    details: {
        event: 'INSERT',
        timing: 'BEFORE',
        table: 'users',
        forEach: 'ROW',
        body: `
    SET NEW.created_at = NOW();
`
    }
};
console.log('\n-- CREATE TRIGGER --\n' + generateDDL(createTriggerCommand));

/*
    To use:
    - Copy and paste into your TypeScript project.
    - Adjust types for other dialects as needed.
    - Replace `console.log` with whatever integration you need (UI, migration file, etc).
*/