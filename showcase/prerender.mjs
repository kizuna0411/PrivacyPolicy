import fs from "node:fs/promises";

const port = process.env.CHROME_PORT || "9333";
const base = process.env.PRERENDER_BASE || "http://127.0.0.1:4173/";
const slugs = [
  "currency-window", "dokoiku", "eswriter", "flightrecord", "zentree",
  "haretenki", "kasacat", "matchdayframe", "nomisugoroku", "readinglog", "readrop",
  "tabiplot", "tomelog", "wasurena", "yohaku", "zaikoff", "goukaku-log",
  "subscription", "syukatu-kanri", "warlet", "asc-autotranslate", "flickrush", "irumaru",
];
const pages = [
  ["", "index.html"],
  ...slugs.map((slug) => [`apps/${slug}/`, `apps/${slug}/index.html`]),
];

const target = await fetch(`http://127.0.0.1:${port}/json/new?about%3Ablank`, { method: "PUT" }).then((response) => response.json());
const socket = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  socket.addEventListener("open", resolve, { once: true });
  socket.addEventListener("error", reject, { once: true });
});

let id = 0;
const pending = new Map();
const eventWaiters = new Map();

socket.addEventListener("message", ({ data }) => {
  const message = JSON.parse(data);
  if (message.id && pending.has(message.id)) {
    const { resolve, reject } = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) reject(new Error(message.error.message));
    else resolve(message.result);
    return;
  }
  const waiters = eventWaiters.get(message.method) || [];
  eventWaiters.delete(message.method);
  waiters.forEach((resolve) => resolve(message.params));
});

const send = (method, params = {}) => new Promise((resolve, reject) => {
  id += 1;
  pending.set(id, { resolve, reject });
  socket.send(JSON.stringify({ id, method, params }));
});

const waitFor = (method) => new Promise((resolve, reject) => {
  const timer = setTimeout(() => reject(new Error(`Timed out waiting for ${method}`)), 8000);
  const wrapped = (params) => {
    clearTimeout(timer);
    resolve(params);
  };
  eventWaiters.set(method, [...(eventWaiters.get(method) || []), wrapped]);
});

await send("Page.enable");
await send("Runtime.enable");
await send("Network.enable");
await send("Network.setCacheDisabled", { cacheDisabled: true });
await send("Network.clearBrowserCache");
await send("Emulation.setDeviceMetricsOverride", { width: 1280, height: 900, deviceScaleFactor: 1, mobile: false });

const filterSource = `(() => {
  const filters = document.querySelector("[data-filters]");
  const count = document.querySelector("[data-product-count]");
  if (!filters) return;
  filters.addEventListener("click", (event) => {
    const button = event.target.closest("[data-category]");
    if (!button) return;
    filters.querySelectorAll("[data-category]").forEach((item) => {
      const active = item === button;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-pressed", String(active));
    });
    let visible = 0;
    document.querySelectorAll(".index-product").forEach((product) => {
      const show = button.dataset.category === "すべて" || product.dataset.category === button.dataset.category;
      product.hidden = !show;
      if (show) visible += 1;
    });
    if (count) count.textContent = visible + " PRODUCTS";
  });
})();`;

for (const [route, output] of pages) {
  const loaded = waitFor("Page.loadEventFired");
  await send("Page.navigate", { url: new URL(route, base).href });
  await loaded;
  const evaluated = await send("Runtime.evaluate", {
    expression: `(async () => {
      await document.fonts.ready;
      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      const expected = ${JSON.stringify(output === "index.html")} ? ".index-product" : ".site-header";
      if (!document.querySelector(expected)) throw new Error("Missing prerender root: " + expected);
      document.querySelectorAll("script, noscript").forEach((element) => element.remove());
      if (${JSON.stringify(output === "index.html")}) {
        const script = document.createElement("script");
        script.textContent = ${JSON.stringify(filterSource)};
        document.body.append(script);
      }
      return "<!doctype html>\\n" + document.documentElement.outerHTML;
    })()`,
    awaitPromise: true,
    returnByValue: true,
  });
  if (evaluated.exceptionDetails) throw new Error(`Prerender failed for ${route || "/"}: ${evaluated.exceptionDetails.text}`);
  const html = evaluated.result.value
    .replaceAll(base, "./")
    .replaceAll("http://127.0.0.1:4173/", "./")
    .replace(/[ \t]+$/gm, "");
  await fs.writeFile(output, html);
}

await fetch(`http://127.0.0.1:${port}/json/close/${target.id}`);
socket.close();
console.log(`Prerendered ${pages.length} pages.`);
