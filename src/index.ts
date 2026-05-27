import type { Builder } from "@/Builder.js";
import type { Cast } from "@/types/Cast.js";
import type { Collate } from "@/types/Collate.js";
import type { ComparisonOperator, Expression, MathOperator } from "@/types/Expression.js";
import type { Falseable } from "@/types/Falseable.js";
import type { Identifier } from "@/types/Identifier.js";
import type { JsonValue } from "@/types/JsonValue.js";
import type { Value } from "@/types/Value.js";
import type { ValueExtended } from "@/types/ValueExtended.js";

import { BuilderCase } from "@/BuilderCase";
import { BuilderConflict } from "@/BuilderConflict";
import { BuilderDelete } from "@/BuilderDelete";
import { BuilderInsert } from "@/BuilderInsert";
import { BuilderSelect } from "@/BuilderSelect";
import { BuilderSetOperation } from "@/BuilderSetOperation";
import { BuilderUpdate } from "@/BuilderUpdate";
import { call, customCall } from "@/supports/PostgresFunctions";

const functions = {
  and(...expressions: Array<Falseable<Expression>>): Expression {
    return { type: "AND", expressions };
  },

  all(sideA: Expression, operator: ComparisonOperator, sideB: Expression): Expression {
    return { type: "ALL", operator, sideA, sideB };
  },

  any(sideA: Expression, operator: ComparisonOperator, sideB: Expression): Expression {
    return { type: "ANY", operator, sideA, sideB };
  },

  arrayOverlap(sideA: Expression, sideB: Expression): Expression {
    return { type: "&&", sideA, sideB };
  },

  between(identifier: Identifier, from: Expression, to: Expression): Expression {
    return { type: "BETWEEN", identifier, from, to };
  },

  call,

  case(expression?: Expression) {
    return new BuilderCase(expression);
  },

  cast(expression: Expression, castType: Cast): Expression {
    return { type: "CAST", expression, cast: castType };
  },

  collate(expression: Expression, collateType: Collate = "C"): Expression {
    return { type: "COLLATE", expression, collate: collateType };
  },

  concatOp(sideA: Expression, sideB: Expression): Expression {
    return { type: "||", sideA, sideB };
  },

  containedBy(sideA: Expression, sideB: Expression): Expression {
    return { type: "<@", sideA, sideB };
  },

  contains(sideA: Expression, sideB: Expression): Expression {
    return { type: "@>", sideA, sideB };
  },

  customCall,

  delete(table: Identifier) {
    return new BuilderDelete(table);
  },

  eq(sideA: Expression, sideB: Expression): Expression {
    return { type: "=", sideA, sideB };
  },

  exists(builder: Builder): Expression {
    return { type: "EXISTS", builder };
  },

  gt(sideA: Expression, sideB: Expression): Expression {
    return { type: ">", sideA, sideB };
  },

  gte(sideA: Expression, sideB: Expression): Expression {
    return { type: ">=", sideA, sideB };
  },

  isNull(identifier: Identifier): Expression {
    return { type: "IS NULL", identifier };
  },

  in(identifier: Identifier, ...values: Expression[]): Expression {
    return { type: "IN", identifier, values };
  },

  ilike(identifier: Identifier, pattern: Expression): Expression {
    return { type: "ILIKE", identifier, expression: pattern };
  },

  insert(table: Identifier, columns: Identifier[]) {
    return new BuilderInsert(table, columns);
  },

  isNotNull(identifier: Identifier): Expression {
    return functions.not({ type: "IS NULL", identifier });
  },

  jsonValue(argument: JsonValue, nullAsSQL = false): Expression {
    return nullAsSQL && argument === null
      ? { type: "VALUE", argument }
      : { type: "JSON", argument };
  },

  jsonStaticValue(argument: JsonValue, nullAsSQL = false): Expression {
    return {
      type: "STATIC",
      argument: nullAsSQL && argument === null ? null : JSON.stringify(argument),
    };
  },

  jsonExists(sideA: Expression, sideB: Expression): Expression {
    return { type: "?", sideA, sideB };
  },

  jsonExistsAll(sideA: Expression, sideB: Expression): Expression {
    return { type: "?&", sideA, sideB };
  },

  jsonExistsAny(sideA: Expression, sideB: Expression): Expression {
    return { type: "?|", sideA, sideB };
  },

  jsonGet(sideA: Expression, sideB: Expression): Expression {
    return { type: "->", sideA, sideB };
  },

  jsonGetPath(sideA: Expression, sideB: Expression): Expression {
    return { type: "#>", sideA, sideB };
  },

  jsonGetPathText(sideA: Expression, sideB: Expression): Expression {
    return { type: "#>>", sideA, sideB };
  },

  jsonGetText(sideA: Expression, sideB: Expression): Expression {
    return { type: "->>", sideA, sideB };
  },

  like(identifier: Identifier, pattern: Expression): Expression {
    return { type: "LIKE", identifier, expression: pattern };
  },

  lt(sideA: Expression, sideB: Expression): Expression {
    return { type: "<", sideA, sideB };
  },

  lte(sideA: Expression, sideB: Expression): Expression {
    return { type: "<=", sideA, sideB };
  },

  neq(sideA: Expression, sideB: Expression): Expression {
    return { type: "!=", sideA, sideB };
  },

  not(expression: Expression): Expression {
    return { type: "NOT", expression };
  },

  notBetween(identifier: Identifier, from: Expression, to: Expression): Expression {
    return functions.not({ type: "BETWEEN", identifier, from, to });
  },

  or(...expressions: Array<Falseable<Expression>>): Expression {
    return { type: "OR", expressions };
  },

  raw(expression: string): Expression {
    return { type: "RAW", expression };
  },

  select(...columns: Array<Falseable<Expression>>) {
    return new BuilderSelect().select(...columns);
  },

  staticValue(argument: ValueExtended): Expression {
    return { type: "STATIC", argument };
  },

  union(...queries: Expression[]): BuilderSetOperation {
    return new BuilderSetOperation(queries);
  },

  unionAll(...queries: Expression[]): BuilderSetOperation {
    return new BuilderSetOperation(queries, "UNION ALL");
  },

  intersect(...queries: Expression[]): BuilderSetOperation {
    return new BuilderSetOperation(queries, "INTERSECT");
  },

  except(...queries: Expression[]): BuilderSetOperation {
    return new BuilderSetOperation(queries, "EXCEPT");
  },

  update(table: Identifier) {
    return new BuilderUpdate(table);
  },

  conflict(columns?: Identifier[], where?: Expression) {
    return new BuilderConflict(columns, where);
  },

  excluded(identifier: Identifier): Expression {
    return { type: "EXCLUDED", identifier };
  },

  value(argument: Value): Expression {
    return { type: "VALUE", argument };
  },

  op(operator: MathOperator, expressionA: Expression, expressionB: Expression): Expression {
    return { type: "OPERATOR", operator, expressionA, expressionB };
  },

  sum(expressionA: Expression, expressionB: Expression) {
    return functions.op("+", expressionA, expressionB);
  },

  sub(expressionA: Expression, expressionB: Expression) {
    return functions.op("-", expressionA, expressionB);
  },

  mul(expressionA: Expression, expressionB: Expression) {
    return functions.op("*", expressionA, expressionB);
  },

  div(expressionA: Expression, expressionB: Expression) {
    return functions.op("/", expressionA, expressionB);
  },

  mod(expressionA: Expression, expressionB: Expression) {
    return functions.op("%", expressionA, expressionB);
  },

  pow(expressionA: Expression, expressionB: Expression) {
    return functions.call("POW", expressionA, expressionB);
  },
};

export default functions;
