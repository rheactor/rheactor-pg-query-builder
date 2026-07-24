import type { Expression } from "#/types/Expression";

function customCall(identifier: string, ...functionArguments: Expression[]) {
  return { type: "CALL", identifier, functionArguments } as const;
}

// Common / General Functions
function call(identifier: "ABS", value: Expression): Expression;
function call(identifier: "COALESCE", ...expressions: Expression[]): Expression;
function call(identifier: "GREATEST", ...expressions: Expression[]): Expression;
function call(identifier: "LEAST", ...expressions: Expression[]): Expression;
function call(identifier: "NULLIF", valueA: Expression, valueB: Expression): Expression;
// String Functions
function call(identifier: "ASCII", value: Expression): Expression; // eslint-disable-line unicorn/text-encoding-identifier-case
function call(identifier: "BIT_LENGTH", value: Expression): Expression;
function call(identifier: "BTRIM", value: Expression): Expression;
function call(identifier: "BTRIM", value: Expression, characters: Expression): Expression;
function call(identifier: "CHAR_LENGTH" | "CHARACTER_LENGTH", value: Expression): Expression;
function call(identifier: "CHR", value: Expression): Expression;
function call(identifier: "CONCAT", ...values: Expression[]): Expression;
function call(identifier: "CONCAT_WS", separator: Expression, ...values: Expression[]): Expression;
function call(identifier: "FORMAT", formatstr: Expression, ...formatargs: Expression[]): Expression;
function call(identifier: "INITCAP", value: Expression): Expression;
function call(identifier: "LEFT", string: Expression, count: Expression): Expression;
function call(identifier: "LENGTH", value: Expression): Expression;
function call(identifier: "LPAD", string: Expression, length: Expression): Expression;
function call(
  identifier: "LPAD",
  string: Expression,
  length: Expression,
  fill: Expression,
): Expression;
function call(identifier: "LTRIM", value: Expression): Expression;
function call(identifier: "LTRIM", value: Expression, characters: Expression): Expression;
function call(identifier: "MD5", value: Expression): Expression;
function call(identifier: "OCTET_LENGTH", value: Expression): Expression;
function call(
  identifier: "OVERLAY",
  string: Expression,
  placing: Expression,
  from: Expression,
): Expression;
function call(
  identifier: "OVERLAY",
  string: Expression,
  placing: Expression,
  from: Expression,
  count: Expression,
): Expression;
function call(identifier: "POSITION", substring: Expression, string: Expression): Expression;
function call(identifier: "PG_CLIENT_ENCODING"): Expression;
function call(identifier: "QUOTE_IDENT", value: Expression): Expression;
function call(identifier: "QUOTE_LITERAL", value: Expression): Expression;
function call(identifier: "QUOTE_NULLABLE", value: Expression): Expression;
function call(identifier: "REGEXP_MATCH", string: Expression, pattern: Expression): Expression;
function call(
  identifier: "REGEXP_MATCH",
  string: Expression,
  pattern: Expression,
  flags: Expression,
): Expression;
function call(
  identifier: "REGEXP_REPLACE",
  string: Expression,
  pattern: Expression,
  replacement: Expression,
): Expression;
function call(
  identifier: "REGEXP_REPLACE",
  string: Expression,
  pattern: Expression,
  replacement: Expression,
  flags: Expression,
): Expression;
function call(
  identifier: "REGEXP_SPLIT_TO_ARRAY",
  string: Expression,
  pattern: Expression,
): Expression;
function call(
  identifier: "REGEXP_SPLIT_TO_ARRAY",
  string: Expression,
  pattern: Expression,
  flags: Expression,
): Expression;
function call(identifier: "REPEAT", string: Expression, number: Expression): Expression;
function call(
  identifier: "REPLACE",
  string: Expression,
  from: Expression,
  to: Expression,
): Expression;
function call(identifier: "REVERSE", value: Expression): Expression;
function call(identifier: "RIGHT", string: Expression, count: Expression): Expression;
function call(identifier: "RPAD", string: Expression, length: Expression): Expression;
function call(
  identifier: "RPAD",
  string: Expression,
  length: Expression,
  fill: Expression,
): Expression;
function call(identifier: "RTRIM", value: Expression): Expression;
function call(identifier: "RTRIM", value: Expression, characters: Expression): Expression;
function call(
  identifier: "SPLIT_PART",
  string: Expression,
  delimiter: Expression,
  field: Expression,
): Expression;
function call(identifier: "STARTS_WITH", string: Expression, prefix: Expression): Expression;
function call(identifier: "STRPOS", string: Expression, substring: Expression): Expression;
function call(identifier: "SUBSTR" | "SUBSTRING", value: Expression, from: Expression): Expression;
function call(
  identifier: "SUBSTR" | "SUBSTRING",
  value: Expression,
  from: Expression,
  count: Expression,
): Expression;
function call(identifier: "TO_ASCII", value: Expression): Expression;
function call(identifier: "TO_HEX", value: Expression): Expression;
function call(
  identifier: "TRANSLATE",
  string: Expression,
  from: Expression,
  to: Expression,
): Expression;
function call(identifier: "TRIM", value: Expression): Expression;
function call(identifier: "UNISTR", value: Expression): Expression;
function call(identifier: "LOWER" | "UPPER", value: Expression): Expression;

