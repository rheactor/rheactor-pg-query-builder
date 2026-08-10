import { BuilderAggregateBase } from "#/BuilderAggregateBase";
import { operation } from "#/services/OperationService";
import type { Expression } from "#/types/Expression";
import type { Falseable } from "#/types/Falseable";
import type { JsonReturningType } from "#/types/JsonReturningType";
import type { Operation } from "#/types/Operation";

export class BuilderAggregateObject extends BuilderAggregateBase {
  private absentNull = false;

  private uniqueKeysValue?: boolean;

  private returningType?: JsonReturningType;

  public constructor(
    private readonly keyExpression: Expression,
    private readonly valueExpression: Expression,
  ) {
    super();
  }

  public override filterWhere(...expressions: Array<Falseable<Expression>>) {
    return super.filterWhere(...expressions);
  }

  public absentOnNull(mode = true) {
    this.absentNull = mode;

    return this;
  }

  public uniqueKeys(unique = true) {
    this.uniqueKeysValue = unique;

    return this;
  }

  public returning(dataType: JsonReturningType) {
    this.returningType = dataType;

    return this;
  }

  public override getOperations() {
    const operations: Operation[] = [
      "JSON_OBJECTAGG(",
      ...operation(this.keyExpression),
      " VALUE ",
      ...operation(this.valueExpression),
    ];

    if (this.absentNull) {
      operations.push(" ABSENT ON NULL");
    }

    if (this.uniqueKeysValue !== undefined) {
      operations.push(` ${this.uniqueKeysValue ? "WITH" : "WITHOUT"} UNIQUE KEYS`);
    }

    if (this.returningType !== undefined) {
      operations.push(` RETURNING ${this.returningType}`);
    }

    operations.push(")");

    this.generateFilterWhereOperations(operations);

    return operations;
  }
}
