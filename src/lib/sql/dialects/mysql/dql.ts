// src/lib/sql/dialects/mysql/dql.ts

import { SelectIR, ConditionIR, JoinIR, OrderByIR } from '$lib/types/ir-dql';
import { quoteIdentifier as q, formatDefault } from '$lib/sql/utils/sql-escape';

export function generateSelect(ir: SelectIR): string {
    const columns = ir.columns.length ? ir.columns.map(q).join(', ') : '*';
    const base = [`SELECT ${columns} FROM ${q(ir.table)}`];

    if (ir.joins?.length) {
        for (const join of ir.joins) {
            base.push(renderJoin(join));
        }
    }

    if (ir.where) {
        base.push(`WHERE ${renderCondition(ir.where)}`);
    }

    if (ir.groupBy?.length) {
        base.push(`GROUP BY ${ir.groupBy.map(q).join(', ')}`);
    }

    if (ir.orderBy?.length) {
        base.push(`ORDER BY ${ir.orderBy.map(renderOrderBy).join(', ')}`);
    }

    if (ir.limit !== undefined) {
        base.push(`LIMIT ${ir.limit}`);
    }

    if (ir.offset !== undefined) {
        base.push(`OFFSET ${ir.offset}`);
    }

    return base.join(' ') + ';';
}


function renderJoin(join: JoinIR): string {
    const type = join.type.toUpperCase();
    return `${type} JOIN ${q(join.table)} ON ${renderCondition(join.on)}`;
}

function renderOrderBy(order: OrderByIR): string {
    return `${q(order.column)} ${order.direction}`;
}

function renderCondition(cond: ConditionIR): string {
    switch (cond.type) {
        case 'COMPARE':
            return `${q(cond.field!)} ${cond.operator} ${formatDefault(cond.value)}`;
        case 'AND':
        case 'OR':
            return `(${renderCondition(cond.left!)} ${cond.type} ${renderCondition(cond.right!)})`;
        case 'NOT':
            return `NOT (${renderCondition(cond.left!)})`;
        default:
            throw new Error(`Unsupported condition type: ${cond.type}`);
    }
}
