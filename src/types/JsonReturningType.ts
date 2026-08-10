export type JsonReturningType =
  | "JSON"
  | "JSONB"
  | "BYTEA"
  | "TEXT"
  | "CHAR"
  | "VARCHAR"
  | (string & {});
