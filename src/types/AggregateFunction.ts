export type AggregateFunction =
  | "ARRAY_AGG"
  | "JSON_AGG"
  | "JSONB_AGG"
  | "JSON_OBJECT_AGG"
  | "JSONB_OBJECT_AGG"
  | "STRING_AGG"
  | "XMLAGG"
  | (string & {});
