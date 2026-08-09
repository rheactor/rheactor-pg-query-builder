import { Builder } from "#/Builder";
import { joinOperations, operation } from "#/services/OperationService";
import type { Expression } from "#/types/Expression";
import type { Identifier } from "#/types/Identifier";
import type { Operation } from "#/types/Operation";

export class BuilderConflict extends Builder {
  private readonly conflictWhereExpression?: Expression;

  private conflictDoNothing = false;

  public constructor(columns: Identifier[] = [], where?: Expression) {
    super();

    this.internalColumn(...columns);
    this.conflictWhereExpression = where;
  }

  public doNothing() {
    this.conflictDoNothing = true;

    return this;
  }

  public set(identifier: Identifier, expression: Expression) {
    this.setsOperations.push(operation({ type: "SET", identifier, expression }));

    return this;
  }

  public where(...args: Parameters<Builder["internalWhere"]>) {
    return this.internalWhere(...args);
  }

  public override getOperations() {
    const operations: Operation[] = ["ON CONFLICT "];

    if (this.columnsOperations.length > 0) {
      operations.push(...joinOperations(this.columnsOperations, ", ", true), " ");
    }

    if (this.conflictWhereExpression !== undefined) {
      operations.push("WHERE ", ...operation(this.conflictWhereExpression), " ");
    }

    operations.push(this.conflictDoNothing ? "DO NOTHING" : "DO UPDATE ");

    this.generateSetOperation(operations);
    this.generateWhereOperation(operations);

    return operations;
  }
}
