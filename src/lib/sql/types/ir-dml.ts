// src/lib/types/ir-dml.ts

export interface InsertIR {
    table: string;
    values: Record<string, string | number | boolean | null>; // primitive values only
}

export interface UpdateIR {
    table: string;
    set: Record<string, string | number | boolean | null>;
    where?: ConditionIR; // optional filter
}

export interface DeleteIR {
    table: string;
    where?: ConditionIR;
}


export type ConditionIR =
    | {
        type: 'COMPARE';
        field: string;
        operator: '=' | '<>' | '<' | '>' | '<=' | '>=' | 'IN' | 'LIKE';
        value: any;
    }
    | {
        type: 'AND' | 'OR';
        left: ConditionIR;
        right: ConditionIR;
    }
    | {
        type: 'NOT';
        left: ConditionIR;
    };
