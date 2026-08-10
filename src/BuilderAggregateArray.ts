import { BuilderAggregateBase } from "#/BuilderAggregateBase";
import { operation } from "#/services/OperationService";
import type { Expression } from "#/types/Expression";
import type { Falseable } from "#/types/Falseable";
import type { JsonReturningType } from "#/types/JsonReturningType";
import type { Operation } from "#/types/Operation";
import type { OrderDirection, OrderNulls } from "#/types/Order";

export class BuilderAggregateArray extends BuilderAggregateBase {
  private absentNull = false;

  private returningType?: JsonReturningType;

  public constructor(private readonly expression: Expression) {
    super();
  }

  public override orderBy(expression: Expression, direction?: OrderDirection, nulls?: OrderNulls) {
    return super.orderBy(expression, direction, nulls);
  }

  public override filterWhere(...expressions: Array<Falseable<Expression>>) {
    return super.filterWhere(...expressions);
  }

  public absentOnNull(mode = true) {
    this.absentNull = mode;

    return this;
  }

  public returning(dataType: JsonReturningType) {
    this.returningType = dataType;

    return this;
  }

  public override getOperations() {
    const operations: Operation[] = ["JSON_ARRAYAGG(", ...operation(this.expression)];

    this.generateOrderByOperations(operations);

    if (this.absentNull) {
      operations.push(" ABSENT ON NULL");
    }

    if (this.returningType !== undefined) {
      operations.push(` RETURNING ${this.returningType}`);
    }

    operations.push(")");

    this.generateFilterWhereOperations(operations);

    return operations;
  }
}
