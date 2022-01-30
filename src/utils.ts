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
  const msg = {
    type,
    payload,
  };

  window.postMessage(msg);
}
