import type { Builder } from "#/Builder";
import type { Cast } from "#/types/Cast";
import type { Collate } from "#/types/Collate";
import type { Falseable } from "#/types/Falseable";
import type { Identifier } from "#/types/Identifier";
import type { JsonValue } from "#/types/JsonValue";
import type { Value } from "#/types/Value";
import type { ValueExtended } from "#/types/ValueExtended";

export type MathOperator = "-" | "*" | "/" | "&" | "#" | "%" | "^" | "+" | "<<" | ">>" | "|";

export type UnaryOperator = "-" | "+" | "~";

export type ComparisonOperator = "!=" | "<" | "<=" | "=" | ">" | ">=";

type JsonOperator = "->" | "->>" | "?" | "?&" | "?|" | "#>" | "#>>";

type ContainmentOperator = "@>" | "<@";

type ArrayConcatOperator = "&&" | "||";

type LogicalOperator = "AND" | "OR";

export type Expression =
  | Builder
  | Identifier
  | {
      type: "BETWEEN SYMMETRIC" | "BETWEEN";
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
      type: "IS DISTINCT FROM";
      expressionA: Expression;
      expressionB: Expression;
    }
  | {
      type: "OPERATOR";
      operator: MathOperator;
      expressionA: Expression;
      expressionB: Expression;
    }
  | {
      type: "UNARY";
      operator: UnaryOperator;
      expression: Expression;
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
  | { type: "IS FALSE" | "IS TRUE" | "IS UNKNOWN" | "NOT"; expression: Expression }
  | { type: "IS NULL"; expression: Expression }
  | { type: "JSON"; argument: JsonValue }
  | { type: "RAW"; expression: string }
  | { type: "STATIC"; argument: ValueExtended }
  | { type: "VALUE"; argument: Value }
  | { type: ArrayConcatOperator; sideA: Expression; sideB: Expression }
  | { type: ComparisonOperator; sideA: Expression; sideB: Expression }
  | { type: ContainmentOperator; sideA: Expression; sideB: Expression }
  | { type: JsonOperator; sideA: Expression; sideB: Expression };
