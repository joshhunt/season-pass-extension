import "core-js/stable";
import "regenerator-runtime/runtime";

import fetchIntercept, { FetchInterceptorResponse } from "fetch-intercept";
import { sendMessage, waitForMessage } from "./utils";
import { SEASONS } from "./seasons";

console.log("registering fetchIntercept in injected script");

const SEASON_BACKGROUNDS = {};

async function main() {
  sendMessage("SEASON_PASS_INJECTED_LOADED");
  const values = await waitForMessage("SEASON_PASS_LOCAL_STORAGE");
  console.log("[INJECTED] Got storage values", values.data);

  const unregisterFetchIntercept = fetchIntercept.register({
    request: function (url, config) {
      // Modify the url or config here
      return [url, config];
    },

    requestError: function (error) {
      // Called when an error occured during another 'request' interceptor call
      return Promise.reject(error);
    },

    response: function (response) {
      // console.info("[INTERCEPT]", response.url);

      if (response.url.includes("bungie.net/Platform/Settings/")) {
        return response.json().then(async (settingsJson) => {
          const pastSeasonHashes =
            settingsJson.Response.destiny2CoreSettings.pastSeasonHashes;
          console.log("intercepted pastSeasonHashes", pastSeasonHashes);

          settingsJson.Response.destiny2CoreSettings.pastSeasonHashes =
            pastSeasonHashes.slice(0, pastSeasonHashes.length - 1);

          const lastSeasonHash = pastSeasonHashes[pastSeasonHashes.length - 1];

          const seasonData = SEASONS.find((v) => v.hash === lastSeasonHash);

          console.log("Set season to", lastSeasonHash, seasonData);

          const imageResp = await fetch(seasonData?.progressPageImage ?? "", {
            method: "head",
          });

          console.log("image status", imageResp.status);

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

    responseError: function (error) {
      // Handle an fetch error
      return Promise.reject(error);
    },
  });
}

main().catch(console.error);
