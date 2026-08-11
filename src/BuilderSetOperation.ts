import { Builder } from "#/Builder";
import { operation as expressionOperation } from "#/services/OperationService";
import type { Expression } from "#/types/Expression";
import type { Operation } from "#/types/Operation";

export class BuilderSetOperation extends Builder {
  public constructor(
    private readonly queries: Expression[],
    private readonly operation: "EXCEPT" | "INTERSECT" | "UNION ALL" | "UNION" = "UNION",
  ) {
    super();
  }

  public getOperations(): Operation[] {
    const operations: Operation[] = [];

    for (const query of this.queries) {
      if (operations.length > 0) {
        operations.push(` ${this.operation} `);
      }

      operations.push(...expressionOperation(query));
    }

    return operations;
  }
}
