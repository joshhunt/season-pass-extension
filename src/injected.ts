import "core-js/stable";
import "regenerator-runtime/runtime";

import fetchIntercept, { FetchInterceptorResponse } from "fetch-intercept";
import { hasTimedout, sendMessage, waitForMessage } from "./utils";

console.log("registering fetchIntercept in injected script");

const storage: {
  seasonHash?: number;
} = {};

async function main() {
  sendMessage("SEASON_PASS_INJECTED_LOADED");
  const values = await waitForMessage("SEASON_PASS_LOCAL_STORAGE");
  storage.seasonHash = Number(values.data.payload.seasonHash);

  if (hasTimedout(values.data.payload.lastChangedDate)) {
    console.log("Aborting out of injected, not intercepting fetch");
    return;
  }

  fetchIntercept.register({
    request(url, config) {
      return [url, config];
    },

    requestError(error) {
      return Promise.reject(error);
    },

    response(response) {
      if (response.url.includes("bungie.net/Platform/Settings/")) {
        return response.json().then(async (settingsJson) => {
          console.log("[INJECTED] Intercepted Settings response");

          if (storage.seasonHash && storage.seasonHash > 0) {
            console.log(
              "[INJECTED] Overriding season hash to",
              storage.seasonHash
            );
            settingsJson.Response.destiny2CoreSettings.pastSeasonHashes.push(
              storage.seasonHash
            );
          }

          const altResponse = new Response(
            JSON.stringify(settingsJson),
            response
          );
          (altResponse as FetchInterceptorResponse).request = response.request;

          return altResponse;
        }) as unknown as FetchInterceptorResponse;
      }

      return response;
    },

    responseError(error) {
      return Promise.reject(error);
    },
  });
}

main().catch(console.error);
