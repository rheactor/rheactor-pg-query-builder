import { BuilderAggregateBase } from "#/BuilderAggregateBase";
import { joinOperations, operation } from "#/services/OperationService";
import type { AggregateFunction } from "#/types/AggregateFunction";
import type { Expression } from "#/types/Expression";
import type { Falseable } from "#/types/Falseable";
import type { Operation } from "#/types/Operation";
import type { OrderDirection, OrderNulls } from "#/types/Order";

export class BuilderAggregate extends BuilderAggregateBase {
  private selectDistinct = false;

  private readonly expressions: Expression[];

  public constructor(
    private readonly identifier: AggregateFunction,
    ...expressions: Expression[]
  ) {
    super();

    this.expressions = expressions;
  }

  public distinct(mode = true) {
    this.selectDistinct = mode;

    return this;
  }

  public override orderBy(expression: Expression, direction?: OrderDirection, nulls?: OrderNulls) {
    return super.orderBy(expression, direction, nulls);
  }

  public override filterWhere(...expressions: Array<Falseable<Expression>>) {
    return super.filterWhere(...expressions);
  }

  public override getOperations() {
    const operations: Operation[] = [
      this.identifier,
      "(",
      ...(this.selectDistinct ? ["DISTINCT "] : []),
      ...joinOperations(
        this.expressions.map((argument) => operation(argument)),
        ", ",
        false,
      ),
    ];

    this.generateOrderByOperations(operations);

    operations.push(")");

    this.generateFilterWhereOperations(operations);

    return operations;
  }
}
