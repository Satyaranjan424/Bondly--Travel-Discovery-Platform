import { createApp } from "./src/index.js";

let appPromise;

const getApp = () => {
  if (!appPromise) {
    appPromise = createApp();
  }

  return appPromise;
};

async function handleRequest(request) {
  const app = await getApp();
  const url = new URL(request.url);
  url.pathname = url.pathname.replace(/^\/api/, "") || "/";

  return app.fetch(new Request(url, request));
}

export const GET = handleRequest;
export const POST = handleRequest;
export const PUT = handleRequest;
export const DELETE = handleRequest;
export const OPTIONS = handleRequest;

export default {
  fetch: handleRequest,
};
