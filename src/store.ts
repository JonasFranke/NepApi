import { getSiteData, type statisticsProduction } from "./nepapifetcher";

let healthy = true;
let siteData: statisticsProduction | undefined;

export async function getSiteDataWithHealth(jwtToken: string) {
    try {
        if (!siteData) {
            siteData = await getSiteData(process.env.sid, jwtToken);
            healthy = true;
            console.log("created cache");
            setTimeout(
                invalidateCache,
                process.env.cacheLife ? process.env.cacheLife * 100 : 6000,
            );
        } else {
            console.log("Served data from cache");
        }
    } catch (e) {
        healthy = false;
        console.error("Set health to unhealthy!");
        console.error(e);
    }
    return siteData;
}

function invalidateCache() {
    siteData = undefined;
    console.log("Invalidated cache!");
}

export function isHealthy() {
    return healthy;
}
