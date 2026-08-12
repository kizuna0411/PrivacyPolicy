import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const sandbox = { window: {} };
vm.runInNewContext(fs.readFileSync("showcase/data.js", "utf8"), sandbox);
const { apps, blueprints } = sandbox.window.KizunaCatalogue;
const failures = [];
const htmlFiles = ["index.html", ...apps.map((app) => `apps/${app.slug}/index.html`)];

for (const app of apps) {
  const page = `apps/${app.slug}/index.html`;
  const html = fs.readFileSync(page, "utf8");
  if (app.slug === "dorepay") {
    if (!html.includes('id="root"') || !html.includes("DorePay — 選ぶ時間を、得する時間に。")) {
      failures.push("content:dorepay");
    }
  } else if (!html.includes('class="site-header"') || !html.includes(app.name)) {
    failures.push(`content:${app.slug}`);
  }
  if (!blueprints[app.slug]) failures.push(`blueprint:${app.slug}`);
  if (app.icon && !fs.existsSync(`showcase/assets/${app.slug}/${app.icon}`)) failures.push(`icon:${app.slug}`);
  for (const screen of app.screens) {
    if (!fs.existsSync(`showcase/assets/${app.slug}/${screen}`)) failures.push(`screen:${app.slug}/${screen}`);
  }
  if (app.privacy && !fs.existsSync(`products/${app.privacy}/index.html`)) failures.push(`privacy:${app.privacy}`);
}

for (const file of htmlFiles) {
  const html = fs.readFileSync(file, "utf8");
  for (const match of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const value = match[1];
    if (/^(?:https?:|mailto:|#|data:)/.test(value)) continue;
    const clean = value.split("#")[0].split("?")[0];
    if (!clean) continue;
    let target = path.resolve(path.dirname(file), decodeURIComponent(clean));
    if (clean.endsWith("/")) target = path.join(target, "index.html");
    if (!fs.existsSync(target)) failures.push(`link:${file} -> ${value}`);
  }
}

const root = fs.readFileSync("index.html", "utf8");
const staticProducts = (root.match(/class="index-product"/g) || []).length;
if (staticProducts !== apps.length) failures.push(`root-count:${staticProducts}`);

const layouts = Object.values(blueprints).reduce((result, item) => {
  result[item.layout] = (result[item.layout] || 0) + 1;
  return result;
}, {});

console.log(JSON.stringify({ apps: apps.length, staticPages: htmlFiles.length, layouts, failures }, null, 2));
if (failures.length) process.exit(1);
