import "core-js/stable";
import "regenerator-runtime/runtime";
import browser from "webextension-polyfill";
import { SEASONS } from "./seasons";
import { changesToValues, hasTimedout } from "./utils";

import debug from "debug";

localStorage.debug = "*";
debug.enabled("*");

const log = debug("background");

let seasonOverride = -1;
let bungieApiKey: string | undefined = undefined;
let lastChangedDate = 0;

const allBgImages = SEASONS.map(
  (v) => `https://www.bungie.net${v.progressPageImage}`
);

browser.storage.onChanged.addListener((changes, area) => {
  log("storage.onChanged emitted", changes);
  const values = changesToValues(changes);
  unpackStorageValues(values);
});

browser.storage.local.get().then((values) => {
  log("storage.local.get", values);
  unpackStorageValues(values);
});

browser.webRequest.onSendHeaders.addListener(
  interceptPlatformHeaders,
  {
    urls: ["https://www.bungie.net/Platform/*"],
  },
  ["requestHeaders"]
);

browser.webRequest.onBeforeRequest.addListener(
  interceptBackgroundImages,
  { urls: allBgImages },
  ["blocking"]
);

function chromeOnlySettingsIntercept() {
  log("Registering chrome-only onBeforeRequest");
  browser.webRequest.onBeforeRequest.addListener(
    chromeInterceptSettingsRequest,
    { urls: ["https://www.bungie.net/Platform/Settings*"] },
    ["blocking"]
  );
}

chromeOnlySettingsIntercept();

// if (browser.runtime.getBrowserInfo) {
//   browser.runtime.getBrowserInfo().then((browserInfo) => {
//     if (browserInfo.name.toLowerCase() !== "firefox") {
//       chromeOnlySettingsIntercept();
//     }
//   });
// } else {
//   // If we don't have getBrowserInfo, we're probably in Chrome
//   chromeOnlySettingsIntercept();
// }

const wait = (timeout: number) =>
  new Promise((resolve) => setTimeout(resolve, timeout));

function unpackStorageValues(values: Record<string, any>) {
  console.groupCollapsed("Synced storage values to local variables");
  log("Values:", values);

  if ("lastChangedDate" in values && hasTimedout(values.lastChangedDate)) {
    log("Last change was too long ago, clearing all storage");
    browser.storage.local.remove(["seasonHash", "lastChangedDate"]);
    console.groupEnd();
    return;
  }

  if (values.seasonHash) {
    seasonOverride = Number(values.seasonHash);
    log("seasonOverride", seasonOverride);
  }

  if (values.bungieApiKey) {
    bungieApiKey = values.bungieApiKey;
    log("bungieApiKey", bungieApiKey);
  }

  if (values.lastChangedDate) {
    lastChangedDate = values.lastChangedDate;
    log("lastChangedDate", lastChangedDate);
  }

  console.groupEnd();
}

/**
 * Intercepts Bungie.net API header requests to obtain the API key
 */
async function interceptPlatformHeaders(
  request: browser.WebRequest.OnSendHeadersDetailsType
) {
  const apiKeyHeader = request.requestHeaders?.find(
    (v) => v.name.toLowerCase() === "x-api-key"
  );
  if (!apiKeyHeader?.value) return;
  if (request.url.includes("?seasonPassPass")) return;

  const path = new URL(request.url).pathname;
  log("Grabbed API key from Bungie request", path);
  await browser.storage.local.set({ bungieApiKey: apiKeyHeader.value });
}

/**
 * Intercepts requests for season background images to return the background image for the overridden season
 */
function interceptBackgroundImages(
  request: browser.WebRequest.OnSendHeadersDetailsType
): { redirectUrl: string } | undefined {
  if (hasTimedout(lastChangedDate)) {
    return undefined;
  }

  const requestedImagePathname = new URL(request.url).pathname;
  console.groupCollapsed("Request for", requestedImagePathname);

  log("seasonOverride", seasonOverride);

  const seasonForOverride = SEASONS.find((v) => v.hash === seasonOverride);
  log("seasonForOverride", seasonForOverride);

  if (!seasonForOverride) {
    log("Could not find season data for the override");
    console.groupEnd();
    return undefined;
  }

  if (seasonForOverride.progressPageImage === requestedImagePathname) {
    log("Correct image anyway");
    console.groupEnd();
    return undefined;
  }

  const requestedSeason = SEASONS.find(
    (v) => v.progressPageImage === requestedImagePathname
  );

  log("The season the browser requested is", requestedSeason);

  if (requestedSeason && requestedSeason.endDate.getTime() < Date.now()) {
    const redirectUrl = `https://www.bungie.net${seasonForOverride.progressPageImage}`;
    log("Redirecting", request.url, "to", redirectUrl);

    console.groupEnd();
    return {
      redirectUrl,
    };
  }

  console.groupEnd();
  return undefined;
}

/**
 * Intercepts requests for the Settings endpoint and potentially provides a modified response
 */
function chromeInterceptSettingsRequest(
  request: browser.WebRequest.OnBeforeSendHeadersDetailsType
) {
  const logIntercept = debug("background:intercept:" + request.requestId);
  logIntercept("Intercepted settings request", request.url);

  if (request.url.includes("?seasonPassPass")) {
    logIntercept("Intercepted our own request. Stopping.");
    return;
  }

  if (hasTimedout(lastChangedDate)) {
    logIntercept("Has timed out. Stopping.");
    return;
  }

  if (!seasonOverride) {
    logIntercept("Don't have a season override. Stopping.");
    return;
  }

  return {
    redirectUrl: `https://destiny-activities.destinyreport.workers.dev/seasonPassPass?season=${seasonOverride}`,
  };
}
