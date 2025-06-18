// src/lib/sql/dialects/mysql/dml.ts

import { InsertIR, UpdateIR, DeleteIR } from '$lib/types/ir-dml';
import { quoteIdentifier as q, formatDefault } from '$lib/sql/utils/sql-escape';

export function generateInsert(ir: InsertIR): string {
    const fields = Object.keys(ir.values);
    const values = fields.map(field => formatDefault(ir.values[field]));

    return `INSERT INTO ${q(ir.table)} (${fields.map(q).join(', ')}) VALUES (${values.join(', ')});`;
}

export function generateUpdate(ir: UpdateIR): string {
    const sets = Object.entries(ir.set).map(([key, value]) => `${q(key)} = ${formatDefault(value)}`);
    const where = ir.where ? ` WHERE ${generateWhereClause(ir.where)}` : '';

    return `UPDATE ${q(ir.table)} SET ${sets.join(', ')}${where};`;
}

export function generateDelete(ir: DeleteIR): string {
    const where = ir.where ? ` WHERE ${generateWhereClause(ir.where)}` : '';
    return `DELETE FROM ${q(ir.table)}${where};`;
}


function generateWhereClause(condition: any): string {
    if (condition.type === 'COMPARE') {
        return `${q(condition.field)} ${condition.operator} ${formatDefault(condition.value)}`;
    }

    if (condition.type === 'AND' || condition.type === 'OR') {
        return `(${generateWhereClause(condition.left)} ${condition.type} ${generateWhereClause(condition.right)})`;
    }

    if (condition.type === 'NOT') {
        return `NOT (${generateWhereClause(condition.left)})`;
    }

    throw new Error(`Unsupported condition type: ${condition.type}`);
}
