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
      if (new Date().getHours() <= 2) {
        store.today = 0;
      }
    } else {
      console.log("Served data from cache");
    }
  } catch (e) {
    healthy = false;
    console.error("Set health to unhealthy!");
    console.error(e);
    jwtToken = await getJwtToken(process.env.username, process.env.password);
  }

  if (!siteData) return null;

  if (siteData.today === 0 && new Date().getHours() > 3) {
    siteData.today = store.today;
  }

  if (siteData.total === 0) {
    siteData.total = store.total;
  }

  return siteData;
}

function writeCache(data: statisticsProduction) {
  if (data.today > store.today) {
    store.today = data.today;
  }
  if (data.total > 0) {
    store.total = data.total;
  }
}

function invalidateCache() {
  siteData = undefined;
  console.log("Invalidated cache!");
}

export function isHealthy() {
  return healthy;
}
