// src/lib/sql/core/ddl.ts

import { DatabaseIR } from '$lib/types/ir-ddl';
import { Dialect } from '$lib/types/dialect';

import * as mysql from '$lib/sql/dialects/mysql/ddl';
import * as postgres from '$lib/sql/dialects/postgres/ddl';
import * as sqlite from '$lib/sql/dialects/sqlite/ddl';

const dialectPlugins: Record<Dialect, { generateDDL: (ir: DatabaseIR) => string }> = {
    mysql,
    postgres,
    sqlite
};

export function generateDDL(ir: DatabaseIR, dialect: Dialect): string {
    const plugin = dialectPlugins[dialect];
    if (!plugin) throw new Error(`Unsupported dialect: ${dialect}`);

    return plugin.generateDDL(ir);
}
