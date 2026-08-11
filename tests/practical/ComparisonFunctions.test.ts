import { describe, expect, it } from "vitest";

import type { Builder } from "#/Builder";
import sql from "#/index";
import type { Value } from "#/types/Value";
import { client } from "#tests/fixtures/client";

function literalColumn(value: string) {
  return sql.raw(`(SELECT ${value} AS v)`);
}

describe("Comparison Functions and Operators (9.2)", () => {
  type ComparisonResult = boolean | number | null;

  interface ResultRow {
    result: ComparisonResult;
  }

  describe("SQL generation (build correctness)", () => {
    type BuildTest = [builder: Builder, query: string, parameters: Value[]];

    const buildTests: BuildTest[] = [
      [sql.select().where(sql.eq("test1", "test2")), "SELECT TRUE WHERE test1 = test2", []],
      [sql.select().where(sql.eq("test", sql.value(123))), "SELECT TRUE WHERE test = $1", [123]],
      [
        sql.select().where(sql.eq("test1", sql.value(123)), sql.eq("test2", sql.value(123))),
        "SELECT TRUE WHERE test1 = $1 AND test2 = $1",
        [123],
      ],
      [
        sql.select().where(sql.eq("test1", sql.value(123)), sql.eq("test2", sql.value(456))),
        "SELECT TRUE WHERE test1 = $1 AND test2 = $2",
        [123, 456],
      ],
      [sql.select().where(sql.neq("test", sql.value(123))), "SELECT TRUE WHERE test != $1", [123]],
      [sql.select().where(sql.gt("test", sql.value(123))), "SELECT TRUE WHERE test > $1", [123]],
      [sql.select().where(sql.gte("test", sql.value(123))), "SELECT TRUE WHERE test >= $1", [123]],
      [sql.select().where(sql.lt("test", sql.value(123))), "SELECT TRUE WHERE test < $1", [123]],
      [sql.select().where(sql.lte("test", sql.value(123))), "SELECT TRUE WHERE test <= $1", [123]],
      [
        sql.select().where(sql.between("test", sql.value(123), sql.value(123))),
        "SELECT TRUE WHERE test BETWEEN $1 AND $1",
        [123],
      ],
      [
        sql.select().where(sql.between("test", sql.value(123), sql.value(456))),
        "SELECT TRUE WHERE test BETWEEN $1 AND $2",
        [123, 456],
      ],
      [
        sql.select().where(sql.notBetween("test", sql.value(123), sql.value(123))),
        "SELECT TRUE WHERE NOT test BETWEEN $1 AND $1",
        [123],
      ],
      [
        sql.select().where(sql.notBetween("test", sql.value(123), sql.value(456))),
        "SELECT TRUE WHERE NOT test BETWEEN $1 AND $2",
        [123, 456],
      ],
      [
        sql.select().where(sql.in("status", sql.value("a"), sql.value("b"))),
        "SELECT TRUE WHERE status IN ($1, $2)",
        ["a", "b"],
      ],
      [
        sql.select().where(sql.in("status", sql.value("a"))),
        "SELECT TRUE WHERE status IN ($1)",
        ["a"],
      ],
      [
        sql.select().where(sql.in("id", sql.select("id").from("active"))),
        "SELECT TRUE WHERE id IN ((SELECT id FROM active))",
        [],
      ],
      [
        sql.select().where(sql.not(sql.in("id", sql.value(1), sql.value(2)))),
        "SELECT TRUE WHERE NOT id IN ($1, $2)",
        [1, 2],
      ],
      [sql.select().where(sql.isNull("test")), "SELECT TRUE WHERE test IS NULL", []],
      [sql.select().where(sql.isNotNull("test")), "SELECT TRUE WHERE NOT test IS NULL", []],
      [
        sql.select().where(sql.isNull(sql.staticValue("test"))),
        "SELECT TRUE WHERE 'test' IS NULL",
        [],
      ],
      [sql.select().where(sql.isTrue(sql.staticValue(true))), "SELECT TRUE WHERE TRUE IS TRUE", []],
      [
        sql.select().where(sql.isFalse(sql.staticValue(true))),
        "SELECT TRUE WHERE TRUE IS FALSE",
        [],
      ],
      [
        sql.select().where(sql.isUnknown(sql.staticValue(true))),
        "SELECT TRUE WHERE TRUE IS UNKNOWN",
        [],
      ],
      [
        sql.select().where(sql.isDistinctFrom("test", sql.value(123))),
        "SELECT TRUE WHERE test IS DISTINCT FROM $1",
        [123],
      ],
      [
        sql.select().where(sql.betweenSymmetric("test", sql.value(1), sql.value(3))),
        "SELECT TRUE WHERE test BETWEEN SYMMETRIC $1 AND $2",
        [1, 3],
      ],
    ];

    it.each(buildTests)("[#%#]%c %s (%j)", (builder, expectedQuery, expectedParameters) => {
      expect(builder.build()).toStrictEqual({
        query: expectedQuery,
        parameters: expectedParameters,
      });
    });
  });

  describe("Practical behavior (client execution)", () => {
    interface Test {
      label: string;
      builder: Builder;
      query: string;
      expected: ComparisonResult;
    }

    const tests: Test[] = [
      // Table 9.1 - Comparison Operators
      {
        label: "1 = 1",
        builder: sql
          .select()
          .selectAliased(sql.eq(sql.staticValue(1), sql.staticValue(1)), "result"),
        query: "SELECT 1 = 1 AS result",
        expected: true,
      },
      {
        label: "1 = 2",
        builder: sql
          .select()
          .selectAliased(sql.eq(sql.staticValue(1), sql.staticValue(2)), "result"),
        query: "SELECT 1 = 2 AS result",
        expected: false,
      },
      {
        label: "1 = NULL",
        builder: sql
          .select()
          .selectAliased(sql.eq(sql.staticValue(1), sql.staticValue(null)), "result"),
        query: "SELECT 1 = NULL AS result",
        expected: null,
      },
      {
        label: "1 != 2",
        builder: sql
          .select()
          .selectAliased(sql.neq(sql.staticValue(1), sql.staticValue(2)), "result"),
        query: "SELECT 1 != 2 AS result",
        expected: true,
      },
      {
        label: "1 != 1",
        builder: sql
          .select()
          .selectAliased(sql.neq(sql.staticValue(1), sql.staticValue(1)), "result"),
        query: "SELECT 1 != 1 AS result",
        expected: false,
      },
      {
        label: "1 != NULL",
        builder: sql
          .select()
          .selectAliased(sql.neq(sql.staticValue(1), sql.staticValue(null)), "result"),
        query: "SELECT 1 != NULL AS result",
        expected: null,
      },
      {
        label: "2 > 1",
        builder: sql
          .select()
          .selectAliased(sql.gt(sql.staticValue(2), sql.staticValue(1)), "result"),
        query: "SELECT 2 > 1 AS result",
        expected: true,
      },
      {
        label: "1 > 2",
        builder: sql
          .select()
          .selectAliased(sql.gt(sql.staticValue(1), sql.staticValue(2)), "result"),
        query: "SELECT 1 > 2 AS result",
        expected: false,
      },
      {
        label: "1 > NULL",
        builder: sql
          .select()
          .selectAliased(sql.gt(sql.staticValue(1), sql.staticValue(null)), "result"),
        query: "SELECT 1 > NULL AS result",
        expected: null,
      },
      {
        label: "2 >= 2",
        builder: sql
          .select()
          .selectAliased(sql.gte(sql.staticValue(2), sql.staticValue(2)), "result"),
        query: "SELECT 2 >= 2 AS result",
        expected: true,
      },
      {
        label: "1 >= 2",
        builder: sql
          .select()
          .selectAliased(sql.gte(sql.staticValue(1), sql.staticValue(2)), "result"),
        query: "SELECT 1 >= 2 AS result",
        expected: false,
      },
      {
        label: "1 < 2",
        builder: sql
          .select()
          .selectAliased(sql.lt(sql.staticValue(1), sql.staticValue(2)), "result"),
        query: "SELECT 1 < 2 AS result",
        expected: true,
      },
      {
        label: "2 < 1",
        builder: sql
          .select()
          .selectAliased(sql.lt(sql.staticValue(2), sql.staticValue(1)), "result"),
        query: "SELECT 2 < 1 AS result",
        expected: false,
      },
      {
        label: "2 <= 2",
        builder: sql
          .select()
          .selectAliased(sql.lte(sql.staticValue(2), sql.staticValue(2)), "result"),
        query: "SELECT 2 <= 2 AS result",
        expected: true,
      },
      {
        label: "3 <= 2",
        builder: sql
          .select()
          .selectAliased(sql.lte(sql.staticValue(3), sql.staticValue(2)), "result"),
        query: "SELECT 3 <= 2 AS result",
        expected: false,
      },

      // Table 9.2 - Comparison Predicates: BETWEEN / NOT BETWEEN
      {
        label: "2 BETWEEN 1 AND 3",
        builder: sql
          .select()
          .selectAliased(sql.between("v", sql.staticValue(1), sql.staticValue(3)), "result")
          .fromAliased(literalColumn("2"), "t"),
        query: "SELECT v BETWEEN 1 AND 3 AS result FROM (SELECT 2 AS v) AS t",
        expected: true,
      },
      {
        label: "2 BETWEEN 3 AND 1",
        builder: sql
          .select()
          .selectAliased(sql.between("v", sql.staticValue(3), sql.staticValue(1)), "result")
          .fromAliased(literalColumn("2"), "t"),
        query: "SELECT v BETWEEN 3 AND 1 AS result FROM (SELECT 2 AS v) AS t",
        expected: false,
      },
      {
        label: "2 NOT BETWEEN 1 AND 3",
        builder: sql
          .select()
          .selectAliased(sql.notBetween("v", sql.staticValue(1), sql.staticValue(3)), "result")
          .fromAliased(literalColumn("2"), "t"),
        query: "SELECT NOT v BETWEEN 1 AND 3 AS result FROM (SELECT 2 AS v) AS t",
        expected: false,
      },
      {
        label: "2 NOT BETWEEN 3 AND 1",
        builder: sql
          .select()
          .selectAliased(sql.notBetween("v", sql.staticValue(3), sql.staticValue(1)), "result")
          .fromAliased(literalColumn("2"), "t"),
        query: "SELECT NOT v BETWEEN 3 AND 1 AS result FROM (SELECT 2 AS v) AS t",
        expected: true,
      },

      // Table 9.2 - Comparison Predicates: IS NULL / IS NOT NULL
      {
        label: "1.5 IS NULL",
        builder: sql
          .select()
          .selectAliased(sql.isNull("v"), "result")
          .fromAliased(literalColumn("1.5"), "t"),
        query: "SELECT v IS NULL AS result FROM (SELECT 1.5 AS v) AS t",
        expected: false,
      },
      {
        label: "NULL IS NULL",
        builder: sql
          .select()
          .selectAliased(sql.isNull("v"), "result")
          .fromAliased(literalColumn("NULL"), "t"),
        query: "SELECT v IS NULL AS result FROM (SELECT NULL AS v) AS t",
        expected: true,
      },
      {
        label: "'x' IS NOT NULL",
        builder: sql
          .select()
          .selectAliased(sql.isNotNull("v"), "result")
          .fromAliased(literalColumn("'x'"), "t"),
        query: "SELECT NOT v IS NULL AS result FROM (SELECT 'x' AS v) AS t",
        expected: true,
      },
      {
        label: "NULL IS NOT NULL",
        builder: sql
          .select()
          .selectAliased(sql.isNotNull("v"), "result")
          .fromAliased(literalColumn("NULL"), "t"),
        query: "SELECT NOT v IS NULL AS result FROM (SELECT NULL AS v) AS t",
        expected: false,
      },

      // Table 9.2 - Comparison Predicates: IN / NOT IN
      {
        label: "2 IN (1, 2, 3)",
        builder: sql
          .select()
          .selectAliased(
            sql.in("v", sql.staticValue(1), sql.staticValue(2), sql.staticValue(3)),
            "result",
          )
          .fromAliased(literalColumn("2"), "t"),
        query: "SELECT v IN (1, 2, 3) AS result FROM (SELECT 2 AS v) AS t",
        expected: true,
      },
      {
        label: "5 IN (1, 2, 3)",
        builder: sql
          .select()
          .selectAliased(
            sql.in("v", sql.staticValue(1), sql.staticValue(2), sql.staticValue(3)),
            "result",
          )
          .fromAliased(literalColumn("5"), "t"),
        query: "SELECT v IN (1, 2, 3) AS result FROM (SELECT 5 AS v) AS t",
        expected: false,
      },
      {
        label: "2 NOT IN (1, 2, 3)",
        builder: sql
          .select()
          .selectAliased(
            sql.not(sql.in("v", sql.staticValue(1), sql.staticValue(2), sql.staticValue(3))),
            "result",
          )
          .fromAliased(literalColumn("2"), "t"),
        query: "SELECT NOT v IN (1, 2, 3) AS result FROM (SELECT 2 AS v) AS t",
        expected: false,
      },
      {
        label: "5 NOT IN (1, 2, 3)",
        builder: sql
          .select()
          .selectAliased(
            sql.not(sql.in("v", sql.staticValue(1), sql.staticValue(2), sql.staticValue(3))),
            "result",
          )
          .fromAliased(literalColumn("5"), "t"),
        query: "SELECT NOT v IN (1, 2, 3) AS result FROM (SELECT 5 AS v) AS t",
        expected: true,
      },

      // Table 9.2 - Comparison Predicates: IS TRUE / IS FALSE / IS UNKNOWN
      {
        label: "TRUE IS TRUE",
        builder: sql.select().selectAliased(sql.isTrue(sql.staticValue(true)), "result"),
        query: "SELECT TRUE IS TRUE AS result",
        expected: true,
      },
      {
        label: "NULL IS TRUE",
        builder: sql.select().selectAliased(sql.isTrue(sql.staticValue(null)), "result"),
        query: "SELECT NULL IS TRUE AS result",
        expected: false,
      },
      {
        label: "TRUE IS NOT TRUE",
        builder: sql.select().selectAliased(sql.not(sql.isTrue(sql.staticValue(true))), "result"),
        query: "SELECT NOT TRUE IS TRUE AS result",
        expected: false,
      },
      {
        label: "NULL IS NOT TRUE",
        builder: sql.select().selectAliased(sql.not(sql.isTrue(sql.staticValue(null))), "result"),
        query: "SELECT NOT NULL IS TRUE AS result",
        expected: true,
      },
      {
        label: "TRUE IS FALSE",
        builder: sql.select().selectAliased(sql.isFalse(sql.staticValue(true)), "result"),
        query: "SELECT TRUE IS FALSE AS result",
        expected: false,
      },
      {
        label: "NULL IS FALSE",
        builder: sql.select().selectAliased(sql.isFalse(sql.staticValue(null)), "result"),
        query: "SELECT NULL IS FALSE AS result",
        expected: false,
      },
      {
        label: "TRUE IS NOT FALSE",
        builder: sql.select().selectAliased(sql.not(sql.isFalse(sql.staticValue(true))), "result"),
        query: "SELECT NOT TRUE IS FALSE AS result",
        expected: true,
      },
      {
        label: "TRUE IS UNKNOWN",
        builder: sql.select().selectAliased(sql.isUnknown(sql.staticValue(true)), "result"),
        query: "SELECT TRUE IS UNKNOWN AS result",
        expected: false,
      },
      {
        label: "NULL IS UNKNOWN",
        builder: sql.select().selectAliased(sql.isUnknown(sql.staticValue(null)), "result"),
        query: "SELECT NULL IS UNKNOWN AS result",
        expected: true,
      },
      {
        label: "TRUE IS NOT UNKNOWN",
        builder: sql
          .select()
          .selectAliased(sql.not(sql.isUnknown(sql.staticValue(true))), "result"),
        query: "SELECT NOT TRUE IS UNKNOWN AS result",
        expected: true,
      },

      // Table 9.2 - Comparison Predicates: IS DISTINCT FROM
      {
        label: "1 IS DISTINCT FROM NULL",
        builder: sql
          .select()
          .selectAliased(sql.isDistinctFrom(sql.staticValue(1), sql.staticValue(null)), "result"),
        query: "SELECT 1 IS DISTINCT FROM NULL AS result",
        expected: true,
      },
      {
        label: "NULL IS DISTINCT FROM NULL",
        builder: sql
          .select()
          .selectAliased(
            sql.isDistinctFrom(sql.staticValue(null), sql.staticValue(null)),
            "result",
          ),
        query: "SELECT NULL IS DISTINCT FROM NULL AS result",
        expected: false,
      },
      {
        label: "1 IS NOT DISTINCT FROM NULL",
        builder: sql
          .select()
          .selectAliased(
            sql.not(sql.isDistinctFrom(sql.staticValue(1), sql.staticValue(null))),
            "result",
          ),
        query: "SELECT NOT 1 IS DISTINCT FROM NULL AS result",
        expected: false,
      },

      // Table 9.2 - Comparison Predicates: BETWEEN SYMMETRIC
      {
        label: "2 BETWEEN SYMMETRIC 3 AND 1",
        builder: sql
          .select()
          .selectAliased(
            sql.betweenSymmetric("v", sql.staticValue(3), sql.staticValue(1)),
            "result",
          )
          .fromAliased(literalColumn("2"), "t"),
        query: "SELECT v BETWEEN SYMMETRIC 3 AND 1 AS result FROM (SELECT 2 AS v) AS t",
        expected: true,
      },
      {
        label: "5 BETWEEN SYMMETRIC 3 AND 1",
        builder: sql
          .select()
          .selectAliased(
            sql.betweenSymmetric("v", sql.staticValue(3), sql.staticValue(1)),
            "result",
          )
          .fromAliased(literalColumn("5"), "t"),
        query: "SELECT v BETWEEN SYMMETRIC 3 AND 1 AS result FROM (SELECT 5 AS v) AS t",
        expected: false,
      },
      {
        label: "5 NOT BETWEEN SYMMETRIC 3 AND 1",
        builder: sql
          .select()
          .selectAliased(
            sql.not(sql.betweenSymmetric("v", sql.staticValue(3), sql.staticValue(1))),
            "result",
          )
          .fromAliased(literalColumn("5"), "t"),
        query: "SELECT NOT v BETWEEN SYMMETRIC 3 AND 1 AS result FROM (SELECT 5 AS v) AS t",
        expected: true,
      },

      // Table 9.3 - Comparison Functions: num_nonnulls / num_nulls
      {
        label: "num_nonnulls(1, NULL, 2)",
        builder: sql
          .select()
          .selectAliased(
            sql.call("NUM_NONNULLS", sql.staticValue(1), sql.staticValue(null), sql.staticValue(2)),
            "result",
          ),
        query: "SELECT NUM_NONNULLS(1, NULL, 2) AS result",
        expected: 2,
      },
      {
        label: "num_nonnulls(NULL, NULL)",
        builder: sql
          .select()
          .selectAliased(
            sql.call("NUM_NONNULLS", sql.staticValue(null), sql.staticValue(null)),
            "result",
          ),
        query: "SELECT NUM_NONNULLS(NULL, NULL) AS result",
        expected: 0,
      },
      {
        label: "num_nulls(1, NULL, 2)",
        builder: sql
          .select()
          .selectAliased(
            sql.call("NUM_NULLS", sql.staticValue(1), sql.staticValue(null), sql.staticValue(2)),
            "result",
          ),
        query: "SELECT NUM_NULLS(1, NULL, 2) AS result",
        expected: 1,
      },
      {
        label: "num_nulls(NULL, NULL)",
        builder: sql
          .select()
          .selectAliased(
            sql.call("NUM_NULLS", sql.staticValue(null), sql.staticValue(null)),
            "result",
          ),
        query: "SELECT NUM_NULLS(NULL, NULL) AS result",
        expected: 2,
      },
    ];

    it.each(tests)("$label", async (test) => {
      expect.assertions(2);

      expect(test.builder.build()).toStrictEqual({
        query: test.query,
        parameters: [],
      });

      const evaluated = await client.query<ResultRow>(test.query, []);

      expect(evaluated.rows.at(0)?.result).toBe(test.expected);
    });
  });
});
