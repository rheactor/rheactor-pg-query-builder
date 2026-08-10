import { Builder } from "#/Builder";
import { joinOperations, operation } from "#/services/OperationService";
import type { AggregateFunction } from "#/types/AggregateFunction";
import type { Expression } from "#/types/Expression";
import type { Falseable } from "#/types/Falseable";
import type { Operation } from "#/types/Operation";
import type { OrderDirection, OrderNulls } from "#/types/Order";

interface Order {
  expression: Expression;
  direction?: OrderDirection;
  nulls?: OrderNulls;
}

export class BuilderAggregate extends Builder {
  private selectDistinct = false;

  private readonly expressions: Expression[];

  private readonly orders: Order[] = [];

  private readonly filterWhereExpressions: Expression[] = [];

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

  public orderBy(expression: Expression, direction?: OrderDirection, nulls?: OrderNulls) {
    this.orders.push({ expression, direction, nulls });

    return this;
  }

  public filterWhere(...expressions: Array<Falseable<Expression>>) {
    return this.internalExpressions(this.filterWhereExpressions, ...expressions);
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

    return operations;
  }
}
