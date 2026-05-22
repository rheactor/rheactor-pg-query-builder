import type { Builder } from "@/Builder.js";
import type { Cast } from "@/types/Cast.js";
import type { Collate } from "@/types/Collate.js";
import type { Falseable } from "@/types/Falseable.js";
import type { Identifier } from "@/types/Identifier.js";
import type { JsonValue } from "@/types/JsonValue.js";
import type { Value } from "@/types/Value.js";
import type { ValueExtended } from "@/types/ValueExtended.js";

export type MathOperator = "-" | "*" | "/" | "%" | "^" | "+";

type ComparisonOperator = "!=" | "<" | "<=" | "=" | ">" | ">=";

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
      type: "LIKE" | "SET";
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
  | { type: ComparisonOperator; sideA: Expression; sideB: Expression };
