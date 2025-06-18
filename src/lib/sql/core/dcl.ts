// src/lib/sql/core/dcl.ts

import type { Dialect } from '$lib/sql/types/dialect';
import type { GrantIR, RevokeIR } from '$lib/sql/types/ir-dcl';

import * as mysql from '$lib/sql/dialects/mysql/dcl';
import * as postgres from '$lib/sql/dialects/postgres/dcl';
import * as sqlite from '$lib/sql/dialects/sqlite/dcl';

const dialectPlugins: Record<
    Dialect,
    {
        generateGrant: (ir: GrantIR) => string;
        generateRevoke: (ir: RevokeIR) => string;
    }
> = {
    mysql,
    postgres,
    sqlite
};

// -------- GRANT --------
export function generateGrant(ir: GrantIR, dialect: Dialect): string {
    const plugin = dialectPlugins[dialect];
    if (!plugin?.generateGrant) throw new Error(`GRANT not supported for dialect: ${dialect}`);
    return plugin.generateGrant(ir);
}

// -------- REVOKE --------
export function generateRevoke(ir: RevokeIR, dialect: Dialect): string {
    const plugin = dialectPlugins[dialect];
    if (!plugin?.generateRevoke) throw new Error(`REVOKE not supported for dialect: ${dialect}`);
    return plugin.generateRevoke(ir);
}
