// src/lib/sql/dialects/mysql/tcl.ts

import { TCLIR } from '$lib/types/ir-tcl';
import { quoteIdentifier as q } from '$lib/sql/utils/sql-escape';

export function generateTCL(ir: TCLIR): string {
    switch (ir.type) {
        case 'BEGIN':
            return 'START TRANSACTION;';
        case 'COMMIT':
            return 'COMMIT;';
        case 'ROLLBACK':
            return 'ROLLBACK;';
        case 'SAVEPOINT':
            return `SAVEPOINT ${q(ir.name)};`;
        case 'RELEASE':
            return `RELEASE SAVEPOINT ${q(ir.name)};`;
        default:
            throw new Error(`Unsupported TCL type: ${(ir as any).type}`);
    }
}
