// Logical operators for WHERE/HAVING trees
type LogicalOp = 'AND' | 'OR';

// A condition can be a leaf (e.g., { status: 'active' }) or a logical node (AND/OR)
type ConditionTree =
    | { [column: string]: any }
    | { operator: LogicalOp; conditions: ConditionTree[] };

// JOIN clause definition
interface JoinClause {
    type?: 'INNER' | 'LEFT' | 'RIGHT' | 'FULL';
    table: string;
    alias?: string;
    on: string; // e.g., "a.id = b.a_id"
}

// Column can be just a name or an object for alias/expression
type SelectColumn = string | { expr: string; as?: string };

interface DQLCommand {
    type: 'SELECT';
    columns: SelectColumn[] | '*';
    table: string;
    alias?: string;
    joins?: JoinClause[];
    where?: ConditionTree;
    groupBy?: string[];
    having?: ConditionTree;
    orderBy?: Array<{ column: string; direction?: 'ASC' | 'DESC' }>;
    limit?: number;
    offset?: number;
    rawSql?: string;
}

class DQLBuilder {
    private _command: DQLCommand;

    constructor(table: string, alias?: string) {
        this._command = {
            type: 'SELECT',
            columns: '*',
            table,
            alias
        };
    }

    select(columns: SelectColumn[] | '*') {
        this._command.columns = columns;
        return this;
    }

    join(join: JoinClause) {
        if (!this._command.joins) this._command.joins = [];
        this._command.joins.push(join);
        return this;
    }

    where(conditions: ConditionTree) {
        this._command.where = conditions;
        return this;
    }

    and(conditions: ConditionTree) {
        if (!this._command.where) {
            this._command.where = conditions;
        } else {
            this._command.where = {
                operator: 'AND',
                conditions: [this._command.where, conditions]
            };
        }
        return this;
    }

    or(conditions: ConditionTree) {
        if (!this._command.where) {
            this._command.where = conditions;
        } else {
            this._command.where = {
                operator: 'OR',
                conditions: [this._command.where, conditions]
            };
        }
        return this;
    }

    groupBy(columns: string[]) {
        this._command.groupBy = columns;
        return this;
    }

    having(conditions: ConditionTree) {
        this._command.having = conditions;
        return this;
    }

    orderBy(column: string, direction: 'ASC' | 'DESC' = 'ASC') {
        if (!this._command.orderBy) this._command.orderBy = [];
        this._command.orderBy.push({ column, direction });
        return this;
    }

    limit(limit: number) {
        this._command.limit = limit;
        return this;
    }

    offset(offset: number) {
        this._command.offset = offset;
        return this;
    }

    raw(sql: string) {
        this._command.rawSql = sql;
        return this;
    }

    build(): DQLCommand {
        return this._command;
    }
}