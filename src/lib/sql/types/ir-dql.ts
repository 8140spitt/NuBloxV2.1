// src/lib/types/ir-dql.ts

export interface SelectIR {
    table: string;
    columns: string[];             // use ['*'] or specific columns
    where?: ConditionIR;
    joins?: JoinIR[];
    groupBy?: string[];
    orderBy?: OrderByIR[];
    limit?: number;
    offset?: number;
}


export interface JoinIR {
    type: 'INNER' | 'LEFT' | 'RIGHT' | 'FULL';
    table: string;
    on: ConditionIR;
}

export interface OrderByIR {
    column: string;
    direction: 'ASC' | 'DESC';
}

// Reuse shared ConditionIR from ir-dml.ts
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
