import { Builder } from "#/Builder";
import { joinOperations, operation } from "#/services/OperationService";
import type { Expression } from "#/types/Expression";
import type { Falseable } from "#/types/Falseable";
import type { Identifier } from "#/types/Identifier";
import type { Operation } from "#/types/Operation";
import type { SampleMethod } from "#/types/SampleMethod";

type OrderDirection = "ASC" | "DESC";
type OrderNulls = "NULLS FIRST" | "NULLS LAST";

interface Order {
  expression: Expression;
  direction?: OrderDirection;
  nulls?: OrderNulls;
}

export class BuilderSelect extends Builder {
  private selectDistinct = false;

  private readonly orders: Order[] = [];

  private readonly groupByColumns: Expression[] = [];

  private readonly havingExpressions: Expression[] = [];

  public select(...args: Parameters<Builder["internalColumn"]>) {
    return this.internalColumn(...args);
  }

  public selectAliased(...args: Parameters<Builder["internalColumnAliased"]>) {
    return this.internalColumnAliased(...args);
  }

  public distinct(mode = true) {
    this.selectDistinct = mode;

    return this;
  }

  public from(...args: Parameters<Builder["internalTable"]>) {
    return this.internalTable(...args);
  }

  public fromAliased(...args: Parameters<Builder["internalTableAliased"]>) {
    return this.internalTableAliased(...args);
  }

  public fromSampled(table: Identifier, method: SampleMethod, percentage: number) {
    return this.internalTableSampled(table, method, percentage);
  }

  public fromSampledAliased(
    table: Identifier,
    alias: Identifier,
    method: SampleMethod,
    percentage: number,
  ) {
    return this.internalTableSampled(table, method, percentage, alias);
  }

  public where(...args: Parameters<Builder["internalWhere"]>) {
    return this.internalWhere(...args);
  }

  public having(...expressions: Array<Falseable<Expression>>) {
    return this.internalExpressions(this.havingExpressions, ...expressions);
  }

  public limit(...args: Parameters<Builder["internalLimit"]>) {
    return this.internalLimit(...args);
  }

  public offset(...args: Parameters<Builder["internalOffset"]>) {
    return this.internalOffset(...args);
  }

  public groupBy(...expressions: Array<Falseable<Expression>>) {
    return this.internalExpressions(this.groupByColumns, ...expressions);
  }

  public orderBy(expression: Expression, direction?: OrderDirection, nulls?: OrderNulls) {
    this.orders.push({ expression, direction, nulls });

    return this;
  }

  public override getOperations() {
    const operations: Operation[] = ["SELECT "];

    if (this.selectDistinct) {
      operations.push("DISTINCT ");
    }

    if (this.columnsOperations.length === 0) {
      operations.push("TRUE ");
    } else {
      operations.push(...joinOperations(this.columnsOperations, ", ", false), " ");
    }

    this.generateFromOperation(operations);
    this.generateJoinOperations(operations);
    this.generateWhereOperation(operations);

    if (this.groupByColumns.length > 0) {
      operations.push(
        "GROUP BY ",
        ...joinOperations(
          this.groupByColumns.map((column) => operation(column)),
          ", ",
          false,
        ),
        " ",
      );
    }

    if (this.havingExpressions.length > 0) {
      operations.push(
        "HAVING ",
        ...operation({
          type: "AND",
          expressions: this.havingExpressions,
          includeParens: false,
        }),
        " ",
      );
    }

    if (this.orders.length > 0) {
      operations.push(
        "ORDER BY ",
        ...joinOperations(
          this.orders.map((order) => [
            ...operation(order.expression),
            ...(order.direction ? [` ${order.direction}`] : []),
            ...(order.nulls ? [` ${order.nulls}`] : []),
          ]),
          ", ",
          false,
        ),
        " ",
      );
    }

    this.generateLimitOperation(operations);
    this.generateOffsetOperation(operations);

    return operations;
  }
}
