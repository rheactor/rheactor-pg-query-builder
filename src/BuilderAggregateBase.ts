import { Builder } from "#/Builder";
import { joinOperations, operation } from "#/services/OperationService";
import type { Expression } from "#/types/Expression";
import type { Falseable } from "#/types/Falseable";
import type { Operation } from "#/types/Operation";
import type { Order, OrderDirection, OrderNulls } from "#/types/Order";

export abstract class BuilderAggregateBase extends Builder {
  protected readonly orders: Order[] = [];

  protected readonly filterWhereExpressions: Expression[] = [];

  protected orderBy(expression: Expression, direction?: OrderDirection, nulls?: OrderNulls) {
    this.orders.push({ expression, direction, nulls });

    return this;
  }

  protected filterWhere(...expressions: Array<Falseable<Expression>>) {
    return this.internalExpressions(this.filterWhereExpressions, ...expressions);
  }

  protected generateOrderByOperations(operations: Operation[]) {
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
  }

  protected generateFilterWhereOperations(operations: Operation[]) {
    if (this.filterWhereExpressions.length > 0) {
      operations.push(
        " FILTER (WHERE ",
        ...operation({
          type: "AND",
          expressions: this.filterWhereExpressions,
          includeParens: false,
        }),
        ")",
      );
    }
  }

  public abstract override getOperations(): Operation[];
}
