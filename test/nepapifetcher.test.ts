import { expect, test } from "bun:test";
import { getJwtToken, getSiteData } from "../src/nepapifetcher";

test("Login function", async () => {
    const jwt = await getJwtToken(process.env.username, process.env.password);
    expect(jwt).toBeDefined();
});

test("API fetcher", async () => {
    const jwt = await getJwtToken(process.env.username, process.env.password);
    const siteData = await getSiteData(process.env.sid, jwt);
    expect(siteData).toBeDefined();
    expect(siteData.year).toBeTypeOf("number");
});
