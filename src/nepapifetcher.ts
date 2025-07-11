export async function getJwtToken(
  account: string,
  password: string,
): Promise<string> {
  const accountData = {
    account: account,
    password: password,
  };

  const res = await fetch("https://api.nepviewer.net/v2/sign-in", {
    credentials: "include",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (X11; Linux x86_64; rv:134.0) Gecko/20100101 Firefox/134.0",
      Accept: "application/json, text/plain, */*",
      "Accept-Language": "en-US,en;q=0.5",
      "Content-Type": "application/json",
      Authorization: "",
      lan: "6",
      client: "web",
      oem: "NEP",
      sign: "8CDC02795AF1D591FAA601F1A70DE329",
      app: "0",
      "Sec-Fetch-Dest": "empty",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Site": "cross-site",
      Priority: "u=0",
    },
    referrer: "https://user.nepviewer.com/",
    body: JSON.stringify(accountData),
    method: "POST",
    mode: "cors",
  });

  const data = await res.json();
  return data.data.tokenInfo.token;
}

export type statisticsProduction = {
  today: number;
  todayUnit: string;
  month: number;
  monthUnit: string;
  year: number;
  yearUnit: string;
  total: number;
  totalUnit: string;
  totalNow: number;
  totalNowUnit: string;
  totalMoney: number;
  totalMoneyUnit: string;
};

let lastTodayProduction = 0;
let lastProductionUpdateDate: Date | null = null;

export async function getSiteData(
  sid: string,
  jwt: string,
): Promise<statisticsProduction> {
  try {
    const siteId = {
      sid: sid,
    };

    const res = await fetch("https://api.nepviewer.net/v2/site/overview", {
      credentials: "include",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (X11; Linux x86_64; rv:134.0) Gecko/20100101 Firefox/134.0",
        Accept: "application/json, text/plain, */*",
        "Accept-Language": "en-US,en;q=0.5",
        "Content-Type": "application/json",
        Authorization: jwt,
        lan: "6",
        client: "web",
        oem: "NEP",
        sign: "A397D0CFA949AD6B87C29AB3F254232D",
        app: "0",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "cors",
        "Sec-Fetch-Site": "cross-site",
      },
      referrer: "https://user.nepviewer.com/",
      body: JSON.stringify(siteId),
      method: "POST",
      mode: "cors",
    });

    const data = await res.json();
    const productionData = data.data.statisticsProduction;
    const currentDate = new Date();

    const isNewDay =
      lastProductionUpdateDate === null ||
      currentDate.getDate() !== lastProductionUpdateDate.getDate() ||
      currentDate.getMonth() !== lastProductionUpdateDate.getMonth() ||
      currentDate.getFullYear() !== lastProductionUpdateDate.getFullYear();

    if (isNewDay) {
      lastTodayProduction = productionData.today;
      lastProductionUpdateDate = currentDate;
    } else {
      if (productionData.today === 0 && lastTodayProduction !== 0) {
        productionData.today = lastTodayProduction;
      } else {
        lastTodayProduction = productionData.today;
        lastProductionUpdateDate = currentDate;
      }
    }

    return productionData;
  } catch (error) {
    console.error("Error fetching site data:", error);
    throw error;
  }
}
