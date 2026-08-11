import type { Builder } from "#/Builder";
import { BuilderAggregate } from "#/BuilderAggregate";
import { BuilderAggregateArray } from "#/BuilderAggregateArray";
import { BuilderAggregateObject } from "#/BuilderAggregateObject";
import { BuilderCase } from "#/BuilderCase";
import { BuilderConflict } from "#/BuilderConflict";
import { BuilderDelete } from "#/BuilderDelete";
import { BuilderInsert } from "#/BuilderInsert";
import { BuilderSelect } from "#/BuilderSelect";
import { BuilderSetOperation } from "#/BuilderSetOperation";
import { BuilderUpdate } from "#/BuilderUpdate";
import { call } from "#/supports/PostgresFunctions";
import type { AggregateFunction } from "#/types/AggregateFunction";
import type { Cast } from "#/types/Cast";
import type { Collate } from "#/types/Collate";
import type {
  ComparisonOperator,
  Expression,
  MathOperator,
  UnaryOperator,
} from "#/types/Expression";
import type { Falseable } from "#/types/Falseable";
import type { Identifier } from "#/types/Identifier";
import type { JsonValue } from "#/types/JsonValue";
import type { Value } from "#/types/Value";
import type { ValueExtended } from "#/types/ValueExtended";

const functions = {
  aggregate(identifier: AggregateFunction, ...expressions: Expression[]) {
    return new BuilderAggregate(identifier, ...expressions);
  },

  jsonArrayAggregate(expression: Expression) {
    return new BuilderAggregateArray(expression);
  },

  jsonObjectAggregate(key: Expression, value: Expression) {
    return new BuilderAggregateObject(key, value);
  },

  all(sideA: Expression, operator: ComparisonOperator, sideB: Expression): Expression {
    return { type: "ALL", operator, sideA, sideB };
  },

  and(...expressions: Array<Falseable<Expression>>): Expression {
    return { type: "AND", expressions };
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

  betweenSymmetric(identifier: Identifier, from: Expression, to: Expression): Expression {
    return { type: "BETWEEN SYMMETRIC", identifier, from, to };
  },

  call,

  case(expression?: Expression) {
    return new BuilderCase(expression);
  },

  cast(expression: Expression, ...casts: Cast[]): Expression {
    if (casts.length === 0) {
      return expression;
    }

    return { type: "CAST", expression, casts };
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

  isNull(expression: Expression): Expression {
    return { type: "IS NULL", expression };
  },

  isNotNull(expression: Expression): Expression {
    return functions.not({ type: "IS NULL", expression });
  },

  isTrue(expression: Expression): Expression {
    return { type: "IS TRUE", expression };
  },

  isFalse(expression: Expression): Expression {
    return { type: "IS FALSE", expression };
  },

  isUnknown(expression: Expression): Expression {
    return { type: "IS UNKNOWN", expression };
  },

  isDistinctFrom(expressionA: Expression, expressionB: Expression): Expression {
    return { type: "IS DISTINCT FROM", expressionA, expressionB };
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

  opUnary(operator: UnaryOperator, expression: Expression): Expression {
    return { type: "UNARY", operator, expression };
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
