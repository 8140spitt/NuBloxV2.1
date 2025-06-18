// src/lib/sql/dialects/mysql/dcl.ts

import { GrantIR, RevokeIR } from '$lib/types/ir-dcl';
import { quoteIdentifier as q } from '$lib/sql/utils/sql-escape';

export function generateGrant(ir: GrantIR): string {
    const privileges = ir.privileges.join(', ');
    const object = ir.columns?.length
        ? `${q(ir.on)} (${ir.columns.map(q).join(', ')})`
        : q(ir.on);
    const to = `'${ir.to}'`;

    return `GRANT ${privileges} ON ${object} TO ${to};`;
}

export function generateRevoke(ir: RevokeIR): string {
    const privileges = ir.privileges.join(', ');
    const object = ir.columns?.length
        ? `${q(ir.on)} (${ir.columns.map(q).join(', ')})`
        : q(ir.on);
    const from = `'${ir.to}'`;

    return `REVOKE ${privileges} ON ${object} FROM ${from};`;
}
