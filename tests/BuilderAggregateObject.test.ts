import { describe, expect, it } from "vitest";

import type { Builder } from "#/Builder";
import sql from "#/index";
import type { Value } from "#/types/Value";

describe("class BuilderAggregateObject", () => {
  type Test = [builder: Builder, sql: string, args: Value[]];

  const tests: Test[] = [
    [sql.jsonObjectAggregate("k", "v"), 'JSON_OBJECTAGG("k" VALUE "v")', []],
    [
      sql.jsonObjectAggregate(sql.value("a"), sql.value(1)),
      "JSON_OBJECTAGG($1 VALUE $2)",
      ["a", 1],
    ],
    [
      sql.jsonObjectAggregate("k", sql.call("TO_JSONB", "v")),
      'JSON_OBJECTAGG("k" VALUE TO_JSONB("v"))',
      [],
    ],
    [
      sql.jsonObjectAggregate("k", "v").absentOnNull(),
      'JSON_OBJECTAGG("k" VALUE "v" ABSENT ON NULL)',
      [],
    ],
    [sql.jsonObjectAggregate("k", "v").absentOnNull(false), 'JSON_OBJECTAGG("k" VALUE "v")', []],
    [
      sql.jsonObjectAggregate("k", "v").uniqueKeys(),
      'JSON_OBJECTAGG("k" VALUE "v" WITH UNIQUE KEYS)',
      [],
    ],
    [
      sql.jsonObjectAggregate("k", "v").uniqueKeys(true),
      'JSON_OBJECTAGG("k" VALUE "v" WITH UNIQUE KEYS)',
      [],
    ],
    [
      sql.jsonObjectAggregate("k", "v").uniqueKeys(false),
      'JSON_OBJECTAGG("k" VALUE "v" WITHOUT UNIQUE KEYS)',
      [],
    ],
    [
      sql.jsonObjectAggregate("k", "v").returning("JSONB"),
      'JSON_OBJECTAGG("k" VALUE "v" RETURNING JSONB)',
      [],
    ],
    [
      sql.jsonObjectAggregate("k", "v").returning("BYTEA"),
      'JSON_OBJECTAGG("k" VALUE "v" RETURNING BYTEA)',
      [],
    ],
    [
      sql.jsonObjectAggregate("k", "v").absentOnNull().uniqueKeys(true).returning("JSONB"),
      'JSON_OBJECTAGG("k" VALUE "v" ABSENT ON NULL WITH UNIQUE KEYS RETURNING JSONB)',
      [],
    ],
    [
      sql.jsonObjectAggregate("k", "v").filterWhere(sql.eq("k", sql.value("a"))),
      'JSON_OBJECTAGG("k" VALUE "v") FILTER (WHERE "k" = $1)',
      ["a"],
    ],
    [
      sql
        .jsonObjectAggregate("k", "v")
        .uniqueKeys(false)
        .filterWhere(sql.eq("k", sql.value("a"))),
      'JSON_OBJECTAGG("k" VALUE "v" WITHOUT UNIQUE KEYS) FILTER (WHERE "k" = $1)',
      ["a"],
    ],
    [
      sql.jsonObjectAggregate("k", "v").conditional(true, (builder) => {
        builder.uniqueKeys();
      }),
      'JSON_OBJECTAGG("k" VALUE "v" WITH UNIQUE KEYS)',
      [],
    ],
    [
      sql
        .select(sql.jsonObjectAggregate("k", "v").absentOnNull().returning("JSONB"))
        .from("users")
        .groupBy("k", "v"),
      'SELECT JSON_OBJECTAGG("k" VALUE "v" ABSENT ON NULL RETURNING JSONB) FROM "users" GROUP BY "k", "v"',
      [],
    ],
    [
      sql.select(sql.jsonObjectAggregate(sql.value("a"), sql.value(1))).from("users"),
      'SELECT JSON_OBJECTAGG($1 VALUE $2) FROM "users"',
      ["a", 1],
    ],
  ];

  it.each(tests)("[#%#]%c %s (%j)", (builder, expectedQuery, expectedParameters) => {
    expect(builder.build()).toStrictEqual({
      query: expectedQuery,
      parameters: expectedParameters,
    });
  });
});
