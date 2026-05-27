import type { Operation } from "./types/Operation.js";
import type { Expression } from "./types/Expression";
import type { Falseable } from "./types/Falseable";
import type { Identifier } from "./types/Identifier";
import type { SampleMethod } from "./types/SampleMethod";
import { Builder } from "./Builder";
type OrderDirection = "ASC" | "DESC";
type OrderNulls = "NULLS FIRST" | "NULLS LAST";
export declare class BuilderSelect extends Builder {
    private selectDistinct;
    private readonly orders;
    private readonly groupByColumns;
    private readonly havingExpressions;
    select(...args: Parameters<Builder["internalColumn"]>): this;
    selectAliased(...args: Parameters<Builder["internalColumnAliased"]>): this;
    distinct(mode?: boolean): this;
    from(...args: Parameters<Builder["internalTable"]>): this;
    fromAliased(...args: Parameters<Builder["internalTableAliased"]>): this;
    fromSampled(table: Identifier, method: SampleMethod, percentage: number): this;
    fromSampledAliased(table: Identifier, alias: Identifier, method: SampleMethod, percentage: number): this;
    where(...args: Parameters<Builder["internalWhere"]>): this;
    having(...expressions: Array<Falseable<Expression>>): this;
    limit(...args: Parameters<Builder["internalLimit"]>): this;
    offset(...args: Parameters<Builder["internalOffset"]>): this;
    groupBy(...expressions: Array<Falseable<Expression>>): this;
    orderBy(expression: Expression, direction?: OrderDirection, nulls?: OrderNulls): this;
    getOperations(): Operation[];
}
export {};
