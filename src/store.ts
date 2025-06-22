import {
  getJwtToken,
  getSiteData,
  type statisticsProduction,
} from "./nepapifetcher";

let healthy = true;
let siteData: statisticsProduction | undefined;
let jwtToken: string | undefined;

class Store {
  today: number;
  total: number;
  totalNow: number;

  constructor(today = 0, total = 0, totalNow = 0) {
    this.today = today;
    this.total = total;
    this.totalNow = totalNow;
  }
}

const store = new Store();

export async function getSiteDataWithHealth() {
  try {
    if (!jwtToken) {
      jwtToken = await getJwtToken(process.env.username, process.env.password);
    }
    if (!siteData) {
      siteData = await getSiteData(process.env.sid, jwtToken);
      writeCache(siteData);
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
    jwtToken = await getJwtToken(process.env.username, process.env.password);
  }

  if (siteData) {
    console.log(`store: ${store.today}, ${store.total}, ${store.totalNow}`);
    console.log(
      `siteData: ${siteData.today}, ${siteData.total}, ${siteData.totalNow}`,
    );
    siteData.today = store.today;
    siteData.total = store.total;
    siteData.totalNow = store.totalNow;
  }

  return siteData;
}

function writeCache(data: statisticsProduction) {
  if (data.today > store.today) {
    store.today = data.today;
    resetStoreTime();
  }
  if (data.total > 0) {
    store.total = data.total;
  }
  if (data.totalNow > store.totalNow) {
    store.totalNow = data.totalNow;
  }
}

function resetStoreTime() {
  const time = new Date().getHours();
  if (time === 0) {
    store.today = 0;
  }
}

function invalidateCache() {
  siteData = undefined;
  console.log("Invalidated cache!");
}

export function isHealthy() {
  return healthy;
}
