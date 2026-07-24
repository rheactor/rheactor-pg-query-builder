import type { Expression } from "#/types/Expression";
import type { Operation } from "#/types/Operation";

import { Builder } from "#/Builder";
import { isFalseable } from "#/services/FalseableService";

export function joinOperations(operations: Operation[][], joiner: string, includeParens: boolean) {
  const joinedOperations: Operation[] = [];

  for (const innerOperations of operations) {
    if (innerOperations.length > 0) {
      if (joinedOperations.length > 0) {
        joinedOperations.push(joiner);
      }

      joinedOperations.push(...innerOperations);
    }
  }

  return includeParens ? ["(", ...joinedOperations, ")"] : joinedOperations;
}

export function operation(expression: Expression): Operation[] {
  if (typeof expression === "string") {
    if (expression === "*") {
      return ["*"];
    }

    if (expression.includes(".")) {
      const [table, column] = expression.split(".", 2);

      return [...operation(table!), ".", ...operation(column! || "*")];
    }

    const identifier = expression.replaceAll(/["\\`]/g, "");

    return [`"${identifier}"`];
  }

  if (expression instanceof Builder) {
    const operations = expression.getOperations();
    const operationsLatest = operations.at(-1);

    if (typeof operationsLatest === "string") {
      operations[operations.length - 1] = operationsLatest.trimEnd();
    }

    return operations;
  }

  switch (expression.type) {
    case "=":
    case "!=":
    case ">":
    case ">=":
    case "<":
    case "<=":
    case "->":
    case "->>":
    case "#>":
    case "#>>":
    case "?":
    case "?|":
    case "?&":
    case "@>":
    case "<@":
    case "&&":
    case "||": {
      return [
        ...operation(expression.sideA),
        ` ${expression.type} `,
        ...operation(expression.sideB),
      ];
    }

    case "ANY":
    case "ALL": {
      const sideBOperations = operation(expression.sideB);
      const isSubquery = expression.sideB instanceof Builder;

      return [
        ...operation(expression.sideA),
        ` ${expression.operator} ${expression.type} `,
        ...(isSubquery ? ["(", ...sideBOperations, ")"] : sideBOperations),
      ];
    }

    case "IDENTIFIER": {
      return expression.alias === undefined
        ? operation(expression.identifier)
        : [...operation(expression.identifier), " AS ", ...operation(expression.alias)];
    }

    case "EXCLUDED": {
      return ['"EXCLUDED".', ...operation(expression.identifier)];
    }

    case "AND":
    case "OR": {
      const operations: Operation[][] = [];

      for (const alternative of expression.expressions) {
        if (!isFalseable(alternative)) {
          operations.push(operation(alternative));
        }
      }

      return joinOperations(
        operations,
        ` ${expression.type} `,
        operations.length > 1 && expression.includeParens !== false,
      );
    }

    case "VALUE": {
      if (typeof expression.argument === "string" || typeof expression.argument === "number") {
        return [{ value: expression.argument }];
      }

      if (typeof expression.argument === "boolean") {
        return [{ value: Number(expression.argument) }];
      }

      return [{ value: null }];
    }

    case "IN": {
      return [
        ...operation(expression.identifier),
        " IN (",
        ...joinOperations(
          expression.values.map((value) => operation(value)),
          ", ",
          false,
        ),
        ")",
      ];
    }

    case "IS NULL": {
      return [...operation(expression.identifier), " IS NULL"];
    }

    case "LIKE":
    case "ILIKE": {
      return [
        ...operation(expression.identifier),
        " ",
        expression.type,
        " ",
        ...operation(expression.expression),
      ];
    }

    case "BETWEEN": {
      return [
        ...operation(expression.identifier),
        " BETWEEN ",
        ...operation(expression.from),
        " AND ",
        ...operation(expression.to),
      ];
    }

    case "COLLATE": {
      return [...operation(expression.expression), ` COLLATE ${expression.collate}`];
    }

    case "CAST": {
      return ["CAST(", ...operation(expression.expression), ` AS ${expression.cast})`];
    }

    case "RAW": {
      return [expression.expression];
    }

    case "JSON": {
      return [{ value: JSON.stringify(expression.argument) }];
    }

    case "STATIC": {
      return expression.argument === null
        ? ["NULL"]
        : expression.argument === true
          ? ["TRUE"]
          : expression.argument === false
            ? ["FALSE"]
            : typeof expression.argument === "number" || typeof expression.argument === "bigint"
              ? [expression.argument.toString()]
              : [`"${expression.argument.replaceAll('"', '""')}"`];
    }

    case "CALL": {
      return [
        expression.identifier,
        ...joinOperations(
          expression.functionArguments.map((argument) => operation(argument)),
          ", ",
          true,
        ),
      ];
    }

    case "NOT": {
      return ["NOT ", ...operation(expression.expression)];
    }

    case "EXISTS": {
      return ["EXISTS (", ...operation(expression.builder), ")"];
    }

    case "SET": {
      return [...operation(expression.identifier), " = ", ...operation(expression.expression)];
    }

    case "OPERATOR":
    default: {
      return [
        "(",
        ...operation(expression.expressionA),
        ` ${expression.operator} `,
        ...operation(expression.expressionB),
        ")",
      ];
    }
  }
}
