import { joinOperations } from "#/services/OperationService";
import type { Operation } from "#/types/Operation";

import type { Expression } from "#/types/Expression";
import type { Identifier } from "#/types/Identifier";

import { Builder } from "#/Builder";

export class BuilderDelete extends Builder {
  public constructor(table: Identifier) {
    super();

    this.internalTable(table);
  }

  public where(...args: Parameters<Builder["internalWhere"]>) {
    return this.internalWhere(...args);
  }

  public limit(...args: Parameters<Builder["internalLimit"]>) {
    return this.internalLimit(...args);
  }

  public offset(...args: Parameters<Builder["internalOffset"]>) {
    return this.internalOffset(...args);
  }

  public returning(...expressions: Expression[]) {
    return this.internalReturning(...expressions);
  }

  public override getOperations() {
    const operations: Operation[] = [
      "DELETE FROM ",
      ...joinOperations(this.tablesOperations, ", ", false),
      " ",
    ];

    this.generateJoinOperations(operations);
    this.generateWhereOperation(operations);
    this.generateLimitOperation(operations);
    this.generateOffsetOperation(operations);
    this.generateReturningOperation(operations);

    return operations;
  }
}
