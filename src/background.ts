import "core-js/stable";
import "regenerator-runtime/runtime";
import browser from "webextension-polyfill";
import { SEASONS } from "./seasons";
import { changesToValues, hasTimedout } from "./utils";

import debug from "debug";

localStorage.debug = "background";

const log = debug("background");

let seasonOverride = -1;
let bungieApiKey: string | undefined = undefined;
let lastChangedDate = 0;

function unpackStorageValues(values: Record<string, any>) {
  console.group("Synced storage values to local variables");
  log("Values:", values);
  log("from:", new Error().stack);

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

browser.storage.onChanged.addListener((changes, area) => {
  log("storage.onChanged emitted", changes);
  const values = changesToValues(changes);
  unpackStorageValues(values);
});

browser.storage.local.get().then((values) => {
  log("storage.local.get", values);
  unpackStorageValues(values);
});

async function handleSendHeaders(
  request: browser.WebRequest.OnSendHeadersDetailsType
) {
  const apiKeyHeader = request.requestHeaders?.find(
    (v) => v.name.toLowerCase() === "x-api-key"
  );
  if (!apiKeyHeader?.value) return;

  const path = new URL(request.url).pathname;
  log("Grabbed API key from Bungie request", path);
  await browser.storage.local.set({ bungieApiKey: apiKeyHeader.value });
}

const allBgImages = SEASONS.map(
  (v) => `https://www.bungie.net${v.progressPageImage}`
);

const requestFilter = {
  urls: ["https://www.bungie.net/Platform/*"],
};

browser.webRequest.onSendHeaders.addListener(handleSendHeaders, requestFilter, [
  "requestHeaders",
]);

browser.webRequest.onBeforeRequest.addListener(
  (req) => {
    if (hasTimedout(lastChangedDate)) {
      return undefined;
    }

    const requestedImagePathname = new URL(req.url).pathname;
    console.group("Request for", requestedImagePathname);

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
      log("Redirecting", req.url, "to", redirectUrl);

      console.groupEnd();
      return {
        redirectUrl,
      };
    }

    console.groupEnd();
    return undefined;
  },
  { urls: allBgImages },
  ["blocking"]
);
