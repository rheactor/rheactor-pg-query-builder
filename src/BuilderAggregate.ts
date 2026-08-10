import { Builder } from "#/Builder";
import { joinOperations, operation } from "#/services/OperationService";
import type { AggregateFunction } from "#/types/AggregateFunction";
import type { Expression } from "#/types/Expression";
import type { Operation } from "#/types/Operation";
import type { OrderDirection, OrderNulls } from "#/types/Order";

interface Order {
  expression: Expression;
  direction?: OrderDirection;
  nulls?: OrderNulls;
}

export class BuilderAggregate extends Builder {
  private readonly expressions: Expression[];

  private readonly orders: Order[] = [];

  public constructor(
    private readonly identifier: AggregateFunction,
    ...expressions: Expression[]
  ) {
    super();

    this.expressions = expressions;
  }

  public orderBy(expression: Expression, direction?: OrderDirection, nulls?: OrderNulls) {
    this.orders.push({ expression, direction, nulls });

    return this;
  }

  public override getOperations() {
    const operations: Operation[] = [
      this.identifier,
      "(",
      ...joinOperations(
        this.expressions.map((argument) => operation(argument)),
        ", ",
        false,
      ),
    ];

    if (this.orders.length > 0) {
      operations.push(
        " ORDER BY ",
        ...joinOperations(
          this.orders.map((order) => [
            ...operation(order.expression),
            ...(order.direction ? [` ${order.direction}`] : []),
            ...(order.nulls ? [` ${order.nulls}`] : []),
          ]),
          ", ",
          false,
        ),
      );
    }

    operations.push(")");

    return operations;
  }
}
