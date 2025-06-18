// src/lib/types/dialect.ts

export type Dialect =
    | 'mysql'
    | 'postgres'
    | 'sqlite'
    | 'mssql'
    | 'oracle';

export const SUPPORTED_DIALECTS: Dialect[] = [
    'mysql',
    'postgres',
    'sqlite',
    'mssql',
    'oracle'
];