// Math / Trig Functions
function call(
  identifier: "ACOS" | "ACOSD" | "ASIN" | "ASIND" | "ATAN" | "ATAND",
  X: Expression,
): Expression;
function call(identifier: "ACOSH" | "ASINH" | "ATANH", X: Expression): Expression;
function call(identifier: "ATAN2" | "ATAN2D", Y: Expression, X: Expression): Expression;
function call(identifier: "CBRT", X: Expression): Expression;
function call(identifier: "CEIL" | "CEILING" | "FLOOR", value: Expression): Expression;
function call(identifier: "COS" | "COSD" | "COT" | "COTD", X: Expression): Expression;
function call(identifier: "COSH" | "SINH" | "TANH", X: Expression): Expression;
function call(identifier: "DEGREES", X: Expression): Expression;
function call(identifier: "DIV", Y: Expression, X: Expression): Expression;
function call(identifier: "ERF" | "ERFC", X: Expression): Expression;
function call(identifier: "EXP", value: Expression): Expression;
function call(identifier: "FACTORIAL", value: Expression): Expression;
function call(identifier: "GAMMA" | "LGAMMA", X: Expression): Expression;
function call(identifier: "GCD" | "LCM", a: Expression, b: Expression): Expression;
function call(identifier: "LN", value: Expression): Expression;
function call(identifier: "LOG", value: Expression): Expression;
function call(identifier: "LOG", B: Expression, X: Expression): Expression;
function call(identifier: "LOG10", value: Expression): Expression;
function call(identifier: "MOD", Y: Expression, X: Expression): Expression;
function call(identifier: "PI"): Expression;
function call(identifier: "POW" | "POWER", a: Expression, b: Expression): Expression;
function call(identifier: "RADIANS", X: Expression): Expression;
function call(identifier: "RANDOM"): Expression;
function call(identifier: "ROUND", value: Expression): Expression;
function call(identifier: "ROUND", value: Expression, decimals: Expression): Expression;
function call(identifier: "SCALE", value: Expression): Expression;
function call(identifier: "SETSEED", value: Expression): Expression;
function call(identifier: "SIGN", value: Expression): Expression;
function call(identifier: "SIN" | "SIND" | "TAN" | "TAND", X: Expression): Expression;
function call(identifier: "SQRT", value: Expression): Expression;
function call(identifier: "TRUNC", value: Expression): Expression;
function call(identifier: "TRUNC", value: Expression, decimals: Expression): Expression;
function call(
  identifier: "WIDTH_BUCKET",
  operand: Expression,
  low: Expression,
  high: Expression,
  count: Expression,
): Expression;

// Date / Time Functions
function call(identifier: "AGE", timestamp: Expression): Expression;
function call(identifier: "AGE", timestampA: Expression, timestampB: Expression): Expression;
function call(identifier: "CLOCK_TIMESTAMP"): Expression;
function call(identifier: "CURRENT_DATE"): Expression;
function call(identifier: "CURRENT_TIME"): Expression;
function call(identifier: "CURRENT_TIME", precision: Expression): Expression;
function call(identifier: "CURRENT_TIMESTAMP"): Expression;
function call(identifier: "CURRENT_TIMESTAMP", precision: Expression): Expression;
function call(
  identifier: "DATE_BIN",
  stride: Expression,
  source: Expression,
  origin: Expression,
): Expression;
function call(identifier: "DATE_PART", field: Expression, source: Expression): Expression;
function call(identifier: "DATE_TRUNC", field: Expression, source: Expression): Expression;
function call(
  identifier: "DATE_TRUNC",
  field: Expression,
  source: Expression,
  timezone: Expression,
): Expression;
function call(identifier: "EXTRACT", field: Expression, source: Expression): Expression;
function call(identifier: "ISFINITE", value: Expression): Expression;
function call(
  identifier: "JUSTIFY_DAYS" | "JUSTIFY_HOURS" | "JUSTIFY_INTERVAL",
  value: Expression,
): Expression;
function call(identifier: "LOCALTIME"): Expression;
function call(identifier: "LOCALTIME", precision: Expression): Expression;
function call(identifier: "LOCALTIMESTAMP"): Expression;
function call(identifier: "LOCALTIMESTAMP", precision: Expression): Expression;
function call(
  identifier: "MAKE_DATE",
  year: Expression,
  month: Expression,
  day: Expression,
): Expression;
function call(identifier: "MAKE_INTERVAL", ...values: Expression[]): Expression;
function call(
  identifier: "MAKE_TIME",
  hour: Expression,
  min: Expression,
  sec: Expression,
): Expression;
function call(
  identifier: "MAKE_TIMESTAMP",
  year: Expression,
  month: Expression,
  day: Expression,
  hour: Expression,
  min: Expression,
  sec: Expression,
): Expression;
function call(
  identifier: "MAKE_TIMESTAMPTZ",
  year: Expression,
  month: Expression,
  day: Expression,
  hour: Expression,
  min: Expression,
  sec: Expression,
): Expression;
function call(
  identifier: "MAKE_TIMESTAMPTZ",
  year: Expression,
  month: Expression,
  day: Expression,
  hour: Expression,
  min: Expression,
  sec: Expression,
  timezone: Expression,
): Expression;
function call(identifier: "NOW" | "STATEMENT_TIMESTAMP" | "TRANSACTION_TIMESTAMP"): Expression;
function call(identifier: "TIMEOFDAY"): Expression;
function call(identifier: "TO_CHAR", value: Expression, format: Expression): Expression;
function call(identifier: "TO_DATE", value: Expression, format: Expression): Expression;
function call(identifier: "TO_TIMESTAMP", value: Expression): Expression;

