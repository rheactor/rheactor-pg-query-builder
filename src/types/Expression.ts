import type { Builder } from "#/Builder";
import type { Cast } from "#/types/Cast";
import type { Collate } from "#/types/Collate";
import type { Falseable } from "#/types/Falseable";
import type { Identifier } from "#/types/Identifier";
import type { JsonValue } from "#/types/JsonValue";
import type { Value } from "#/types/Value";
import type { ValueExtended } from "#/types/ValueExtended";

export type MathOperator = "-" | "*" | "/" | "%" | "^" | "+";

export type ComparisonOperator = "!=" | "<" | "<=" | "=" | ">" | ">=";

type JsonOperator = "->" | "->>" | "?" | "?&" | "?|" | "#>" | "#>>";

type ContainmentOperator = "@>" | "<@";

type ArrayConcatOperator = "&&" | "||";

type LogicalOperator = "AND" | "OR";

export type Expression =
  | Builder
  | Identifier
  | {
      type: "BETWEEN";
      identifier: Identifier;
      from: Expression;
      to: Expression;
    }
  | {
      type: "ILIKE" | "LIKE" | "SET";
      identifier: Identifier;
      expression: Expression;
    }
  | {
      type: "OPERATOR";
      operator: MathOperator;
      expressionA: Expression;
      expressionB: Expression;
    }
  | {
      type: LogicalOperator;
      expressions: Array<Falseable<Expression>>;
      includeParens?: boolean;
    }
  | { type: "ALL" | "ANY"; operator: ComparisonOperator; sideA: Expression; sideB: Expression }
  | { type: "CALL"; identifier: Identifier; functionArguments: Expression[] }
  | { type: "CAST"; expression: Expression; cast: Cast }
  | { type: "COLLATE"; expression: Expression; collate: Collate }
  | { type: "EXCLUDED"; identifier: Identifier }
  | { type: "EXISTS"; builder: Builder }
  | { type: "IDENTIFIER"; identifier: Expression; alias?: Identifier }
  | { type: "IN"; identifier: Identifier; values: Expression[] }
  | { type: "IS NULL"; identifier: Identifier }
  | { type: "JSON"; argument: JsonValue }
  | { type: "NOT"; expression: Expression }
  | { type: "RAW"; expression: string }
  | { type: "STATIC"; argument: ValueExtended }
  | { type: "VALUE"; argument: Value }
  | { type: ArrayConcatOperator; sideA: Expression; sideB: Expression }
  | { type: ComparisonOperator; sideA: Expression; sideB: Expression }
  | { type: ContainmentOperator; sideA: Expression; sideB: Expression }
  | { type: JsonOperator; sideA: Expression; sideB: Expression };
