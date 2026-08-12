const port = process.env.CHROME_PORT || "9333";
const base = "http://127.0.0.1:4173/";
const slugs = [
  "",
  "dorepay", "currency-window", "dokoiku", "eswriter", "flightrecord", "zentree",
  "haretenki", "kasacat", "matchdayframe", "nomisugoroku", "readinglog", "readrop",
  "tabiplot", "tomelog", "wasurena", "yohaku", "zaikoff", "goukaku-log",
  "subscription", "syukatu-kanri", "warlet", "asc-autotranslate", "flickrush", "irumaru",
];
const widths = (process.env.AUDIT_WIDTHS || "320,375,414,768,1280").split(",").map(Number);

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

const failures = [];
for (const width of widths) {
  await send("Emulation.setDeviceMetricsOverride", { width, height: 900, deviceScaleFactor: 1, mobile: width < 768 });
  for (const slug of slugs) {
    const url = slug ? `${base}apps/${slug}/` : base;
    const loaded = waitFor("Page.loadEventFired");
    await send("Page.navigate", { url });
    await loaded;
    const { result } = await send("Runtime.evaluate", {
      expression: `(async () => {
        await document.fonts.ready;
        await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
        const root = document.documentElement;
        const selectors = ".button, .brand, .index-link, .filter-button, .site-footer nav a";
        const wraps = [...document.querySelectorAll(selectors)].flatMap((element) => {
          if (getComputedStyle(element).display === "none") return [];
          const range = document.createRange();
          range.selectNodeContents(element);
          const rects = [...range.getClientRects()].filter((rect) => rect.width > 0);
          const tops = rects.map((rect) => rect.top);
          const lineHeight = Number.parseFloat(getComputedStyle(element).lineHeight) || 16;
          const wrapped = tops.length > 1 && Math.max(...tops) - Math.min(...tops) > lineHeight * 0.6;
          return wrapped ? [element.textContent.trim().replace(/\\s+/g, " ")] : [];
        });
        const brokenImages = [...document.images].filter((image) => image.complete && image.naturalWidth === 0).map((image) => image.src);
        return {
          overflow: root.scrollWidth - root.clientWidth,
          wraps,
          brokenImages,
          title: document.title,
          content: Boolean(document.querySelector(${JSON.stringify(slug === "dorepay" ? ".hero" : slug ? ".site-header" : ".index-product")})),
        };
      })()`,
      awaitPromise: true,
      returnByValue: true,
    });
    const value = result.value;
    if (value.overflow > 1 || value.wraps.length || value.brokenImages.length || !value.title || !value.content) {
      failures.push({ width, slug: slug || "home", ...value });
    }
  }
}

await fetch(`http://127.0.0.1:${port}/json/close/${target.id}`);
socket.close();

console.log(JSON.stringify({ pages: slugs.length, widths, checks: slugs.length * widths.length, failures }, null, 2));
