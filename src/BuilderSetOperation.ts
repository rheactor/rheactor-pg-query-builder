import { Builder } from "#/Builder";
import { operation } from "#/services/OperationService";
import type { Expression } from "#/types/Expression";
import type { Operation } from "#/types/Operation";

export class BuilderSetOperation extends Builder {
  public constructor(
    private readonly queries: Expression[],
    private readonly setOperation: "EXCEPT" | "INTERSECT" | "UNION ALL" | "UNION" = "UNION",
  ) {
    super();
  }

  public getOperations(): Operation[] {
    const operations: Operation[] = [];

    for (const query of this.queries) {
      if (operations.length > 0) {
        operations.push(` ${this.setOperation} `);
      }

      if (query instanceof BuilderSetOperation) {
        operations.push("(", ...operation(query), ")");
      } else {
        operations.push(...operation(query));
      }
    }

    return operations;
  }
}
