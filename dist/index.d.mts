//#region src/types/Cast.d.ts
type Cast = "BIGINT" | "BOOLEAN" | "BYTEA" | "DATE" | "DOUBLE PRECISION" | "INTEGER" | "JSON" | "JSONB" | "NUMERIC" | "REAL" | "SMALLINT" | "TEXT" | "TIMESTAMP" | "VARCHAR";
//#endregion
//#region src/types/Collate.d.ts
type Collate = string;
//#endregion
//#region src/types/Falseable.d.ts
type Falseable<T> = T | false | null | undefined;
//#endregion
//#region src/types/Identifier.d.ts
type Identifier = string;
//#endregion
//#region src/types/JsonValue.d.ts
type JsonValueBase = boolean | number | object | string | null;
type JsonValue = JsonValueBase | JsonValueBase[];
//#endregion
//#region src/types/Value.d.ts
type Value = boolean | number | string | null;
//#endregion
//#region src/types/ValueExtended.d.ts
type ValueExtended = Value | bigint;
//#endregion
//#region src/types/Expression.d.ts
type MathOperator = "-" | "*" | "/" | "&" | "#" | "%" | "^" | "+" | "<<" | ">>" | "|";
type UnaryOperator = "-" | "+" | "~";
type ComparisonOperator = "!=" | "<" | "<=" | "=" | ">" | ">=";
type JsonOperator = "->" | "->>" | "?" | "?&" | "?|" | "#>" | "#>>";
type ContainmentOperator = "@>" | "<@";
type ArrayConcatOperator = "&&" | "||";
type LogicalOperator = "AND" | "OR";
type Expression = Builder | Identifier | {
  type: "BETWEEN SYMMETRIC" | "BETWEEN";
  identifier: Identifier;
  from: Expression;
  to: Expression;
} | {
  type: "ILIKE" | "LIKE" | "SET";
  identifier: Identifier;
  expression: Expression;
} | {
  type: "IS DISTINCT FROM";
  expressionA: Expression;
  expressionB: Expression;
} | {
  type: "OPERATOR";
  operator: MathOperator;
  expressionA: Expression;
  expressionB: Expression;
} | {
  type: "UNARY";
  operator: UnaryOperator;
  expression: Expression;
} | {
  type: LogicalOperator;
  expressions: Array<Falseable<Expression>>;
  includeParens?: boolean;
} | {
  type: "ALL" | "ANY";
  operator: ComparisonOperator;
  sideA: Expression;
  sideB: Expression;
} | {
  type: "CALL";
  identifier: Identifier;
  functionArguments: Expression[];
} | {
  type: "CAST";
  expression: Expression;
  cast: Cast;
} | {
  type: "COLLATE";
  expression: Expression;
  collate: Collate;
} | {
  type: "EXCLUDED";
  identifier: Identifier;
} | {
  type: "EXISTS";
  builder: Builder;
} | {
  type: "IDENTIFIER";
  identifier: Expression;
  alias?: Identifier;
} | {
  type: "IN";
  identifier: Identifier;
  values: Expression[];
} | {
  type: "IS FALSE" | "IS TRUE" | "IS UNKNOWN" | "NOT";
  expression: Expression;
} | {
  type: "IS NULL";
  identifier: Identifier;
} | {
  type: "JSON";
  argument: JsonValue;
} | {
  type: "RAW";
  expression: string;
} | {
  type: "STATIC";
  argument: ValueExtended;
} | {
  type: "VALUE";
  argument: Value;
} | {
  type: ArrayConcatOperator;
  sideA: Expression;
  sideB: Expression;
} | {
  type: ComparisonOperator;
  sideA: Expression;
  sideB: Expression;
} | {
  type: ContainmentOperator;
  sideA: Expression;
  sideB: Expression;
} | {
  type: JsonOperator;
  sideA: Expression;
  sideB: Expression;
};
//#endregion
//#region src/types/Operation.d.ts
type Operation = string | {
  value: Value;
};
//#endregion
//#region src/types/SampleMethod.d.ts
type SampleMethod = "BERNOULLI" | "SYSTEM";
//#endregion
//#region src/Builder.d.ts
declare abstract class Builder {
  protected readonly columnsOperations: Operation[][];
  protected readonly tablesOperations: Operation[][];
  protected readonly setsOperations: Operation[][];
  protected readonly valuesOperations: Operation[][][];
  private readonly wheresExpressions;
  private readonly joins;
  private readonly returningIdentifiers;
  private limitExpression?;
  private offsetExpression?;
  conditional(condition: boolean, then: (builder: this) => void): this;
  build(): {
    query: string;
    parameters: Value[];
  };
  join(table: Identifier, alias?: Identifier, ...conditions: Expression[]): this;
  joinLeft(table: Identifier, alias?: Identifier, ...conditions: Expression[]): this;
  joinLateral(query: Builder, alias?: Identifier, ...conditions: Expression[]): this;
  joinLeftLateral(query: Builder, alias?: Identifier, ...conditions: Expression[]): this;
  joinRight(table: Identifier, alias?: Identifier, ...conditions: Expression[]): this;
  joinFullOuter(table: Identifier, alias?: Identifier, ...conditions: Expression[]): this;
  joinCross(table: Identifier, alias?: Identifier): this;
  protected internalColumn(...columns: Array<Falseable<Expression>>): this;
  protected internalColumnAliased(identifier: Falseable<Expression>, alias?: Identifier): this;
  protected internalTable(...tables: Array<Falseable<Identifier>>): this;
  protected internalTableAliased(table: Falseable<Expression>, alias?: Identifier): this;
  protected internalTableSampled(table: Identifier, method: SampleMethod, percentage: number, alias?: Identifier): this;
  protected internalExpressions(target: Expression[], ...expressions: Array<Falseable<Expression>>): this;
  protected internalWhere(...expressions: Array<Falseable<Expression>>): this;
  protected internalLimit(limit: Falseable<Expression> | number, offset?: Falseable<Expression> | number): this;
  protected internalOffset(offset: Falseable<Expression> | number): this;
  protected internalReturning(...expressions: Expression[]): this;
  protected generateFromOperation(operations: Operation[]): void;
  protected generateJoinOperations(operations: Operation[]): void;
  protected generateSetOperation(operations: Operation[]): void;
  protected generateWhereOperation(operations: Operation[]): void;
  protected generateLimitOperation(operations: Operation[]): void;
  protected generateOffsetOperation(operations: Operation[]): void;
  protected generateReturningOperation(operations: Operation[]): void;
  abstract getOperations(): Operation[];
}
//#endregion
//#region src/types/AggregateFunction.d.ts
type AggregateFunction = "ANY_VALUE" | "ARRAY_AGG" | "AVG" | "BIT_AND" | "BIT_OR" | "BIT_XOR" | "BOOL_AND" | "BOOL_OR" | "COUNT" | "EVERY" | "JSON_AGG_STRICT" | "JSON_AGG" | "JSON_OBJECT_AGG_STRICT" | "JSON_OBJECT_AGG_UNIQUE_STRICT" | "JSON_OBJECT_AGG_UNIQUE" | "JSON_OBJECT_AGG" | "JSONB_AGG_STRICT" | "JSONB_AGG" | "JSONB_OBJECT_AGG_STRICT" | "JSONB_OBJECT_AGG_UNIQUE_STRICT" | "JSONB_OBJECT_AGG_UNIQUE" | "JSONB_OBJECT_AGG" | "MAX" | "MIN" | "RANGE_AGG" | "RANGE_INTERSECT_AGG" | "STRING_AGG" | "SUM" | "XMLAGG" | "CORR" | "COVAR_POP" | "COVAR_SAMP" | "REGR_AVGX" | "REGR_AVGY" | "REGR_COUNT" | "REGR_INTERCEPT" | "REGR_R2" | "REGR_SLOPE" | "REGR_SXX" | "REGR_SXY" | "REGR_SYY" | "STDDEV_POP" | "STDDEV_SAMP" | "STDDEV" | "VAR_POP" | "VAR_SAMP" | "VARIANCE" | (string & {});
//#endregion
//#region src/types/Order.d.ts
type OrderDirection = "ASC" | "DESC";
type OrderNulls = "NULLS FIRST" | "NULLS LAST";
//#endregion
//#region src/BuilderAggregate.d.ts
declare class BuilderAggregate extends Builder {
  private readonly identifier;
  private selectDistinct;
  private readonly expressions;
  private readonly orders;
  private readonly filterWhereExpressions;
  constructor(identifier: AggregateFunction, ...expressions: Expression[]);
  distinct(mode?: boolean): this;
  orderBy(expression: Expression, direction?: OrderDirection, nulls?: OrderNulls): this;
  filterWhere(...expressions: Array<Falseable<Expression>>): this;
  getOperations(): Operation[];
}
//#endregion
//#region src/BuilderCase.d.ts
declare class BuilderCase extends Builder {
  private readonly expression?;
  private readonly whens;
  private expressionElse?;
  constructor(expression?: Expression | undefined);
  when(expression: Expression, then: Expression): this;
  else(expression: Expression): this;
  getOperations(): Operation[];
}
//#endregion
//#region src/BuilderConflict.d.ts
declare class BuilderConflict extends Builder {
  private readonly conflictWhereExpression?;
  private conflictDoNothing;
  constructor(columns?: Identifier[], where?: Expression);
  doNothing(): this;
  set(identifier: Identifier, expression: Expression): this;
  where(...args: Parameters<Builder["internalWhere"]>): this;
  getOperations(): Operation[];
}
//#endregion
//#region src/BuilderDelete.d.ts
declare class BuilderDelete extends Builder {
  constructor(table: Identifier);
  where(...args: Parameters<Builder["internalWhere"]>): this;
  limit(...args: Parameters<Builder["internalLimit"]>): this;
  offset(...args: Parameters<Builder["internalOffset"]>): this;
  returning(...expressions: Expression[]): this;
  getOperations(): Operation[];
}
//#endregion
//#region src/BuilderInsert.d.ts
declare class BuilderInsert extends Builder {
  private readonly onConflictBuilders;
  private selectQuery?;
  constructor(table: Identifier, columns: Identifier[]);
  select(query: Builder): this;
  values(...values: Expression[]): this;
  onConflict(conflict: Falseable<BuilderConflict>): this;
  onConflictIgnore(columns?: Identifier[], where?: Expression): this;
  returning(...expressions: Expression[]): this;
  getOperations(): Operation[];
}
//#endregion
//#region src/BuilderSelect.d.ts
declare class BuilderSelect extends Builder {
  private selectDistinct;
  private readonly orders;
  private readonly groupByColumns;
  private readonly havingExpressions;
  select(...args: Parameters<Builder["internalColumn"]>): this;
  selectAliased(...args: Parameters<Builder["internalColumnAliased"]>): this;
  distinct(mode?: boolean): this;
  from(...args: Parameters<Builder["internalTable"]>): this;
  fromAliased(...args: Parameters<Builder["internalTableAliased"]>): this;
  fromSampled(table: Identifier, method: SampleMethod, percentage: number): this;
  fromSampledAliased(table: Identifier, alias: Identifier, method: SampleMethod, percentage: number): this;
  where(...args: Parameters<Builder["internalWhere"]>): this;
  having(...expressions: Array<Falseable<Expression>>): this;
  limit(...args: Parameters<Builder["internalLimit"]>): this;
  offset(...args: Parameters<Builder["internalOffset"]>): this;
  groupBy(...expressions: Array<Falseable<Expression>>): this;
  orderBy(expression: Expression, direction?: OrderDirection, nulls?: OrderNulls): this;
  getOperations(): Operation[];
}
//#endregion
//#region src/BuilderSetOperation.d.ts
declare class BuilderSetOperation extends Builder {
  private readonly queries;
  private readonly operation;
  constructor(queries: Expression[], operation?: "EXCEPT" | "INTERSECT" | "UNION ALL" | "UNION");
  getOperations(): Operation[];
}
//#endregion
//#region src/BuilderUpdate.d.ts
declare class BuilderUpdate extends Builder {
  constructor(table: Identifier);
  set(identifier: Identifier, expression: Expression): this;
  where(...args: Parameters<Builder["internalWhere"]>): this;
  limit(...args: Parameters<Builder["internalLimit"]>): this;
  offset(...args: Parameters<Builder["internalOffset"]>): this;
  returning(...expressions: Expression[]): this;
  getOperations(): Operation[];
}
//#endregion
//#region src/supports/PostgresFunctions.d.ts
declare function call(identifier: string & {}, ...functionArguments: Expression[]): Expression;
declare function call(identifier: "NUM_NONNULLS", ...expressions: Expression[]): Expression;
declare function call(identifier: "NUM_NULLS", ...expressions: Expression[]): Expression;
declare function call(identifier: "ABS" | "CEIL" | "CEILING" | "EXP" | "FACTORIAL" | "FLOOR" | "LN" | "LOG" | "LOG10" | "MIN_SCALE" | "ROUND" | "SCALE" | "SETSEED" | "SIGN" | "SQRT" | "TRIM_SCALE" | "TRUNC", value: Expression): Expression;
declare function call(identifier: "ACOS" | "ACOSD" | "ACOSH" | "ASIN" | "ASIND" | "ASINH" | "ATAN" | "ATAND" | "ATANH" | "CBRT" | "COS" | "COSD" | "COSH" | "COT" | "COTD" | "DEGREES" | "ERF" | "ERFC" | "GAMMA" | "LGAMMA" | "RADIANS" | "SIN" | "SIND" | "SINH" | "TAN" | "TAND" | "TANH", x: Expression): Expression;
declare function call(identifier: "ATAN2" | "ATAN2D" | "DIV" | "MOD", y: Expression, x: Expression): Expression;
declare function call(identifier: "GCD" | "LCM" | "POW" | "POWER", a: Expression, b: Expression): Expression;
declare function call(identifier: "LOG", b: Expression, x: Expression): Expression;
declare function call(identifier: "PI" | "RANDOM_NORMAL" | "RANDOM"): Expression;
declare function call(identifier: "RANDOM", min: Expression, max: Expression): Expression;
declare function call(identifier: "RANDOM_NORMAL", mean: Expression): Expression;
declare function call(identifier: "RANDOM_NORMAL", mean: Expression, stddev: Expression): Expression;
declare function call(identifier: "ROUND" | "TRUNC", value: Expression, size: Expression): Expression;
declare function call(identifier: "WIDTH_BUCKET", operand: Expression, low: Expression, high: Expression, count: Expression): Expression;
declare function call(identifier: "WIDTH_BUCKET", operand: Expression, thresholds: Expression): Expression;
declare function call(identifier: "COALESCE", ...expressions: Expression[]): Expression;
declare function call(identifier: "GREATEST", ...expressions: Expression[]): Expression;
declare function call(identifier: "LEAST", ...expressions: Expression[]): Expression;
declare function call(identifier: "NULLIF", valueA: Expression, valueB: Expression): Expression;
declare function call(identifier: "ASCII", value: Expression): Expression;
declare function call(identifier: "BIT_LENGTH", value: Expression): Expression;
declare function call(identifier: "BTRIM", value: Expression): Expression;
declare function call(identifier: "BTRIM", value: Expression, characters: Expression): Expression;
declare function call(identifier: "CHAR_LENGTH" | "CHARACTER_LENGTH", value: Expression): Expression;
declare function call(identifier: "CHR", value: Expression): Expression;
declare function call(identifier: "CONCAT", ...values: Expression[]): Expression;
declare function call(identifier: "CONCAT_WS", separator: Expression, ...values: Expression[]): Expression;
declare function call(identifier: "FORMAT", formatstr: Expression, ...formatargs: Expression[]): Expression;
declare function call(identifier: "INITCAP", value: Expression): Expression;
declare function call(identifier: "LEFT", string: Expression, count: Expression): Expression;
declare function call(identifier: "LENGTH", value: Expression): Expression;
declare function call(identifier: "LPAD", string: Expression, length: Expression): Expression;
declare function call(identifier: "LPAD", string: Expression, length: Expression, fill: Expression): Expression;
declare function call(identifier: "LTRIM", value: Expression): Expression;
declare function call(identifier: "LTRIM", value: Expression, characters: Expression): Expression;
declare function call(identifier: "MD5", value: Expression): Expression;
declare function call(identifier: "OCTET_LENGTH", value: Expression): Expression;
declare function call(identifier: "OVERLAY", string: Expression, placing: Expression, from: Expression): Expression;
declare function call(identifier: "OVERLAY", string: Expression, placing: Expression, from: Expression, count: Expression): Expression;
declare function call(identifier: "POSITION", substring: Expression, string: Expression): Expression;
declare function call(identifier: "PG_CLIENT_ENCODING"): Expression;
declare function call(identifier: "QUOTE_IDENT", value: Expression): Expression;
declare function call(identifier: "QUOTE_LITERAL", value: Expression): Expression;
declare function call(identifier: "QUOTE_NULLABLE", value: Expression): Expression;
declare function call(identifier: "REGEXP_MATCH", string: Expression, pattern: Expression): Expression;
declare function call(identifier: "REGEXP_MATCH", string: Expression, pattern: Expression, flags: Expression): Expression;
declare function call(identifier: "REGEXP_REPLACE", string: Expression, pattern: Expression, replacement: Expression): Expression;
declare function call(identifier: "REGEXP_REPLACE", string: Expression, pattern: Expression, replacement: Expression, flags: Expression): Expression;
declare function call(identifier: "REGEXP_SPLIT_TO_ARRAY", string: Expression, pattern: Expression): Expression;
declare function call(identifier: "REGEXP_SPLIT_TO_ARRAY", string: Expression, pattern: Expression, flags: Expression): Expression;
declare function call(identifier: "REPEAT", string: Expression, number: Expression): Expression;
declare function call(identifier: "REPLACE", string: Expression, from: Expression, to: Expression): Expression;
declare function call(identifier: "REVERSE", value: Expression): Expression;
declare function call(identifier: "RIGHT", string: Expression, count: Expression): Expression;
declare function call(identifier: "RPAD", string: Expression, length: Expression): Expression;
declare function call(identifier: "RPAD", string: Expression, length: Expression, fill: Expression): Expression;
declare function call(identifier: "RTRIM", value: Expression): Expression;
declare function call(identifier: "RTRIM", value: Expression, characters: Expression): Expression;
declare function call(identifier: "SPLIT_PART", string: Expression, delimiter: Expression, field: Expression): Expression;
declare function call(identifier: "STARTS_WITH", string: Expression, prefix: Expression): Expression;
declare function call(identifier: "STRPOS", string: Expression, substring: Expression): Expression;
declare function call(identifier: "SUBSTR" | "SUBSTRING", value: Expression, from: Expression): Expression;
declare function call(identifier: "SUBSTR" | "SUBSTRING", value: Expression, from: Expression, count: Expression): Expression;
declare function call(identifier: "TO_ASCII", value: Expression): Expression;
declare function call(identifier: "TO_HEX", value: Expression): Expression;
declare function call(identifier: "TRANSLATE", string: Expression, from: Expression, to: Expression): Expression;
declare function call(identifier: "TRIM", value: Expression): Expression;
declare function call(identifier: "UNISTR", value: Expression): Expression;
declare function call(identifier: "LOWER" | "UPPER", value: Expression): Expression;
declare function call(identifier: "AGE", timestamp: Expression): Expression;
declare function call(identifier: "AGE", timestampA: Expression, timestampB: Expression): Expression;
declare function call(identifier: "CLOCK_TIMESTAMP"): Expression;
declare function call(identifier: "CURRENT_DATE"): Expression;
declare function call(identifier: "CURRENT_TIME"): Expression;
declare function call(identifier: "CURRENT_TIME", precision: Expression): Expression;
declare function call(identifier: "CURRENT_TIMESTAMP"): Expression;
declare function call(identifier: "CURRENT_TIMESTAMP", precision: Expression): Expression;
declare function call(identifier: "DATE_BIN", stride: Expression, source: Expression, origin: Expression): Expression;
declare function call(identifier: "DATE_PART", field: Expression, source: Expression): Expression;
declare function call(identifier: "DATE_TRUNC", field: Expression, source: Expression): Expression;
declare function call(identifier: "DATE_TRUNC", field: Expression, source: Expression, timezone: Expression): Expression;
declare function call(identifier: "EXTRACT", field: Expression, source: Expression): Expression;
declare function call(identifier: "ISFINITE", value: Expression): Expression;
declare function call(identifier: "JUSTIFY_DAYS" | "JUSTIFY_HOURS" | "JUSTIFY_INTERVAL", value: Expression): Expression;
declare function call(identifier: "LOCALTIME"): Expression;
declare function call(identifier: "LOCALTIME", precision: Expression): Expression;
declare function call(identifier: "LOCALTIMESTAMP"): Expression;
declare function call(identifier: "LOCALTIMESTAMP", precision: Expression): Expression;
declare function call(identifier: "MAKE_DATE", year: Expression, month: Expression, day: Expression): Expression;
declare function call(identifier: "MAKE_INTERVAL", ...values: Expression[]): Expression;
declare function call(identifier: "MAKE_TIME", hour: Expression, min: Expression, sec: Expression): Expression;
declare function call(identifier: "MAKE_TIMESTAMP", year: Expression, month: Expression, day: Expression, hour: Expression, min: Expression, sec: Expression): Expression;
declare function call(identifier: "MAKE_TIMESTAMPTZ", year: Expression, month: Expression, day: Expression, hour: Expression, min: Expression, sec: Expression): Expression;
declare function call(identifier: "MAKE_TIMESTAMPTZ", year: Expression, month: Expression, day: Expression, hour: Expression, min: Expression, sec: Expression, timezone: Expression): Expression;
declare function call(identifier: "NOW" | "STATEMENT_TIMESTAMP" | "TRANSACTION_TIMESTAMP"): Expression;
declare function call(identifier: "TIMEOFDAY"): Expression;
declare function call(identifier: "TO_CHAR", value: Expression, format: Expression): Expression;
declare function call(identifier: "TO_DATE", value: Expression, format: Expression): Expression;
declare function call(identifier: "TO_TIMESTAMP", value: Expression): Expression;
declare function call(identifier: "JSON_AGG" | "JSONB_AGG", value: Expression): Expression;
declare function call(identifier: "JSON_ARRAY_LENGTH" | "JSONB_ARRAY_LENGTH", json: Expression): Expression;
declare function call(identifier: "JSON_BUILD_ARRAY" | "JSONB_BUILD_ARRAY", ...values: Expression[]): Expression;
declare function call(identifier: "JSON_BUILD_OBJECT" | "JSONB_BUILD_OBJECT", ...values: Expression[]): Expression;
declare function call(identifier: "JSON_EACH" | "JSONB_EACH", json: Expression): Expression;
declare function call(identifier: "JSON_EACH_TEXT" | "JSONB_EACH_TEXT", json: Expression): Expression;
declare function call(identifier: "JSON_EXTRACT_PATH" | "JSONB_EXTRACT_PATH", fromJson: Expression, ...pathElements: Expression[]): Expression;
declare function call(identifier: "JSON_EXTRACT_PATH_TEXT" | "JSONB_EXTRACT_PATH_TEXT", fromJson: Expression, ...pathElements: Expression[]): Expression;
declare function call(identifier: "JSON_OBJECT_AGG" | "JSONB_OBJECT_AGG", key: Expression, value: Expression): Expression;
declare function call(identifier: "JSON_OBJECT_KEYS" | "JSONB_OBJECT_KEYS", json: Expression): Expression;
declare function call(identifier: "JSON_PRETTY" | "JSONB_PRETTY", json: Expression): Expression;
declare function call(identifier: "JSONB_SET", target: Expression, path: Expression, newValue: Expression): Expression;
declare function call(identifier: "JSONB_SET", target: Expression, path: Expression, newValue: Expression, createIfMissing: Expression): Expression;
declare function call(identifier: "JSON_STRIP_NULLS" | "JSONB_STRIP_NULLS", target: Expression): Expression;
declare function call(identifier: "JSON_STRIP_NULLS" | "JSONB_STRIP_NULLS", target: Expression, stripInArrays: Expression): Expression;
declare function call(identifier: "JSON_TYPEOF" | "JSONB_TYPEOF", json: Expression): Expression;
declare function call(identifier: "TO_JSON" | "TO_JSONB", value: Expression): Expression;
declare function call(identifier: "JSONB_INSERT", target: Expression, path: Expression, newValue: Expression): Expression;
declare function call(identifier: "JSONB_INSERT", target: Expression, path: Expression, newValue: Expression, insertAfter: Expression): Expression;
declare function call(identifier: "JSONB_PATH_EXISTS", target: Expression, path: Expression): Expression;
declare function call(identifier: "JSONB_PATH_MATCH", target: Expression, path: Expression): Expression;
declare function call(identifier: "JSONB_PATH_QUERY", target: Expression, path: Expression): Expression;
declare function call(identifier: "JSONB_PATH_QUERY_ARRAY" | "JSONB_PATH_QUERY_FIRST", target: Expression, path: Expression): Expression;
declare function call(identifier: "JSONB_SET_LAX", target: Expression, path: Expression, newValue: Expression): Expression;
declare function call(identifier: "JSONB_SET_LAX", target: Expression, path: Expression, newValue: Expression, createIfMissing: Expression): Expression;
declare function call(identifier: "ANY_VALUE", value: Expression): Expression;
declare function call(identifier: "ARRAY_AGG", value: Expression): Expression;
declare function call(identifier: "AVG", value: Expression): Expression;
declare function call(identifier: "BIT_AND" | "BIT_OR" | "BIT_XOR", value: Expression): Expression;
declare function call(identifier: "BOOL_AND" | "BOOL_OR" | "EVERY", value: Expression): Expression;
declare function call(identifier: "COUNT", value: Expression): Expression;
declare function call(identifier: "COUNT"): Expression;
declare function call(identifier: "MAX" | "MIN", value: Expression): Expression;
declare function call(identifier: "STRING_AGG", value: Expression, delimiter: Expression): Expression;
declare function call(identifier: "SUM", value: Expression): Expression;
declare function call(identifier: "ARRAY_APPEND", array: Expression, element: Expression): Expression;
declare function call(identifier: "ARRAY_CAT", arrayA: Expression, arrayB: Expression): Expression;
declare function call(identifier: "ARRAY_DIMS", array: Expression): Expression;
declare function call(identifier: "ARRAY_FILL", value: Expression, dims: Expression): Expression;
declare function call(identifier: "ARRAY_LENGTH", array: Expression, dim: Expression): Expression;
declare function call(identifier: "ARRAY_LOWER" | "ARRAY_UPPER", array: Expression, dim: Expression): Expression;
declare function call(identifier: "ARRAY_NDIMS", array: Expression): Expression;
declare function call(identifier: "ARRAY_POSITION", array: Expression, element: Expression): Expression;
declare function call(identifier: "ARRAY_POSITIONS", array: Expression, element: Expression): Expression;
declare function call(identifier: "ARRAY_PREPEND", element: Expression, array: Expression): Expression;
declare function call(identifier: "ARRAY_REMOVE", array: Expression, element: Expression): Expression;
declare function call(identifier: "ARRAY_REPLACE", array: Expression, from: Expression, to: Expression): Expression;
declare function call(identifier: "ARRAY_TO_STRING", array: Expression, delimiter: Expression): Expression;
declare function call(identifier: "ARRAY_TO_STRING", array: Expression, delimiter: Expression, nullString: Expression): Expression;
declare function call(identifier: "CARDINALITY", array: Expression): Expression;
declare function call(identifier: "STRING_TO_ARRAY", string: Expression, delimiter: Expression): Expression;
declare function call(identifier: "STRING_TO_ARRAY", string: Expression, delimiter: Expression, nullString: Expression): Expression;
declare function call(identifier: "UNNEST", array: Expression): Expression;
declare function call(identifier: "CURRENT_CATALOG" | "CURRENT_DATABASE" | "CURRENT_ROLE" | "CURRENT_SCHEMA" | "CURRENT_USER" | "USER"): Expression;
declare function call(identifier: "CURRENT_QUERY"): Expression;
declare function call(identifier: "CURRENT_SCHEMAS", includeImplicit: Expression): Expression;
declare function call(identifier: "FORMAT_TYPE", typeOid: Expression, typemod: Expression): Expression;
declare function call(identifier: "PG_BACKEND_PID"): Expression;
declare function call(identifier: "PG_BLOCKING_PIDS", pid: Expression): Expression;
declare function call(identifier: "PG_CANCEL_BACKEND", pid: Expression): Expression;
declare function call(identifier: "PG_CONF_LOAD_TIME"): Expression;
declare function call(identifier: "PG_GET_KEYWORDS"): Expression;
declare function call(identifier: "PG_INDEXES_SIZE", reloid: Expression): Expression;
declare function call(identifier: "PG_MY_TEMP_SCHEMA"): Expression;
declare function call(identifier: "PG_RELOAD_CONF"): Expression;
declare function call(identifier: "PG_SIZE_PRETTY", size: Expression): Expression;
declare function call(identifier: "PG_SLEEP", seconds: Expression): Expression;
declare function call(identifier: "PG_TABLE_IS_VISIBLE", reloid: Expression): Expression;
declare function call(identifier: "PG_TABLE_SIZE" | "PG_TABLESPACE_SIZE" | "PG_TOTAL_RELATION_SIZE", reloid: Expression): Expression;
declare function call(identifier: "PG_TRIGGER_DEPTH"): Expression;
declare function call(identifier: "VERSION"): Expression;
//#endregion
//#region src/index.d.ts
declare const functions: {
  aggregate(identifier: AggregateFunction, ...expressions: Expression[]): BuilderAggregate;
  all(sideA: Expression, operator: ComparisonOperator, sideB: Expression): Expression;
  and(...expressions: Array<Falseable<Expression>>): Expression;
  any(sideA: Expression, operator: ComparisonOperator, sideB: Expression): Expression;
  arrayOverlap(sideA: Expression, sideB: Expression): Expression;
  between(identifier: Identifier, from: Expression, to: Expression): Expression;
  betweenSymmetric(identifier: Identifier, from: Expression, to: Expression): Expression;
  call: typeof call;
  case(expression?: Expression): BuilderCase;
  cast(expression: Expression, castType: Cast): Expression;
  collate(expression: Expression, collateType?: Collate): Expression;
  concatOp(sideA: Expression, sideB: Expression): Expression;
  containedBy(sideA: Expression, sideB: Expression): Expression;
  contains(sideA: Expression, sideB: Expression): Expression;
  delete(table: Identifier): BuilderDelete;
  eq(sideA: Expression, sideB: Expression): Expression;
  exists(builder: Builder): Expression;
  gt(sideA: Expression, sideB: Expression): Expression;
  gte(sideA: Expression, sideB: Expression): Expression;
  isNull(identifier: Identifier): Expression;
  isTrue(expression: Expression): Expression;
  isFalse(expression: Expression): Expression;
  isUnknown(expression: Expression): Expression;
  isDistinctFrom(expressionA: Expression, expressionB: Expression): Expression;
  in(identifier: Identifier, ...values: Expression[]): Expression;
  ilike(identifier: Identifier, pattern: Expression): Expression;
  insert(table: Identifier, columns: Identifier[]): BuilderInsert;
  isNotNull(identifier: Identifier): Expression;
  jsonValue(argument: JsonValue, nullAsSQL?: boolean): Expression;
  jsonStaticValue(argument: JsonValue, nullAsSQL?: boolean): Expression;
  jsonExists(sideA: Expression, sideB: Expression): Expression;
  jsonExistsAll(sideA: Expression, sideB: Expression): Expression;
  jsonExistsAny(sideA: Expression, sideB: Expression): Expression;
  jsonGet(sideA: Expression, sideB: Expression): Expression;
  jsonGetPath(sideA: Expression, sideB: Expression): Expression;
  jsonGetPathText(sideA: Expression, sideB: Expression): Expression;
  jsonGetText(sideA: Expression, sideB: Expression): Expression;
  like(identifier: Identifier, pattern: Expression): Expression;
  lt(sideA: Expression, sideB: Expression): Expression;
  lte(sideA: Expression, sideB: Expression): Expression;
  neq(sideA: Expression, sideB: Expression): Expression;
  not(expression: Expression): Expression;
  notBetween(identifier: Identifier, from: Expression, to: Expression): Expression;
  or(...expressions: Array<Falseable<Expression>>): Expression;
  raw(expression: string): Expression;
  select(...columns: Array<Falseable<Expression>>): BuilderSelect;
  staticValue(argument: ValueExtended): Expression;
  union(...queries: Expression[]): BuilderSetOperation;
  unionAll(...queries: Expression[]): BuilderSetOperation;
  intersect(...queries: Expression[]): BuilderSetOperation;
  except(...queries: Expression[]): BuilderSetOperation;
  update(table: Identifier): BuilderUpdate;
  conflict(columns?: Identifier[], where?: Expression): BuilderConflict;
  excluded(identifier: Identifier): Expression;
  value(argument: Value): Expression;
  op(operator: MathOperator, expressionA: Expression, expressionB: Expression): Expression;
  opUnary(operator: UnaryOperator, expression: Expression): Expression;
  sum(expressionA: Expression, expressionB: Expression): Expression;
  sub(expressionA: Expression, expressionB: Expression): Expression;
  mul(expressionA: Expression, expressionB: Expression): Expression;
  div(expressionA: Expression, expressionB: Expression): Expression;
  mod(expressionA: Expression, expressionB: Expression): Expression;
  pow(expressionA: Expression, expressionB: Expression): Expression;
};
//#endregion
export { functions as default };