import { expect, mock, test } from "bun:test";
import { getJwtToken, getSiteData } from "../src/nepapifetcher";

test("Env variables present", () => {
  expect(process.env.username).toBeDefined();
  expect(process.env.password).toBeDefined();
  expect(process.env.sid).toBeDefined();
});

test("Login function", async () => {
  const jwt = await getJwtToken(process.env.username, process.env.password);
  expect(jwt).toBeDefined();
});

test("API fetcher", async () => {
  const jwt = await getJwtToken(process.env.username, process.env.password);
  const siteData = await getSiteData(process.env.sid, jwt);
  expect(siteData).toBeDefined();
});

test("API fetcher with cache logic", async () => {
  const originalFetch = global.fetch;
  const mockFn = mock();
  global.fetch = mockFn;

  mockFn.mockResolvedValueOnce(
    new Response(
      JSON.stringify({
        data: {
          statisticsProduction: {
            today: 10.5,
            todayUnit: "kWh",
            month: 50,
            monthUnit: "kWh",
            year: 600,
            yearUnit: "kWh",
            total: 1200,
            totalUnit: "kWh",
            totalNow: 1.5,
            totalNowUnit: "kW",
            totalMoney: 150,
            totalMoneyUnit: "USD",
          },
        },
      }),
    ),
  );
  mockFn.mockResolvedValueOnce(
    new Response(
      JSON.stringify({
        data: {
          statisticsProduction: {
            today: 0,
            todayUnit: "kWh",
            month: 50,
            monthUnit: "kWh",
            year: 600,
            yearUnit: "kWh",
            total: 1200,
            totalUnit: "kWh",
            totalNow: 1.5,
            totalNowUnit: "kW",
            totalMoney: 150,
            totalMoneyUnit: "USD",
          },
        },
      }),
    ),
  );

  const jwt = "fake-jwt";
  const sid = "fake-sid";

  const data1 = await getSiteData(sid, jwt);
  expect(data1.today).toBe(10.5);

  const data2 = await getSiteData(sid, jwt);
  expect(data2.today).toBe(10.5);

  global.fetch = originalFetch; // cleanup
});
