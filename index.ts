type statisticsProduction = {
  today: string;
  todayUnit: string;
  month: string;
  monthUnit: string;
  year: string;
  yearUnit: string;
  total: string;
  totalUnit: string;
  totalNow: string;
  totalNowUnit: string;
  totalMoney: string;
  totalMoneyUnit: string;
}

async function getJwtToken(account: string, password: string): Promise<string> {
  const accountData = {
    account: account,
    password: password
  };

  const res = await fetch("https://api.nepviewer.net/v2/sign-in", {
    "credentials": "include",
    "headers": {
      "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:134.0) Gecko/20100101 Firefox/134.0",
      "Accept": "application/json, text/plain, */*",
      "Accept-Language": "en-US,en;q=0.5",
      "Content-Type": "application/json",
      "Authorization": "",
      "lan": "6",
      "client": "web",
      "oem": "NEP",
      "sign": "8CDC02795AF1D591FAA601F1A70DE329",
      "app": "0",
      "Sec-Fetch-Dest": "empty",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Site": "cross-site",
      "Priority": "u=0"
    },
    "referrer": "https://user.nepviewer.com/",
    "body": JSON.stringify(accountData),
    "method": "POST",
    "mode": "cors"
  });

  const data = await res.json();
  return data.data.tokenInfo.token;
}

async function getSiteData(sid: string, jwt: string): Promise<statisticsProduction> {
  const siteId = {
    sid: sid
  }

  const res = await fetch("https://api.nepviewer.net/v2/site/overview", {
    "credentials": "include",
    "headers": {
      "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:134.0) Gecko/20100101 Firefox/134.0",
      "Accept": "application/json, text/plain, */*",
      "Accept-Language": "en-US,en;q=0.5",
      "Content-Type": "application/json",
      "Authorization": jwt,
      "lan": "6",
      "client": "web",
      "oem": "NEP",
      "sign": "A397D0CFA949AD6B87C29AB3F254232D",
      "app": "0",
      "Sec-Fetch-Dest": "empty",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Site": "cross-site"
    },
    "referrer": "https://user.nepviewer.com/",
    "body": JSON.stringify(siteId),
    "method": "POST",
    "mode": "cors"
  });

  const data = await res.json();
  return data.data.statisticsProduction;
}

if (process.env.username && process.env.password && process.env.sid) {
  const jwtToken = await getJwtToken(process.env.username, process.env.password);
  const sid: string = process.env.sid;
  let siteData = await getSiteData(sid, jwtToken);
  console.log(siteData);

  const server = Bun.serve({
    async fetch(request, server) {
      const path = new URL(request.url).pathname;

      siteData = await getSiteData(sid, jwtToken);

      switch (path) {
        case "/":
          return new Response(siteData.totalNow);
        case "/today":
          return new Response(siteData.today);
        case "/total":
          return new Response(siteData.total);
        default:
          return new Response("Endpoint not found", { status: 404 });
      }
    }
  });

  console.log(`Listening on ${server.url}`);
}
