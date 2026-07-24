import { Builder } from "#/Builder";
import { operation } from "#/services/OperationService";

import type { Expression } from "#/types/Expression";
import type { Operation } from "#/types/Operation";

export class BuilderCase extends Builder {
  private readonly whens: Array<[when: Expression, then: Expression]> = [];

  private expressionElse?: Expression;

  public constructor(private readonly expression?: Expression) {
    super();
  }

  public when(expression: Expression, then: Expression) {
    this.whens.push([expression, then]);

    return this;
  }

  public else(expression: Expression) {
    this.expressionElse = expression;

    return this;
  }

  public override getOperations() {
    const operations: Operation[] = ["CASE "];

    if (this.expression !== undefined) {
      operations.push(...operation(this.expression), " ");
    }

    for (const [when, then] of this.whens) {
      operations.push("WHEN ", ...operation(when), " THEN ", ...operation(then), " ");
    }

    if (this.expressionElse !== undefined) {
      operations.push("ELSE ", ...operation(this.expressionElse), " ");
    }

    operations.push("END");

    return operations;
  }
}
