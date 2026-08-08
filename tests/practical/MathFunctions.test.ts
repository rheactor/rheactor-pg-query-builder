/* eslint-disable unicorn/max-nested-calls */
import { describe, expect, it } from "vitest";

import sql from "#/index";
import { client } from "#tests/fixtures/client";

import type { Builder } from "#/Builder";
import type { Value } from "#/types/Value";

describe("Mathematical Functions and Operators (9.3)", () => {
  type MathResult = number | string;

  interface ResultRow {
    result: MathResult;
  }

  describe("SQL generation (build correctness)", () => {
    type BuildTest = [builder: Builder, query: string, parameters: Value[]];

    const buildTests: BuildTest[] = [
      [
        sql.select(sql.op("+", sql.op("-", sql.value(1), sql.value(2)), sql.value(3))),
        "SELECT (($1 - $2) + $3)",
        [1, 2, 3],
      ],
      [
        sql.select(
          sql.op("*", sql.op("/", sql.staticValue(1), sql.staticValue(2)), sql.staticValue(3)),
        ),
        "SELECT ((1 / 2) * 3)",
        [],
      ],
      [sql.select(sql.op("%", sql.value(1), sql.staticValue(2))), "SELECT ($1 % 2)", [1]],
      [sql.select(sql.op("%", sql.staticValue(1), sql.value(2))), "SELECT (1 % $1)", [2]],
      [sql.select(sql.op("^", sql.staticValue(1), sql.value(2))), "SELECT (1 ^ $1)", [2]],
      [sql.select(sql.sum(sql.staticValue(1), sql.value(2))), "SELECT (1 + $1)", [2]],
      [sql.select(sql.sub(sql.staticValue(1), sql.value(2))), "SELECT (1 - $1)", [2]],
      [sql.select(sql.mul(sql.staticValue(1), sql.value(2))), "SELECT (1 * $1)", [2]],
      [sql.select(sql.div(sql.staticValue(1), sql.value(2))), "SELECT (1 / $1)", [2]],
      [sql.select(sql.mod(sql.staticValue(1), sql.value(2))), "SELECT (1 % $1)", [2]],
      [sql.select(sql.pow(sql.staticValue(1), sql.value(2))), "SELECT POW(1, $1)", [2]],
      [sql.select(sql.op("&", sql.staticValue(91), sql.value(15))), "SELECT (91 & $1)", [15]],
      [sql.select(sql.op("|", sql.staticValue(32), sql.value(3))), "SELECT (32 | $1)", [3]],
      [sql.select(sql.op("#", sql.staticValue(17), sql.value(5))), "SELECT (17 # $1)", [5]],
      [sql.select(sql.op("<<", sql.staticValue(1), sql.value(4))), "SELECT (1 << $1)", [4]],
      [sql.select(sql.op(">>", sql.staticValue(8), sql.value(2))), "SELECT (8 >> $1)", [2]],
      [sql.select(sql.opUnary("~", sql.value(1))), "SELECT (~ $1)", [1]],
      [sql.select(sql.opUnary("-", sql.value(4))), "SELECT (- $1)", [4]],
      [sql.select(sql.opUnary("+", sql.value(4))), "SELECT (+ $1)", [4]],
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
      expected: MathResult;
    }

    const tests: Test[] = [
      // Table 9.4 - Mathematical Operators
      {
        label: "2 + 3",
        builder: sql
          .select()
          .selectAliased(sql.sum(sql.staticValue(2), sql.staticValue(3)), "result"),
        query: 'SELECT (2 + 3) AS "result"',
        expected: 5,
      },
      {
        label: "2 - 3",
        builder: sql
          .select()
          .selectAliased(sql.sub(sql.staticValue(2), sql.staticValue(3)), "result"),
        query: 'SELECT (2 - 3) AS "result"',
        expected: -1,
      },
      {
        label: "2 * 3",
        builder: sql
          .select()
          .selectAliased(sql.mul(sql.staticValue(2), sql.staticValue(3)), "result"),
        query: 'SELECT (2 * 3) AS "result"',
        expected: 6,
      },
      {
        label: "5 / 2 (integral division truncates)",
        builder: sql
          .select()
          .selectAliased(sql.div(sql.staticValue(5), sql.staticValue(2)), "result"),
        query: 'SELECT (5 / 2) AS "result"',
        expected: 2,
      },
      {
        label: "-5 / 2 (truncates towards zero)",
        builder: sql
          .select()
          .selectAliased(sql.div(sql.staticValue(-5), sql.staticValue(2)), "result"),
        query: 'SELECT (-5 / 2) AS "result"',
        expected: -2,
      },
      {
        label: "5::numeric / 2",
        builder: sql
          .select()
          .selectAliased(
            sql.div(sql.cast(sql.staticValue(5), "NUMERIC"), sql.staticValue(2)),
            "result",
          ),
        query: 'SELECT (CAST(5 AS NUMERIC) / 2) AS "result"',
        expected: "2.5000000000000000",
      },
      {
        label: "5 % 4",
        builder: sql
          .select()
          .selectAliased(sql.mod(sql.staticValue(5), sql.staticValue(4)), "result"),
        query: 'SELECT (5 % 4) AS "result"',
        expected: 1,
      },
      {
        label: "2 ^ 3",
        builder: sql
          .select()
          .selectAliased(sql.op("^", sql.staticValue(2), sql.staticValue(3)), "result"),
        query: 'SELECT (2 ^ 3) AS "result"',
        expected: 8,
      },
      {
        label: "(2 ^ 3) ^ 3 (left associativity)",
        builder: sql
          .select()
          .selectAliased(
            sql.op("^", sql.op("^", sql.staticValue(2), sql.staticValue(3)), sql.staticValue(3)),
            "result",
          ),
        query: 'SELECT ((2 ^ 3) ^ 3) AS "result"',
        expected: 512,
      },
      {
        label: "2 ^ (3 ^ 3)",
        builder: sql
          .select()
          .selectAliased(
            sql.op("^", sql.staticValue(2), sql.op("^", sql.staticValue(3), sql.staticValue(3))),
            "result",
          ),
        query: 'SELECT (2 ^ (3 ^ 3)) AS "result"',
        expected: 134_217_728,
      },
      {
        label: "POW(9, 3)",
        builder: sql
          .select()
          .selectAliased(sql.pow(sql.staticValue(9), sql.staticValue(3)), "result"),
        query: 'SELECT POW(9, 3) AS "result"',
        expected: 729,
      },

      // Table 9.4 - Operators with function equivalents (|/ -> SQRT, ||/ -> CBRT, @ -> ABS)
      {
        label: "SQRT(25) (equivalent to |/ 25.0)",
        builder: sql.select().selectAliased(sql.call("SQRT", sql.staticValue(25)), "result"),
        query: 'SELECT SQRT(25) AS "result"',
        expected: 5,
      },
      {
        label: "CBRT(64) (equivalent to ||/ 64.0)",
        builder: sql.select().selectAliased(sql.call("CBRT", sql.staticValue(64)), "result"),
        query: 'SELECT CBRT(64) AS "result"',
        expected: 4,
      },
      {
        label: "ABS(-5) (equivalent to @ -5.0)",
        builder: sql.select().selectAliased(sql.call("ABS", sql.staticValue(-5)), "result"),
        query: 'SELECT ABS(-5) AS "result"',
        expected: 5,
      },

      // Table 9.4 - Unary operators
      {
        label: "+ 3.5 (unary plus)",
        builder: sql.select().selectAliased(sql.opUnary("+", sql.staticValue(3.5)), "result"),
        query: 'SELECT (+ 3.5) AS "result"',
        expected: "3.5",
      },
      {
        label: "- (-4) (negation)",
        builder: sql.select().selectAliased(sql.opUnary("-", sql.staticValue(-4)), "result"),
        query: 'SELECT (- -4) AS "result"',
        expected: 4,
      },

      // Table 9.4 - Bitwise operators
      {
        label: "91 & 15 (bitwise AND)",
        builder: sql
          .select()
          .selectAliased(sql.op("&", sql.staticValue(91), sql.staticValue(15)), "result"),
        query: 'SELECT (91 & 15) AS "result"',
        expected: 11,
      },
      {
        label: "32 | 3 (bitwise OR)",
        builder: sql
          .select()
          .selectAliased(sql.op("|", sql.staticValue(32), sql.staticValue(3)), "result"),
        query: 'SELECT (32 | 3) AS "result"',
        expected: 35,
      },
      {
        label: "17 # 5 (bitwise XOR)",
        builder: sql
          .select()
          .selectAliased(sql.op("#", sql.staticValue(17), sql.staticValue(5)), "result"),
        query: 'SELECT (17 # 5) AS "result"',
        expected: 20,
      },
      {
        label: "~1 (bitwise NOT)",
        builder: sql.select().selectAliased(sql.opUnary("~", sql.staticValue(1)), "result"),
        query: 'SELECT (~ 1) AS "result"',
        expected: -2,
      },
      {
        label: "1 << 4 (bitwise shift left)",
        builder: sql
          .select()
          .selectAliased(sql.op("<<", sql.staticValue(1), sql.staticValue(4)), "result"),
        query: 'SELECT (1 << 4) AS "result"',
        expected: 16,
      },
      {
        label: "8 >> 2 (bitwise shift right)",
        builder: sql
          .select()
          .selectAliased(sql.op(">>", sql.staticValue(8), sql.staticValue(2)), "result"),
        query: 'SELECT (8 >> 2) AS "result"',
        expected: 2,
      },

      // Table 9.5 - Mathematical Functions
      {
        label: "ABS(-17.4)",
        builder: sql.select().selectAliased(sql.call("ABS", sql.staticValue(-17.4)), "result"),
        query: 'SELECT ABS(-17.4) AS "result"',
        expected: "17.4",
      },
      {
        label: "CEIL(42.2)",
        builder: sql.select().selectAliased(sql.call("CEIL", sql.staticValue(42.2)), "result"),
        query: 'SELECT CEIL(42.2) AS "result"',
        expected: "43",
      },
      {
        label: "CEIL(-42.8)",
        builder: sql.select().selectAliased(sql.call("CEIL", sql.staticValue(-42.8)), "result"),
        query: 'SELECT CEIL(-42.8) AS "result"',
        expected: "-42",
      },
      {
        label: "CEILING(95.3)",
        builder: sql.select().selectAliased(sql.call("CEILING", sql.staticValue(95.3)), "result"),
        query: 'SELECT CEILING(95.3) AS "result"',
        expected: "96",
      },
      {
        label: "DEGREES(0.5)",
        builder: sql.select().selectAliased(sql.call("DEGREES", sql.staticValue(0.5)), "result"),
        query: 'SELECT DEGREES(0.5) AS "result"',
        expected: 28.64788975654116,
      },
      {
        label: "DIV(9, 4)",
        builder: sql
          .select()
          .selectAliased(sql.call("DIV", sql.staticValue(9), sql.staticValue(4)), "result"),
        query: 'SELECT DIV(9, 4) AS "result"',
        expected: "2",
      },
      {
        label: "ERF(1)",
        builder: sql.select().selectAliased(sql.call("ERF", sql.staticValue(1)), "result"),
        query: 'SELECT ERF(1) AS "result"',
        expected: 0.8427007929497149,
      },
      {
        label: "ERFC(1)",
        builder: sql.select().selectAliased(sql.call("ERFC", sql.staticValue(1)), "result"),
        query: 'SELECT ERFC(1) AS "result"',
        expected: 0.1572992070502851,
      },
      {
        label: "EXP(1)",
        builder: sql.select().selectAliased(sql.call("EXP", sql.staticValue(1)), "result"),
        query: 'SELECT EXP(1) AS "result"',
        expected: Math.E,
      },
      {
        label: "FACTORIAL(5)",
        builder: sql.select().selectAliased(sql.call("FACTORIAL", sql.staticValue(5)), "result"),
        query: 'SELECT FACTORIAL(5) AS "result"',
        expected: "120",
      },
      {
        label: "FLOOR(42.8)",
        builder: sql.select().selectAliased(sql.call("FLOOR", sql.staticValue(42.8)), "result"),
        query: 'SELECT FLOOR(42.8) AS "result"',
        expected: "42",
      },
      {
        label: "FLOOR(-42.8)",
        builder: sql.select().selectAliased(sql.call("FLOOR", sql.staticValue(-42.8)), "result"),
        query: 'SELECT FLOOR(-42.8) AS "result"',
        expected: "-43",
      },
      {
        label: "GAMMA(6)",
        builder: sql.select().selectAliased(sql.call("GAMMA", sql.staticValue(6)), "result"),
        query: 'SELECT GAMMA(6) AS "result"',
        expected: 120,
      },
      {
        label: "GCD(1071, 462)",
        builder: sql
          .select()
          .selectAliased(sql.call("GCD", sql.staticValue(1071), sql.staticValue(462)), "result"),
        query: 'SELECT GCD(1071, 462) AS "result"',
        expected: 21,
      },
      {
        label: "LCM(1071, 462)",
        builder: sql
          .select()
          .selectAliased(sql.call("LCM", sql.staticValue(1071), sql.staticValue(462)), "result"),
        query: 'SELECT LCM(1071, 462) AS "result"',
        expected: 23_562,
      },
      {
        label: "LGAMMA(1000)",
        builder: sql.select().selectAliased(sql.call("LGAMMA", sql.staticValue(1000)), "result"),
        query: 'SELECT LGAMMA(1000) AS "result"',
        expected: 5905.220423209181,
      },
      {
        label: "LN(2)",
        builder: sql.select().selectAliased(sql.call("LN", sql.staticValue(2)), "result"),
        query: 'SELECT LN(2) AS "result"',
        expected: Math.LN2,
      },
      {
        label: "LOG(100)",
        builder: sql.select().selectAliased(sql.call("LOG", sql.staticValue(100)), "result"),
        query: 'SELECT LOG(100) AS "result"',
        expected: 2,
      },
      {
        label: "LOG10(1000)",
        builder: sql.select().selectAliased(sql.call("LOG10", sql.staticValue(1000)), "result"),
        query: 'SELECT LOG10(1000) AS "result"',
        expected: 3,
      },
      {
        label: "LOG(2, 64)",
        builder: sql
          .select()
          .selectAliased(sql.call("LOG", sql.staticValue(2), sql.staticValue(64)), "result"),
        query: 'SELECT LOG(2, 64) AS "result"',
        expected: "6.0000000000000000",
      },
      {
        label: "MIN_SCALE(8.4100)",
        builder: sql.select().selectAliased(sql.call("MIN_SCALE", sql.raw("8.4100")), "result"),
        query: 'SELECT MIN_SCALE(8.4100) AS "result"',
        expected: 2,
      },
      {
        label: "MOD(9, 4)",
        builder: sql
          .select()
          .selectAliased(sql.call("MOD", sql.staticValue(9), sql.staticValue(4)), "result"),
        query: 'SELECT MOD(9, 4) AS "result"',
        expected: 1,
      },
      {
        label: "PI()",
        builder: sql.select().selectAliased(sql.call("PI"), "result"),
        query: 'SELECT PI() AS "result"',
        expected: Math.PI,
      },
      {
        label: "POWER(9, 3)",
        builder: sql
          .select()
          .selectAliased(sql.call("POWER", sql.staticValue(9), sql.staticValue(3)), "result"),
        query: 'SELECT POWER(9, 3) AS "result"',
        expected: 729,
      },
      {
        label: "RADIANS(45)",
        builder: sql.select().selectAliased(sql.call("RADIANS", sql.staticValue(45)), "result"),
        query: 'SELECT RADIANS(45) AS "result"',
        expected: 0.7853981633974483,
      },
      {
        label: "ROUND(42.4)",
        builder: sql.select().selectAliased(sql.call("ROUND", sql.staticValue(42.4)), "result"),
        query: 'SELECT ROUND(42.4) AS "result"',
        expected: "42",
      },
      {
        label: "ROUND(42.4382, 2)",
        builder: sql
          .select()
          .selectAliased(sql.call("ROUND", sql.staticValue(42.4382), sql.staticValue(2)), "result"),
        query: 'SELECT ROUND(42.4382, 2) AS "result"',
        expected: "42.44",
      },
      {
        label: "ROUND(1234.56, -1)",
        builder: sql
          .select()
          .selectAliased(
            sql.call("ROUND", sql.staticValue(1234.56), sql.staticValue(-1)),
            "result",
          ),
        query: 'SELECT ROUND(1234.56, -1) AS "result"',
        expected: "1230",
      },
      {
        label: "SCALE(8.4100)",
        builder: sql.select().selectAliased(sql.call("SCALE", sql.raw("8.4100")), "result"),
        query: 'SELECT SCALE(8.4100) AS "result"',
        expected: 4,
      },
      {
        label: "SIGN(-8.4)",
        builder: sql.select().selectAliased(sql.call("SIGN", sql.staticValue(-8.4)), "result"),
        query: 'SELECT SIGN(-8.4) AS "result"',
        expected: "-1",
      },
      {
        label: "SQRT(2)",
        builder: sql.select().selectAliased(sql.call("SQRT", sql.staticValue(2)), "result"),
        query: 'SELECT SQRT(2) AS "result"',
        expected: Math.SQRT2,
      },
      {
        label: "TRIM_SCALE(8.4100)",
        builder: sql.select().selectAliased(sql.call("TRIM_SCALE", sql.raw("8.4100")), "result"),
        query: 'SELECT TRIM_SCALE(8.4100) AS "result"',
        expected: "8.41",
      },
      {
        label: "TRUNC(42.8)",
        builder: sql.select().selectAliased(sql.call("TRUNC", sql.staticValue(42.8)), "result"),
        query: 'SELECT TRUNC(42.8) AS "result"',
        expected: "42",
      },
      {
        label: "TRUNC(-42.8)",
        builder: sql.select().selectAliased(sql.call("TRUNC", sql.staticValue(-42.8)), "result"),
        query: 'SELECT TRUNC(-42.8) AS "result"',
        expected: "-42",
      },
      {
        label: "TRUNC(42.4382, 2)",
        builder: sql
          .select()
          .selectAliased(sql.call("TRUNC", sql.staticValue(42.4382), sql.staticValue(2)), "result"),
        query: 'SELECT TRUNC(42.4382, 2) AS "result"',
        expected: "42.43",
      },
      {
        label: "WIDTH_BUCKET(5.35, 0.024, 10.06, 5)",
        builder: sql
          .select()
          .selectAliased(
            sql.call(
              "WIDTH_BUCKET",
              sql.staticValue(5.35),
              sql.staticValue(0.024),
              sql.staticValue(10.06),
              sql.staticValue(5),
            ),
            "result",
          ),
        query: 'SELECT WIDTH_BUCKET(5.35, 0.024, 10.06, 5) AS "result"',
        expected: 3,
      },
      {
        label: "WIDTH_BUCKET(9, 10, 0, 10) (mirror-reversed)",
        builder: sql
          .select()
          .selectAliased(
            sql.call(
              "WIDTH_BUCKET",
              sql.staticValue(9),
              sql.staticValue(10),
              sql.staticValue(0),
              sql.staticValue(10),
            ),
            "result",
          ),
        query: 'SELECT WIDTH_BUCKET(9, 10, 0, 10) AS "result"',
        expected: 2,
      },
      {
        label: "WIDTH_BUCKET(NOW(), thresholds array)",
        builder: sql
          .select()
          .selectAliased(
            sql.call(
              "WIDTH_BUCKET",
              sql.call("NOW"),
              sql.raw("array['yesterday', 'today', 'tomorrow']::timestamptz[]"),
            ),
            "result",
          ),
        query:
          "SELECT WIDTH_BUCKET(NOW(), array['yesterday', 'today', 'tomorrow']::timestamptz[]) AS \"result\"",
        expected: 2,
      },

      // Table 9.6 - Random Functions: SETSEED (void result)
      {
        label: "SETSEED(0.12345)",
        builder: sql
          .select()
          .selectAliased(sql.call("SETSEED", sql.staticValue(0.12345)), "result"),
        query: 'SELECT SETSEED(0.12345) AS "result"',
        expected: "",
      },

      // Table 9.7 - Trigonometric Functions
      {
        label: "ACOS(1)",
        builder: sql.select().selectAliased(sql.call("ACOS", sql.staticValue(1)), "result"),
        query: 'SELECT ACOS(1) AS "result"',
        expected: 0,
      },
      {
        label: "ACOSD(0.5)",
        builder: sql.select().selectAliased(sql.call("ACOSD", sql.staticValue(0.5)), "result"),
        query: 'SELECT ACOSD(0.5) AS "result"',
        expected: 60,
      },
      {
        label: "ASIN(1)",
        builder: sql.select().selectAliased(sql.call("ASIN", sql.staticValue(1)), "result"),
        query: 'SELECT ASIN(1) AS "result"',
        expected: 1.5707963267948966,
      },
      {
        label: "ASIND(0.5)",
        builder: sql.select().selectAliased(sql.call("ASIND", sql.staticValue(0.5)), "result"),
        query: 'SELECT ASIND(0.5) AS "result"',
        expected: 30,
      },
      {
        label: "ATAN(1)",
        builder: sql.select().selectAliased(sql.call("ATAN", sql.staticValue(1)), "result"),
        query: 'SELECT ATAN(1) AS "result"',
        expected: 0.7853981633974483,
      },
      {
        label: "ATAND(1)",
        builder: sql.select().selectAliased(sql.call("ATAND", sql.staticValue(1)), "result"),
        query: 'SELECT ATAND(1) AS "result"',
        expected: 45,
      },
      {
        label: "ATAN2(1, 0)",
        builder: sql
          .select()
          .selectAliased(sql.call("ATAN2", sql.staticValue(1), sql.staticValue(0)), "result"),
        query: 'SELECT ATAN2(1, 0) AS "result"',
        expected: 1.5707963267948966,
      },
      {
        label: "ATAN2D(1, 0)",
        builder: sql
          .select()
          .selectAliased(sql.call("ATAN2D", sql.staticValue(1), sql.staticValue(0)), "result"),
        query: 'SELECT ATAN2D(1, 0) AS "result"',
        expected: 90,
      },
      {
        label: "COS(0)",
        builder: sql.select().selectAliased(sql.call("COS", sql.staticValue(0)), "result"),
        query: 'SELECT COS(0) AS "result"',
        expected: 1,
      },
      {
        label: "COSD(60)",
        builder: sql.select().selectAliased(sql.call("COSD", sql.staticValue(60)), "result"),
        query: 'SELECT COSD(60) AS "result"',
        expected: 0.5,
      },
      {
        label: "COT(0.5)",
        builder: sql.select().selectAliased(sql.call("COT", sql.staticValue(0.5)), "result"),
        query: 'SELECT COT(0.5) AS "result"',
        expected: 1.830487721712452,
      },
      {
        label: "COTD(45)",
        builder: sql.select().selectAliased(sql.call("COTD", sql.staticValue(45)), "result"),
        query: 'SELECT COTD(45) AS "result"',
        expected: 1,
      },
      {
        label: "SIN(1)",
        builder: sql.select().selectAliased(sql.call("SIN", sql.staticValue(1)), "result"),
        query: 'SELECT SIN(1) AS "result"',
        expected: 0.8414709848078965,
      },
      {
        label: "SIND(30)",
        builder: sql.select().selectAliased(sql.call("SIND", sql.staticValue(30)), "result"),
        query: 'SELECT SIND(30) AS "result"',
        expected: 0.5,
      },
      {
        label: "TAN(1)",
        builder: sql.select().selectAliased(sql.call("TAN", sql.staticValue(1)), "result"),
        query: 'SELECT TAN(1) AS "result"',
        expected: 1.5574077246549023,
      },
      {
        label: "TAND(45)",
        builder: sql.select().selectAliased(sql.call("TAND", sql.staticValue(45)), "result"),
        query: 'SELECT TAND(45) AS "result"',
        expected: 1,
      },

      // Table 9.8 - Hyperbolic Functions
      {
        label: "SINH(1)",
        builder: sql.select().selectAliased(sql.call("SINH", sql.staticValue(1)), "result"),
        query: 'SELECT SINH(1) AS "result"',
        expected: 1.1752011936438014,
      },
      {
        label: "COSH(0)",
        builder: sql.select().selectAliased(sql.call("COSH", sql.staticValue(0)), "result"),
        query: 'SELECT COSH(0) AS "result"',
        expected: 1,
      },
      {
        label: "TANH(1)",
        builder: sql.select().selectAliased(sql.call("TANH", sql.staticValue(1)), "result"),
        query: 'SELECT TANH(1) AS "result"',
        expected: 0.7615941559557649,
      },
      {
        label: "ASINH(1)",
        builder: sql.select().selectAliased(sql.call("ASINH", sql.staticValue(1)), "result"),
        query: 'SELECT ASINH(1) AS "result"',
        expected: 0.881373587019543,
      },
      {
        label: "ACOSH(1)",
        builder: sql.select().selectAliased(sql.call("ACOSH", sql.staticValue(1)), "result"),
        query: 'SELECT ACOSH(1) AS "result"',
        expected: 0,
      },
      {
        label: "ATANH(0.5)",
        builder: sql.select().selectAliased(sql.call("ATANH", sql.staticValue(0.5)), "result"),
        query: 'SELECT ATANH(0.5) AS "result"',
        expected: 0.5493061443340549,
      },
    ];

    it.each(tests)("$label", async (test) => {
      expect(test.builder.build()).toStrictEqual({
        query: test.query,
        parameters: [],
      });

      const evaluated = await client.query<ResultRow>(test.query, []);

      expect(evaluated.rows[0]?.result).toBe(test.expected);
    });
  });

  describe("Table 9.6 - Random Functions (non-deterministic)", () => {
    it("RANDOM()", async () => {
      const { query, parameters } = sql
        .select()
        .selectAliased(sql.call("RANDOM"), "result")
        .build();

      expect(query).toBe('SELECT RANDOM() AS "result"');

      const evaluated = await client.query<ResultRow>(query, parameters);
      const result = evaluated.rows[0]?.result as number;

      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThan(1);
    });

    it("RANDOM(1, 10)", async () => {
      const { query, parameters } = sql
        .select()
        .selectAliased(sql.call("RANDOM", sql.staticValue(1), sql.staticValue(10)), "result")
        .build();

      expect(query).toBe('SELECT RANDOM(1, 10) AS "result"');

      const evaluated = await client.query<ResultRow>(query, parameters);
      const result = evaluated.rows[0]?.result as number;

      expect(Number.isSafeInteger(result)).toBe(true);
      expect(result).toBeGreaterThanOrEqual(1);
      expect(result).toBeLessThanOrEqual(10);
    });

    it("RANDOM_NORMAL(0, 1)", async () => {
      const { query, parameters } = sql
        .select()
        .selectAliased(sql.call("RANDOM_NORMAL", sql.staticValue(0), sql.staticValue(1)), "result")
        .build();

      expect(query).toBe('SELECT RANDOM_NORMAL(0, 1) AS "result"');

      const evaluated = await client.query<ResultRow>(query, parameters);

      expect(typeof evaluated.rows[0]?.result).toBe("number");
    });
  });
});
