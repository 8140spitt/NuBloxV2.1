// src/lib/types/ir-dcl.ts

export interface GrantIR {
    privileges: Array<'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE'>;
    on: string;             // table or view name
    to: string;             // role or user
    columns?: string[];     // optional: column-level privileges
}

export interface RevokeIR extends GrantIR { }
