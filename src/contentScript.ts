import "core-js/stable";
import "regenerator-runtime/runtime";
import browser from "webextension-polyfill";
import { sendMessage, waitForMessage } from "./utils";

function injectScript(scriptName: string) {
  return new Promise<void>((resolve) => {
    const script = document.createElement("script");
    script.src = browser.runtime.getURL(scriptName);
    script.onload = function () {
      console.log("[CONTENT] Injected " + scriptName);
      script.remove();
      resolve();
    };
    (document.head || document.documentElement).appendChild(script);
  });
}

async function main() {
  await injectScript("injected.bundle.js");
  await waitForMessage("SEASON_PASS_INJECTED_LOADED");

  const values = await browser.storage.local.get();

  console.log("[CONTENT] Extension storage:", values);

  sendMessage("SEASON_PASS_LOCAL_STORAGE", values);
}

main().catch(console.error);
