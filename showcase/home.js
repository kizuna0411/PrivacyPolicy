const { apps, blueprints, categories } = window.KizunaCatalogue;

const list = document.querySelector("[data-app-grid]");
const filters = document.querySelector("[data-filters]");
const count = document.querySelector("[data-product-count]");

const assetPath = (app, file) => `./showcase/assets/${app.slug}/${file}`;

const appIcon = (app) => app.icon
  ? `<img class="index-icon" src="${assetPath(app, app.icon)}" width="72" height="72" alt="${app.name}のアプリアイコン" loading="lazy">`
  : `<span class="index-icon icon-letter" aria-hidden="true">${app.name.trim().charAt(0)}</span>`;

const thumbnail = (app) => app.screens.length
  ? `<figure class="index-visual"><img src="${assetPath(app, app.screens[0])}" width="1206" height="2622" alt="${app.name}の画面" loading="lazy"></figure>`
  : `<div class="index-visual index-visual-empty">${appIcon(app)}<span>${blueprints[app.slug].note}</span></div>`;

const appRow = (app, absoluteIndex) => {
  const blueprint = blueprints[app.slug];
  return `
    <article class="index-product" data-family="${blueprint.layout}" data-category="${app.category}" style="--app-accent:${blueprint.accent}">
      <a class="index-product-link" href="${app.productUrl || `./apps/${app.slug}/`}" aria-label="${app.name}のプロダクトページを見る">
        <span class="index-number">${String(absoluteIndex + 1).padStart(2, "0")}</span>
        <div class="index-name">${appIcon(app)}<div><h3>${app.name}</h3><p>${app.reading}</p></div></div>
        <div class="index-copy"><p>${app.tagline}</p><span>${app.category} · ${app.platform}</span></div>
        ${thumbnail(app)}
        <span class="index-arrow" aria-hidden="true">↗</span>
      </a>
    </article>`;
};

const renderApps = (category = "すべて") => {
  const visible = category === "すべて" ? apps : apps.filter((app) => app.category === category);
  list.innerHTML = visible.map((app) => appRow(app, apps.indexOf(app))).join("");
  count.textContent = `${visible.length} PRODUCTS`;
};

filters.innerHTML = categories.map((category, index) => `
  <button class="filter-button${index === 0 ? " is-active" : ""}" type="button" data-category="${category}" aria-pressed="${index === 0}">${category}</button>`).join("");

filters.addEventListener("click", (event) => {
  const button = event.target.closest("[data-category]");
  if (!button) return;
  filters.querySelectorAll("[data-category]").forEach((item) => {
    const active = item === button;
    item.classList.toggle("is-active", active);
    item.setAttribute("aria-pressed", String(active));
  });
  renderApps(button.dataset.category);
});

renderApps();
