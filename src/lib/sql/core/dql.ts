// src/lib/sql/core/dql.ts

import { Dialect } from '$lib/types/dialect';
import { SelectIR } from '$lib/types/ir-dql';

import * as mysql from '$lib/sql/dialects/mysql/dql';
import * as postgres from '$lib/sql/dialects/postgres/dql';
import * as sqlite from '$lib/sql/dialects/sqlite/dql';

const dialectPlugins: Record<
    Dialect,
    {
        generateSelect: (ir: SelectIR) => string;
    }
> = {
    mysql,
    postgres,
    sqlite
};

// -------- SELECT --------
export function generateSelect(ir: SelectIR, dialect: Dialect): string {
    const plugin = dialectPlugins[dialect];
    if (!plugin?.generateSelect) throw new Error(`SELECT not supported for dialect: ${dialect}`);
    return plugin.generateSelect(ir);
}
