import { describe, expect, it } from "vitest";

import type { Builder } from "#/Builder";
import sql from "#/index";
import type { Value } from "#/types/Value";

describe("class BuilderAggregate", () => {
  type Test = [builder: Builder, sql: string, args: Value[]];

  const tests: Test[] = [
    [sql.aggregate("ARRAY_AGG", "id"), "ARRAY_AGG(id)", []],
    [sql.aggregate("JSON_AGG", "data"), "JSON_AGG(data)", []],
    [sql.aggregate("JSONB_AGG", "data"), "JSONB_AGG(data)", []],
    [sql.aggregate("JSON_OBJECT_AGG", "key", "value"), "JSON_OBJECT_AGG(key, value)", []],
    [sql.aggregate("JSONB_OBJECT_AGG", "key", "value"), "JSONB_OBJECT_AGG(key, value)", []],
    [sql.aggregate("XMLAGG", "document"), "XMLAGG(document)", []],
    [sql.aggregate("STRING_AGG", "name", sql.value(", ")), "STRING_AGG(name, $1)", [", "]],
    [sql.aggregate("ARRAY_AGG", sql.value(123)), "ARRAY_AGG($1)", [123]],
    [sql.aggregate("ARRAY_AGG"), "ARRAY_AGG()", []],
    [sql.aggregate("COUNT", "*"), "COUNT(*)", []],
    [sql.aggregate("COUNT", "id"), "COUNT(id)", []],
    [sql.aggregate("SUM", "amount"), "SUM(amount)", []],
    [sql.aggregate("AVG", "score"), "AVG(score)", []],
    [sql.aggregate("MAX", "price"), "MAX(price)", []],
    [sql.aggregate("BOOL_AND", "active"), "BOOL_AND(active)", []],
    [sql.aggregate("EVERY", "active"), "EVERY(active)", []],
    [sql.aggregate("STDDEV", "score"), "STDDEV(score)", []],
    [sql.aggregate("RANGE_AGG", "validity"), "RANGE_AGG(validity)", []],
    [sql.aggregate("JSONB_AGG_STRICT", "data"), "JSONB_AGG_STRICT(data)", []],
    [
      sql.aggregate("JSONB_OBJECT_AGG_UNIQUE", "key", "value"),
      "JSONB_OBJECT_AGG_UNIQUE(key, value)",
      [],
    ],
    [sql.aggregate("REGR_SLOPE", "y", "x"), "REGR_SLOPE(y, x)", []],
    [sql.aggregate("COUNT", "id").distinct(), "COUNT(DISTINCT id)", []],
    [sql.aggregate("COUNT", "*").distinct(), "COUNT(DISTINCT *)", []],
    [sql.aggregate("COUNT", "id").distinct().distinct(false), "COUNT(id)", []],
    [sql.aggregate("ARRAY_AGG", "id").distinct(false), "ARRAY_AGG(id)", []],
    [
      sql.aggregate("ARRAY_AGG", "id").distinct().orderBy("id"),
      "ARRAY_AGG(DISTINCT id ORDER BY id)",
      [],
    ],
    [
      sql.aggregate("ARRAY_AGG", "id").distinct().orderBy("id", "DESC", "NULLS LAST"),
      "ARRAY_AGG(DISTINCT id ORDER BY id DESC NULLS LAST)",
      [],
    ],
    [
      sql.aggregate("STRING_AGG", "name", sql.value(", ")).distinct().orderBy("name", "ASC"),
      "STRING_AGG(DISTINCT name, $1 ORDER BY name ASC)",
      [", "],
    ],
    [
      sql.aggregate("JSON_AGG", "data").distinct().orderBy("created_at"),
      "JSON_AGG(DISTINCT data ORDER BY created_at)",
      [],
    ],
    [
      sql
        .aggregate("COUNT", "id")
        .distinct()
        .conditional(true, (builder) => {
          builder.distinct();
        }),
      "COUNT(DISTINCT id)",
      [],
    ],
    [
      sql
        .aggregate("COUNT", "id")
        .distinct()
        .conditional(false, (builder) => {
          builder.distinct(false);
        }),
      "COUNT(DISTINCT id)",
      [],
    ],
    [
      sql.select(sql.aggregate("COUNT", "id").distinct()).from("users"),
      "SELECT (COUNT(DISTINCT id)) FROM users",
      [],
    ],
    [
      sql
        .select(sql.aggregate("ARRAY_AGG", "id").distinct().orderBy("id"))
        .from("users")
        .groupBy("country"),
      "SELECT (ARRAY_AGG(DISTINCT id ORDER BY id)) FROM users GROUP BY country",
      [],
    ],
    [sql.aggregate("CUSTOM_AGG", "id").orderBy("id"), "CUSTOM_AGG(id ORDER BY id)", []],
    [sql.aggregate("ARRAY_AGG", "id").orderBy("id"), "ARRAY_AGG(id ORDER BY id)", []],
    [sql.aggregate("ARRAY_AGG", "id").orderBy("id", "ASC"), "ARRAY_AGG(id ORDER BY id ASC)", []],
    [sql.aggregate("ARRAY_AGG", "id").orderBy("id", "DESC"), "ARRAY_AGG(id ORDER BY id DESC)", []],
    [
      sql.aggregate("ARRAY_AGG", "id").orderBy("id", undefined, "NULLS FIRST"),
      "ARRAY_AGG(id ORDER BY id NULLS FIRST)",
      [],
    ],
    [
      sql.aggregate("ARRAY_AGG", "id").orderBy("id", "DESC", "NULLS LAST"),
      "ARRAY_AGG(id ORDER BY id DESC NULLS LAST)",
      [],
    ],
    [
      sql.aggregate("ARRAY_AGG", "id").orderBy("id").orderBy("name", "DESC"),
      "ARRAY_AGG(id ORDER BY id, name DESC)",
      [],
    ],
    [
      sql.aggregate("ARRAY_AGG", "id").orderBy(sql.collate("id", "POSIX")),
      "ARRAY_AGG(id ORDER BY id COLLATE POSIX)",
      [],
    ],
    [
      sql.aggregate("ARRAY_AGG", "id").orderBy("id", "DESC", "NULLS LAST").orderBy("name"),
      "ARRAY_AGG(id ORDER BY id DESC NULLS LAST, name)",
      [],
    ],
    [
      sql.aggregate("STRING_AGG", "name", sql.value(", ")).orderBy("name", "ASC"),
      "STRING_AGG(name, $1 ORDER BY name ASC)",
      [", "],
    ],
    [
      sql.aggregate("JSON_AGG", "data").orderBy("created_at", "DESC"),
      "JSON_AGG(data ORDER BY created_at DESC)",
      [],
    ],
    [
      sql.aggregate("JSONB_AGG", sql.call("TO_JSONB", "data")).orderBy("created_at"),
      "JSONB_AGG(TO_JSONB(data) ORDER BY created_at)",
      [],
    ],
    [
      sql.aggregate("XMLAGG", "document").orderBy("document", "ASC", "NULLS FIRST"),
      "XMLAGG(document ORDER BY document ASC NULLS FIRST)",
      [],
    ],
    [
      sql.aggregate("JSON_OBJECT_AGG", "key", "value").orderBy("key"),
      "JSON_OBJECT_AGG(key, value ORDER BY key)",
      [],
    ],
    [
      sql.aggregate("ARRAY_AGG", "id").conditional(true, (builder) => {
        builder.orderBy("id");
      }),
      "ARRAY_AGG(id ORDER BY id)",
      [],
    ],
    [
      sql.aggregate("ARRAY_AGG", "id").conditional(false, (builder) => {
        builder.orderBy("id");
      }),
      "ARRAY_AGG(id)",
      [],
    ],
    [
      sql.select(sql.aggregate("ARRAY_AGG", "id").orderBy("id")).from("users"),
      "SELECT (ARRAY_AGG(id ORDER BY id)) FROM users",
      [],
    ],
    [
      sql
        .select(sql.aggregate("STRING_AGG", "name", sql.value(", ")).orderBy("created_at", "DESC"))
        .from("users")
        .groupBy("country"),
      "SELECT (STRING_AGG(name, $1 ORDER BY created_at DESC)) FROM users GROUP BY country",
      [", "],
    ],
    [
      sql.aggregate("SUM", "amount").filterWhere(sql.gt("amount", sql.value(0))),
      "SUM(amount) FILTER (WHERE amount > $1)",
      [0],
    ],
    [
      sql.aggregate("COUNT", "id").filterWhere(sql.eq("status", sql.value("active"))),
      "COUNT(id) FILTER (WHERE status = $1)",
      ["active"],
    ],
    [
      sql
        .aggregate("SUM", "amount")
        .filterWhere(sql.gt("amount", sql.value(0)), sql.lt("amount", sql.value(100))),
      "SUM(amount) FILTER (WHERE amount > $1 AND amount < $2)",
      [0, 100],
    ],
    [
      sql
        .aggregate("SUM", "amount")
        .filterWhere(sql.gt("amount", sql.value(0)))
        .filterWhere(sql.lt("amount", sql.value(100))),
      "SUM(amount) FILTER (WHERE amount > $1 AND amount < $2)",
      [0, 100],
    ],
    [
      sql
        .aggregate("ARRAY_AGG", "id")
        .orderBy("id")
        .filterWhere(sql.eq("active", sql.value(true))),
      "ARRAY_AGG(id ORDER BY id) FILTER (WHERE active = $1)",
      [1],
    ],
    [
      sql
        .aggregate("ARRAY_AGG", "id")
        .distinct()
        .filterWhere(sql.gt("id", sql.value(0))),
      "ARRAY_AGG(DISTINCT id) FILTER (WHERE id > $1)",
      [0],
    ],
    [
      sql
        .aggregate("COUNT", "*")
        .filterWhere(sql.and(sql.gt("a", sql.value(0)), sql.gt("b", sql.value(1)))),
      "COUNT(*) FILTER (WHERE (a > $1 AND b > $2))",
      [0, 1],
    ],
    [sql.aggregate("SUM", "amount").filterWhere(false), "SUM(amount)", []],
    [sql.aggregate("SUM", "amount").filterWhere(null), "SUM(amount)", []],
    [sql.aggregate("SUM", "amount").filterWhere(undefined), "SUM(amount)", []],
    [
      sql.aggregate("SUM", "amount").filterWhere(false, sql.gt("amount", sql.value(0))),
      "SUM(amount) FILTER (WHERE amount > $1)",
      [0],
    ],
    [
      sql.aggregate("SUM", "amount").conditional(true, (builder) => {
        builder.filterWhere(sql.gt("amount", sql.value(0)));
      }),
      "SUM(amount) FILTER (WHERE amount > $1)",
      [0],
    ],
    [
      sql.aggregate("SUM", "amount").conditional(false, (builder) => {
        builder.filterWhere(sql.gt("amount", sql.value(0)));
      }),
      "SUM(amount)",
      [],
    ],
    [
      sql
        .select(sql.aggregate("COUNT", "*").filterWhere(sql.gt("price", sql.value(10))))
        .from("products"),
      "SELECT (COUNT(*) FILTER (WHERE price > $1)) FROM products",
      [10],
    ],
    [
      sql
        .select(
          sql
            .aggregate("STRING_AGG", "name", sql.value(", "))
            .orderBy("created_at", "DESC")
            .filterWhere(sql.eq("country", sql.value("BR"))),
        )
        .from("users")
        .groupBy("country"),
      "SELECT (STRING_AGG(name, $1 ORDER BY created_at DESC) FILTER (WHERE country = $2)) FROM users GROUP BY country",
      [", ", "BR"],
    ],
  ];

  it.each(tests)("[#%#]%c %s (%j)", (builder, expectedQuery, expectedParameters) => {
    expect(builder.build()).toStrictEqual({
      query: expectedQuery,
      parameters: expectedParameters,
    });
  });
});
