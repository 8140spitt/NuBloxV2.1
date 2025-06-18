// src/lib/sql/core/tcl.ts

import { Dialect } from '$lib/types/dialect';
import { TCLIR } from '$lib/types/ir-tcl';

import * as mysql from '$lib/sql/dialects/mysql/tcl';
import * as postgres from '$lib/sql/dialects/postgres/tcl';
import * as sqlite from '$lib/sql/dialects/sqlite/tcl';

const dialectPlugins: Record<
    Dialect,
    {
        generateTCL: (ir: TCLIR) => string;
    }
> = {
    mysql,
    postgres,
    sqlite
};

// -------- TCL Dispatcher --------
export function generateTCL(ir: TCLIR, dialect: Dialect): string {
    const plugin = dialectPlugins[dialect];
    if (!plugin?.generateTCL) throw new Error(`TCL not supported for dialect: ${dialect}`);
    return plugin.generateTCL(ir);
}
