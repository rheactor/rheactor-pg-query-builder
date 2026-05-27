import type { Builder } from "../Builder";
import type { Expression } from "./Expression";
import type { Identifier } from "./Identifier";
export type JoinType = "CROSS" | "FULL OUTER" | "INNER" | "LEFT" | "RIGHT";
export interface JoinClause {
    type: JoinType;
    table: Builder | Identifier;
    alias: Identifier;
    conditions: Expression[];
    lateral?: boolean;
}
