import { getJwtToken, getSiteData } from "./nepapifetcher";

if (process.env.username && process.env.password && process.env.sid) {
    const jwtToken = await getJwtToken(
        process.env.username,
        process.env.password,
    );
    let siteData = await getSiteData(process.env.sid, jwtToken);
    console.log(siteData);
    let healthy = true;

    const server = Bun.serve({
        async fetch(request) {
            const path = new URL(request.url).pathname;

            try {
                siteData = await getSiteData(process.env.sid, jwtToken);
                healthy = true;
            } catch (e) {
                healthy = false;
                console.error(e);
            }

            switch (path) {
                case "/":
                    return new Response(siteData.totalNow);
                case "/today":
                    return new Response(siteData.today);
                case "/total":
                    return new Response(siteData.total);
                case "/healthcheck":
                    if (healthy) {
                        return new Response("", { status: 204 });
                    }
                    return new Response("", { status: 500 });
                default:
                    return new Response("Endpoint not found", { status: 404 });
            }
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
