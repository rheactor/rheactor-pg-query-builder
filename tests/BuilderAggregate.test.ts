import { describe, expect, it } from "vitest";

import type { Builder } from "#/Builder";
import sql from "#/index";
import type { Value } from "#/types/Value";

describe("class BuilderAggregate", () => {
  type Test = [builder: Builder, sql: string, args: Value[]];

  const tests: Test[] = [
    [sql.aggregate("ARRAY_AGG", "id"), 'ARRAY_AGG("id")', []],
    [sql.aggregate("JSON_AGG", "data"), 'JSON_AGG("data")', []],
    [sql.aggregate("JSONB_AGG", "data"), 'JSONB_AGG("data")', []],
    [sql.aggregate("JSON_OBJECT_AGG", "key", "value"), 'JSON_OBJECT_AGG("key", "value")', []],
    [sql.aggregate("JSONB_OBJECT_AGG", "key", "value"), 'JSONB_OBJECT_AGG("key", "value")', []],
    [sql.aggregate("XMLAGG", "document"), 'XMLAGG("document")', []],
    [sql.aggregate("STRING_AGG", "name", sql.value(", ")), 'STRING_AGG("name", $1)', [", "]],
    [sql.aggregate("ARRAY_AGG", sql.value(123)), "ARRAY_AGG($1)", [123]],
    [sql.aggregate("ARRAY_AGG"), "ARRAY_AGG()", []],
    [sql.aggregate("CUSTOM_AGG", "id").orderBy("id"), 'CUSTOM_AGG("id" ORDER BY "id")', []],
    [sql.aggregate("ARRAY_AGG", "id").orderBy("id"), 'ARRAY_AGG("id" ORDER BY "id")', []],
    [
      sql.aggregate("ARRAY_AGG", "id").orderBy("id", "ASC"),
      'ARRAY_AGG("id" ORDER BY "id" ASC)',
      [],
    ],
    [
      sql.aggregate("ARRAY_AGG", "id").orderBy("id", "DESC"),
      'ARRAY_AGG("id" ORDER BY "id" DESC)',
      [],
    ],
    [
      sql.aggregate("ARRAY_AGG", "id").orderBy("id", undefined, "NULLS FIRST"),
      'ARRAY_AGG("id" ORDER BY "id" NULLS FIRST)',
      [],
    ],
    [
      sql.aggregate("ARRAY_AGG", "id").orderBy("id", "DESC", "NULLS LAST"),
      'ARRAY_AGG("id" ORDER BY "id" DESC NULLS LAST)',
      [],
    ],
    [
      sql.aggregate("ARRAY_AGG", "id").orderBy("id").orderBy("name", "DESC"),
      'ARRAY_AGG("id" ORDER BY "id", "name" DESC)',
      [],
    ],
    [
      sql.aggregate("ARRAY_AGG", "id").orderBy(sql.collate("id", "POSIX")),
      'ARRAY_AGG("id" ORDER BY "id" COLLATE POSIX)',
      [],
    ],
    [
      sql.aggregate("ARRAY_AGG", "id").orderBy("id", "DESC", "NULLS LAST").orderBy("name"),
      'ARRAY_AGG("id" ORDER BY "id" DESC NULLS LAST, "name")',
      [],
    ],
    [
      sql.aggregate("STRING_AGG", "name", sql.value(", ")).orderBy("name", "ASC"),
      'STRING_AGG("name", $1 ORDER BY "name" ASC)',
      [", "],
    ],
    [
      sql.aggregate("JSON_AGG", "data").orderBy("created_at", "DESC"),
      'JSON_AGG("data" ORDER BY "created_at" DESC)',
      [],
    ],
    [
      sql.aggregate("JSONB_AGG", sql.call("TO_JSONB", "data")).orderBy("created_at"),
      'JSONB_AGG(TO_JSONB("data") ORDER BY "created_at")',
      [],
    ],
    [
      sql.aggregate("XMLAGG", "document").orderBy("document", "ASC", "NULLS FIRST"),
      'XMLAGG("document" ORDER BY "document" ASC NULLS FIRST)',
      [],
    ],
    [
      sql.aggregate("JSON_OBJECT_AGG", "key", "value").orderBy("key"),
      'JSON_OBJECT_AGG("key", "value" ORDER BY "key")',
      [],
    ],
    [
      sql.aggregate("ARRAY_AGG", "id").conditional(true, (builder) => {
        builder.orderBy("id");
      }),
      'ARRAY_AGG("id" ORDER BY "id")',
      [],
    ],
    [
      sql.aggregate("ARRAY_AGG", "id").conditional(false, (builder) => {
        builder.orderBy("id");
      }),
      'ARRAY_AGG("id")',
      [],
    ],
    [
      sql.select(sql.aggregate("ARRAY_AGG", "id").orderBy("id")).from("users"),
      'SELECT ARRAY_AGG("id" ORDER BY "id") FROM "users"',
      [],
    ],
    [
      sql
        .select(sql.aggregate("STRING_AGG", "name", sql.value(", ")).orderBy("created_at", "DESC"))
        .from("users")
        .groupBy("country"),
      'SELECT STRING_AGG("name", $1 ORDER BY "created_at" DESC) FROM "users" GROUP BY "country"',
      [", "],
    ],
  ];

  it.each(tests)("[#%#]%c %s (%j)", (builder, expectedQuery, expectedParameters) => {
    expect(builder.build()).toStrictEqual({
      query: expectedQuery,
      parameters: expectedParameters,
    });
  });
});
