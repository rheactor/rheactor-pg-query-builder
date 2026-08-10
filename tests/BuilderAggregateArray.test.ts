import { describe, expect, it } from "vitest";

import type { Builder } from "#/Builder";
import sql from "#/index";
import type { Value } from "#/types/Value";

describe("class BuilderAggregateArray", () => {
  type Test = [builder: Builder, sql: string, args: Value[]];

  const tests: Test[] = [
    [sql.jsonArrayAggregate("v"), 'JSON_ARRAYAGG("v")', []],
    [sql.jsonArrayAggregate(sql.value(1)), "JSON_ARRAYAGG($1)", [1]],
    [sql.jsonArrayAggregate("v").orderBy("v"), 'JSON_ARRAYAGG("v" ORDER BY "v")', []],
    [
      sql.jsonArrayAggregate("v").orderBy("v", "DESC", "NULLS LAST"),
      'JSON_ARRAYAGG("v" ORDER BY "v" DESC NULLS LAST)',
      [],
    ],
    [
      sql.jsonArrayAggregate("v").orderBy("v").orderBy("id", "ASC"),
      'JSON_ARRAYAGG("v" ORDER BY "v", "id" ASC)',
      [],
    ],
    [sql.jsonArrayAggregate("v").absentOnNull(), 'JSON_ARRAYAGG("v" ABSENT ON NULL)', []],
    [sql.jsonArrayAggregate("v").absentOnNull(false), 'JSON_ARRAYAGG("v")', []],
    [sql.jsonArrayAggregate("v").returning("JSONB"), 'JSON_ARRAYAGG("v" RETURNING JSONB)', []],
    [sql.jsonArrayAggregate("v").returning("TEXT"), 'JSON_ARRAYAGG("v" RETURNING TEXT)', []],
    [
      sql.jsonArrayAggregate("v").returning("CUSTOM_TYPE"),
      'JSON_ARRAYAGG("v" RETURNING CUSTOM_TYPE)',
      [],
    ],
    [
      sql.jsonArrayAggregate("v").absentOnNull().returning("JSONB"),
      'JSON_ARRAYAGG("v" ABSENT ON NULL RETURNING JSONB)',
      [],
    ],
    [
      sql.jsonArrayAggregate("v").orderBy("v").absentOnNull().returning("BYTEA"),
      'JSON_ARRAYAGG("v" ORDER BY "v" ABSENT ON NULL RETURNING BYTEA)',
      [],
    ],
    [
      sql.jsonArrayAggregate("v").filterWhere(sql.gt("v", sql.value(0))),
      'JSON_ARRAYAGG("v") FILTER (WHERE "v" > $1)',
      [0],
    ],
    [
      sql
        .jsonArrayAggregate("v")
        .absentOnNull()
        .filterWhere(sql.gt("v", sql.value(0)), sql.lt("v", sql.value(10))),
      'JSON_ARRAYAGG("v" ABSENT ON NULL) FILTER (WHERE "v" > $1 AND "v" < $2)',
      [0, 10],
    ],
    [
      sql.jsonArrayAggregate("v").conditional(true, (builder) => {
        builder.absentOnNull();
      }),
      'JSON_ARRAYAGG("v" ABSENT ON NULL)',
      [],
    ],
    [
      sql.select(sql.jsonArrayAggregate("v").orderBy("v").returning("JSONB")).from("users"),
      'SELECT JSON_ARRAYAGG("v" ORDER BY "v" RETURNING JSONB) FROM "users"',
      [],
    ],
    [
      sql
        .select(sql.jsonArrayAggregate(sql.value(1)).orderBy("v").returning("JSONB"))
        .from("users"),
      'SELECT JSON_ARRAYAGG($1 ORDER BY "v" RETURNING JSONB) FROM "users"',
      [1],
    ],
  ];

  it.each(tests)("[#%#]%c %s (%j)", (builder, expectedQuery, expectedParameters) => {
    expect(builder.build()).toStrictEqual({
      query: expectedQuery,
      parameters: expectedParameters,
    });
  });
});
