import { Builder } from "#/Builder";
import { joinOperations, operation } from "#/services/OperationService";

import type { Expression } from "#/types/Expression";
import type { Identifier } from "#/types/Identifier";
import type { Operation } from "#/types/Operation";

export class BuilderUpdate extends Builder {
  public constructor(table: Identifier) {
    super();

    this.internalTable(table);
  }

  public set(identifier: Identifier, expression: Expression) {
    this.setsOperations.push(operation({ type: "SET", identifier, expression }));

    return this;
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
      "UPDATE ",
      ...joinOperations(this.tablesOperations, ", ", false),
      " ",
    ];

    this.generateJoinOperations(operations);
    this.generateSetOperation(operations);
    this.generateWhereOperation(operations);
    this.generateLimitOperation(operations);
    this.generateOffsetOperation(operations);
    this.generateReturningOperation(operations);

    return operations;
  }
}
