import "core-js/stable";
import "regenerator-runtime/runtime";
import browser from "webextension-polyfill";

async function handleSendHeaders(
  request: browser.WebRequest.OnSendHeadersDetailsType
) {
  const apiKeyHeader = request.requestHeaders?.find(
    (v) => v.name.toLowerCase() === "x-api-key"
  );

  if (!apiKeyHeader?.value) return;

  await browser.storage.local.set({ bungieApiKey: apiKeyHeader.value });
  console.log("Set Bungie API key", apiKeyHeader.value);
}

const requestFilter = {
  urls: ["https://www.bungie.net/Platform/*"],
};

browser.webRequest.onSendHeaders.addListener(handleSendHeaders, requestFilter, [
  "requestHeaders",
]);

browser.webRequest.onCompleted.addListener(
  (details) => console.log("onCompleted", details),
  requestFilter
);

browser.webRequest.onResponseStarted.addListener(
  (details) => console.log("onResponseStarted", details),
  requestFilter
);