// JSON Functions
function call(identifier: "JSON_AGG" | "JSONB_AGG", value: Expression): Expression;
function call(identifier: "JSON_ARRAY_LENGTH" | "JSONB_ARRAY_LENGTH", json: Expression): Expression;
function call(
  identifier: "JSON_BUILD_ARRAY" | "JSONB_BUILD_ARRAY",
  ...values: Expression[]
): Expression;
function call(
  identifier: "JSON_BUILD_OBJECT" | "JSONB_BUILD_OBJECT",
  ...values: Expression[]
): Expression;
function call(identifier: "JSON_EACH" | "JSONB_EACH", json: Expression): Expression;
function call(identifier: "JSON_EACH_TEXT" | "JSONB_EACH_TEXT", json: Expression): Expression;
function call(
  identifier: "JSON_EXTRACT_PATH" | "JSONB_EXTRACT_PATH",
  fromJson: Expression,
  ...pathElements: Expression[]
): Expression;
function call(
  identifier: "JSON_EXTRACT_PATH_TEXT" | "JSONB_EXTRACT_PATH_TEXT",
  fromJson: Expression,
  ...pathElements: Expression[]
): Expression;
function call(
  identifier: "JSON_OBJECT_AGG" | "JSONB_OBJECT_AGG",
  key: Expression,
  value: Expression,
): Expression;
function call(identifier: "JSON_OBJECT_KEYS" | "JSONB_OBJECT_KEYS", json: Expression): Expression;
function call(identifier: "JSON_PRETTY" | "JSONB_PRETTY", json: Expression): Expression;
function call(
  identifier: "JSONB_SET",
  target: Expression,
  path: Expression,
  newValue: Expression,
): Expression;
function call(
  identifier: "JSONB_SET",
  target: Expression,
  path: Expression,
  newValue: Expression,
  createIfMissing: Expression,
): Expression;
function call(identifier: "JSON_STRIP_NULLS" | "JSONB_STRIP_NULLS", target: Expression): Expression;
function call(
  identifier: "JSON_STRIP_NULLS" | "JSONB_STRIP_NULLS",
  target: Expression,
  stripInArrays: Expression,
): Expression;
function call(identifier: "JSON_TYPEOF" | "JSONB_TYPEOF", json: Expression): Expression;
function call(identifier: "TO_JSON" | "TO_JSONB", value: Expression): Expression;
function call(
  identifier: "JSONB_INSERT",
  target: Expression,
  path: Expression,
  newValue: Expression,
): Expression;
function call(
  identifier: "JSONB_INSERT",
  target: Expression,
  path: Expression,
  newValue: Expression,
  insertAfter: Expression,
): Expression;
function call(identifier: "JSONB_PATH_EXISTS", target: Expression, path: Expression): Expression;
function call(identifier: "JSONB_PATH_MATCH", target: Expression, path: Expression): Expression;
function call(identifier: "JSONB_PATH_QUERY", target: Expression, path: Expression): Expression;
function call(
  identifier: "JSONB_PATH_QUERY_ARRAY" | "JSONB_PATH_QUERY_FIRST",
  target: Expression,
  path: Expression,
): Expression;
function call(
  identifier: "JSONB_SET_LAX",
  target: Expression,
  path: Expression,
  newValue: Expression,
): Expression;
function call(
  identifier: "JSONB_SET_LAX",
  target: Expression,
  path: Expression,
  newValue: Expression,
  createIfMissing: Expression,
): Expression;

