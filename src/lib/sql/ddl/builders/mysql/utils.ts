// src/lib/sql/ddl/builders/mysql/utils.ts

export function escapeIdentifier(name: string): string {
    return `\`${name.replace(/`/g, '``')}\``;
}

export function formatDefaultValue(value: unknown): string {
    if (value === null) return 'NULL';
    if (value === true) return 'TRUE';
    if (value === false) return 'FALSE';
    if (typeof value === 'string' && /^[A-Z_]+$/.test(value)) return value; // e.g. CURRENT_TIMESTAMP
    if (typeof value === 'string') return `'${value.replace(/'/g, "''")}'`;
    return String(value);
}