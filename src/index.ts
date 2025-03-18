import {
    getJwtToken,
    getSiteData,
    type statisticsProduction,
} from "./nepapifetcher";

if (process.env.username && process.env.password && process.env.sid) {
    const jwtToken = await getJwtToken(
        process.env.username,
        process.env.password,
    );
    let siteData = await getSiteData(process.env.sid, jwtToken);
    console.log(siteData);
    let healthy = true;

    console.log("Starting nep api");

    try {
        siteData = await getSiteData(process.env.sid, jwtToken);
        healthy = true;
    } catch (e) {
        healthy = false;
        console.error("Set health to unhealthy!");
        console.error(e);
    }

    const server = Bun.serve({
        routes: {
            "/": async () => {
                return new Response(`${siteData.totalNow}`);
            },
            "/:id": async (req) => {
                const data =
                    siteData[req.params.id as keyof statisticsProduction];
                if (data) {
                    return new Response(`${data}`);
                }
                return new Response("", { status: 404 });
            },
            "/healthcheck": () => {
                if (healthy) {
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
