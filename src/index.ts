import {
  getJwtToken,
  getSiteData,
  type statisticsProduction,
} from "./nepapifetcher";
import { getSiteDataWithHealth, isHealthy } from "./store";

if (process.env.username && process.env.password && process.env.sid) {
  const jwtToken = await getJwtToken(
    process.env.username,
    process.env.password,
  );
  const siteData = await getSiteData(process.env.sid, jwtToken);
  console.log(siteData);

  console.log("Starting nep api");

  const server = Bun.serve({
    routes: {
      "/": async () => {
        return new Response(`${(await getSiteDataWithHealth())?.totalNow}`);
      },
      "/:id": async (req) => {
        const d = await getSiteDataWithHealth();
        if (d) {
          const data = d[req.params.id as keyof statisticsProduction];
          if (data) {
            return new Response(`${data}`);
          }
        }
        return new Response("", { status: 404 });
      },
      "/healthcheck": () => {
        if (isHealthy()) {
          return new Response("", { status: 204 });
        }
        return new Response("", { status: 500 });
      },
    },
  });

  console.log(`Listening on ${server.url}`);
} else {
  let errorMsg = "Error:";
  let count = 0;
  if (!process.env.username) {
    errorMsg = ` ${errorMsg} username`;
    count++;
  }
  if (!process.env.password) {
    errorMsg = ` ${errorMsg} password`;
    count++;
  }
  if (!process.env.sid) {
    errorMsg = ` ${errorMsg} sid`;
    count++;
  }

  errorMsg = ` ${errorMsg} ${count > 1 ? "are" : "is"} null!`;
  console.error(errorMsg);
  process.exit(1);
}
