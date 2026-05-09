import { createApp } from "./src/index.js";

let appPromise;

const getApp = () => {
  if (!appPromise) {
    appPromise = createApp();
  }

  return appPromise;
};

export default async function handler(request) {
  const app = await getApp();
  const url = new URL(request.url);
  url.pathname = url.pathname.replace(/^\/api/, "") || "/";

  return app.fetch(new Request(url, request));
}
