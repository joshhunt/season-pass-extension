import type browser from "webextension-polyfill";

const TIMEOUT = 1000 * 60 * 60 * 1; // 1 hour
export function hasTimedout(lastChangedDate: number) {
  const lastChangedTimeAgoMs = Date.now() - (lastChangedDate ?? 0);

  if (lastChangedTimeAgoMs > TIMEOUT) {
    console.log("Settings changed too long ago, aborting");
    return true;
  }

  return false;
}

export function waitForMessage(type: string) {
  return new Promise<MessageEvent>((resolve) => {
    const handler = (ev: MessageEvent) => {
      if (ev.data.type === type) {
        resolve(ev);
        window.removeEventListener("message", handler);
      }
    };

    window.addEventListener("message", handler);
  });
}

export function sendMessage(type: string, payload?: unknown) {
  window.postMessage({
    type,
    payload,
  });
}

export function changesToValues(
  changes: Record<string, browser.Storage.StorageChange>
) {
  return Object.entries(changes).reduce((acc, [key, change]) => {
    if (change.hasOwnProperty("newValue")) {
      return { ...acc, [key]: change.newValue };
    }
    return acc;
  }, {});
}
