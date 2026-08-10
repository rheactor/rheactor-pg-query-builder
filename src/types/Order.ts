import type { Expression } from "#/types/Expression";

export type OrderDirection = "ASC" | "DESC";

export type OrderNulls = "NULLS FIRST" | "NULLS LAST";

export interface Order {
  expression: Expression;
  direction?: OrderDirection;
  nulls?: OrderNulls;
}
