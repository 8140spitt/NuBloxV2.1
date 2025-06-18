// src/lib/sql/core/dml.ts

import { Dialect } from '$lib/types/dialect';
import { InsertIR, UpdateIR, DeleteIR } from '$lib/types/ir-dml';

import * as mysql from '$lib/sql/dialects/mysql/dml';
import * as postgres from '$lib/sql/dialects/postgres/dml';
import * as sqlite from '$lib/sql/dialects/sqlite/dml';

const dialectPlugins: Record<
    Dialect,
    {
        generateInsert: (ir: InsertIR) => string;
        generateUpdate: (ir: UpdateIR) => string;
        generateDelete: (ir: DeleteIR) => string;
    }
> = {
    mysql,
    postgres,
    sqlite
};

// -------- INSERT --------
export function generateInsert(ir: InsertIR, dialect: Dialect): string {
    const plugin = dialectPlugins[dialect];
    if (!plugin?.generateInsert) throw new Error(`INSERT not supported for dialect: ${dialect}`);
    return plugin.generateInsert(ir);
}

// -------- UPDATE --------
export function generateUpdate(ir: UpdateIR, dialect: Dialect): string {
    const plugin = dialectPlugins[dialect];
    if (!plugin?.generateUpdate) throw new Error(`UPDATE not supported for dialect: ${dialect}`);
    return plugin.generateUpdate(ir);
}

// -------- DELETE --------
export function generateDelete(ir: DeleteIR, dialect: Dialect): string {
    const plugin = dialectPlugins[dialect];
    if (!plugin?.generateDelete) throw new Error(`DELETE not supported for dialect: ${dialect}`);
    return plugin.generateDelete(ir);
}
