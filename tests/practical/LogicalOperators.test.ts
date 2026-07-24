import { describe, expect, it } from "vitest";

import sql from "#/index";
import { client } from "#tests/fixtures/client";

import type { Expression } from "#/types/Expression";

describe("Logical Operators (9.1)", () => {
  const TRUE = sql.staticValue(true);
  const FALSE = sql.staticValue(false);
  const NULL = sql.staticValue(null);

  type Truth = boolean | null;

  interface ResultTruth {
    result: Truth;
  }

  interface Test {
    label: string;
    expression: Expression;
    query: string;
    expected: Truth;
  }

  const tests: Test[] = [
    {
      label: "TRUE AND TRUE",
      expression: sql.and(TRUE, TRUE),
      query: "SELECT (TRUE AND TRUE)",
      expected: true,
    },
    {
      label: "TRUE AND FALSE",
      expression: sql.and(TRUE, FALSE),
      query: "SELECT (TRUE AND FALSE)",
      expected: false,
    },
    {
      label: "FALSE AND TRUE",
      expression: sql.and(FALSE, TRUE),
      query: "SELECT (FALSE AND TRUE)",
      expected: false,
    },
    {
      label: "TRUE AND NULL",
      expression: sql.and(TRUE, NULL),
      query: "SELECT (TRUE AND NULL)",
      expected: null,
    },
    {
      label: "FALSE AND FALSE",
      expression: sql.and(FALSE, FALSE),
      query: "SELECT (FALSE AND FALSE)",
      expected: false,
    },
    {
      label: "FALSE AND NULL",
      expression: sql.and(FALSE, NULL),
      query: "SELECT (FALSE AND NULL)",
      expected: false,
    },
    {
      label: "NULL AND NULL",
      expression: sql.and(NULL, NULL),
      query: "SELECT (NULL AND NULL)",
      expected: null,
    },
    {
      label: "TRUE OR TRUE",
      expression: sql.or(TRUE, TRUE),
      query: "SELECT (TRUE OR TRUE)",
      expected: true,
    },
    {
      label: "TRUE OR FALSE",
      expression: sql.or(TRUE, FALSE),
      query: "SELECT (TRUE OR FALSE)",
      expected: true,
    },
    {
      label: "TRUE OR NULL",
      expression: sql.or(TRUE, NULL),
      query: "SELECT (TRUE OR NULL)",
      expected: true,
    },
    {
      label: "NULL OR TRUE",
      expression: sql.or(NULL, TRUE),
      query: "SELECT (NULL OR TRUE)",
      expected: true,
    },
    {
      label: "FALSE OR FALSE",
      expression: sql.or(FALSE, FALSE),
      query: "SELECT (FALSE OR FALSE)",
      expected: false,
    },
    {
      label: "FALSE OR NULL",
      expression: sql.or(FALSE, NULL),
      query: "SELECT (FALSE OR NULL)",
      expected: null,
    },
    {
      label: "NULL OR NULL",
      expression: sql.or(NULL, NULL),
      query: "SELECT (NULL OR NULL)",
      expected: null,
    },
    {
      label: "NOT TRUE",
      expression: sql.not(TRUE),
      query: "SELECT NOT TRUE",
      expected: false,
    },
    {
      label: "NOT FALSE",
      expression: sql.not(FALSE),
      query: "SELECT NOT FALSE",
      expected: true,
    },
    {
      label: "NOT NULL",
      expression: sql.not(NULL),
      query: "SELECT NOT NULL",
      expected: null,
    },
    {
      label: "(TRUE AND FALSE) OR NULL",
      expression: sql.or(sql.and(TRUE, FALSE), NULL),
      query: "SELECT ((TRUE AND FALSE) OR NULL)",
      expected: null,
    },
    {
      label: "(TRUE OR FALSE) AND NULL",
      expression: sql.and(sql.or(TRUE, FALSE), NULL),
      query: "SELECT ((TRUE OR FALSE) AND NULL)",
      expected: null,
    },
  ];

  it.each(tests)("$label", async (test) => {
    expect(sql.select(test.expression).build()).toStrictEqual({
      query: test.query,
      parameters: [],
    });

    const { query, parameters } = sql.select().selectAliased(test.expression, "result").build();
    const evaluated = await client.query<ResultTruth>(query, parameters);

    expect(evaluated.rows[0]?.result).toBe(test.expected);
  });
});