// Aggregate Functions
function call(identifier: "ANY_VALUE", value: Expression): Expression;
function call(identifier: "ARRAY_AGG", value: Expression): Expression;
function call(identifier: "AVG", value: Expression): Expression;
function call(identifier: "BIT_AND" | "BIT_OR" | "BIT_XOR", value: Expression): Expression;
function call(identifier: "BOOL_AND" | "BOOL_OR" | "EVERY", value: Expression): Expression;
function call(identifier: "COUNT", value: Expression): Expression;
function call(identifier: "COUNT"): Expression;
function call(identifier: "MAX" | "MIN", value: Expression): Expression;
function call(identifier: "STRING_AGG", value: Expression, delimiter: Expression): Expression;
function call(identifier: "SUM", value: Expression): Expression;

// Array Functions
function call(identifier: "ARRAY_APPEND", array: Expression, element: Expression): Expression;
function call(identifier: "ARRAY_CAT", arrayA: Expression, arrayB: Expression): Expression;
function call(identifier: "ARRAY_DIMS", array: Expression): Expression;
function call(identifier: "ARRAY_FILL", value: Expression, dims: Expression): Expression;
function call(identifier: "ARRAY_LENGTH", array: Expression, dim: Expression): Expression;
function call(
  identifier: "ARRAY_LOWER" | "ARRAY_UPPER",
  array: Expression,
  dim: Expression,
): Expression;
function call(identifier: "ARRAY_NDIMS", array: Expression): Expression;
function call(identifier: "ARRAY_POSITION", array: Expression, element: Expression): Expression;
function call(identifier: "ARRAY_POSITIONS", array: Expression, element: Expression): Expression;
function call(identifier: "ARRAY_PREPEND", element: Expression, array: Expression): Expression;
function call(identifier: "ARRAY_REMOVE", array: Expression, element: Expression): Expression;
function call(
  identifier: "ARRAY_REPLACE",
  array: Expression,
  from: Expression,
  to: Expression,
): Expression;
function call(identifier: "ARRAY_TO_STRING", array: Expression, delimiter: Expression): Expression;
function call(
  identifier: "ARRAY_TO_STRING",
  array: Expression,
  delimiter: Expression,
  nullString: Expression,
): Expression;
function call(identifier: "CARDINALITY", array: Expression): Expression;
function call(identifier: "STRING_TO_ARRAY", string: Expression, delimiter: Expression): Expression;
function call(
  identifier: "STRING_TO_ARRAY",
  string: Expression,
  delimiter: Expression,
  nullString: Expression,
): Expression;
function call(identifier: "UNNEST", array: Expression): Expression;

// System / Info Functions
function call(
  identifier:
    | "CURRENT_CATALOG"
    | "CURRENT_DATABASE"
    | "CURRENT_ROLE"
    | "CURRENT_SCHEMA"
    | "CURRENT_USER"
    | "USER",
): Expression;
function call(identifier: "CURRENT_QUERY"): Expression;
function call(identifier: "CURRENT_SCHEMAS", includeImplicit: Expression): Expression;
function call(identifier: "FORMAT_TYPE", typeOid: Expression, typemod: Expression): Expression;
function call(identifier: "PG_BACKEND_PID"): Expression;
function call(identifier: "PG_BLOCKING_PIDS", pid: Expression): Expression;
function call(identifier: "PG_CANCEL_BACKEND", pid: Expression): Expression;
function call(identifier: "PG_CONF_LOAD_TIME"): Expression;
function call(identifier: "PG_GET_KEYWORDS"): Expression;
function call(identifier: "PG_INDEXES_SIZE", reloid: Expression): Expression;
function call(identifier: "PG_MY_TEMP_SCHEMA"): Expression;
function call(identifier: "PG_RELOAD_CONF"): Expression;
function call(identifier: "PG_SIZE_PRETTY", size: Expression): Expression;
function call(identifier: "PG_SLEEP", seconds: Expression): Expression;
function call(identifier: "PG_TABLE_IS_VISIBLE", reloid: Expression): Expression;
function call(
  identifier: "PG_TABLE_SIZE" | "PG_TABLESPACE_SIZE" | "PG_TOTAL_RELATION_SIZE",
  reloid: Expression,
): Expression;
function call(identifier: "PG_TRIGGER_DEPTH"): Expression;
function call(identifier: "VERSION"): Expression;

function call(...args: Parameters<typeof customCall>): Expression {
  return customCall(...args);
}

export { call, customCall };
