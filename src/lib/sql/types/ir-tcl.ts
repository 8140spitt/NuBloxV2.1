// src/lib/types/ir-tcl.ts

export type TCLIR =
    | { type: 'BEGIN' }
    | { type: 'COMMIT' }
    | { type: 'ROLLBACK' }
    | { type: 'SAVEPOINT'; name: string }
    | { type: 'RELEASE'; name: string };
