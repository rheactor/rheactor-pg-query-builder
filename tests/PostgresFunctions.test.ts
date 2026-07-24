import { describe, expect, it } from "vitest";

import sql from "#/index";
import { client } from "#tests/fixtures/client";

describe("PostgresFunctions (integration)", () => {
  it("SELECT TRUE", async () => {
    const { query, parameters } = sql.select().build();

    const result = await client.query(query, parameters);

    expect(result.rows).toHaveLength(1);
  });
});
