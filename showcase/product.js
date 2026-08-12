const { apps, blueprints, bySlug } = window.KizunaCatalogue;

const root = document.querySelector("[data-product-root]");
const slug = document.body.dataset.app;
const app = bySlug[slug];
const blueprint = blueprints[slug];

if (!app || !blueprint) {
  root.innerHTML = `<main class="missing"><h1>ページが見つかりません</h1><a href="../../">アプリ一覧へ戻る</a></main>`;
  throw new Error(`Unknown app slug: ${slug}`);
}

document.title = `${app.name} | Kizuna Apps`;
document.querySelector('meta[name="description"]')?.setAttribute("content", app.description);
document.body.dataset.layout = blueprint.layout;
document.body.dataset.tone = blueprint.tone;
document.body.style.setProperty("--app-accent", blueprint.accent);

const assetPath = (target, file) => `../../showcase/assets/${target.slug}/${file}`;

if (app.icon) {
  const favicon = document.createElement("link");
  favicon.rel = "icon";
  favicon.href = assetPath(app, app.icon);
  document.head.append(favicon);
}

const icon = (target = app, className = "product-icon") =>
  target.icon
    ? `<img class="${className}" src="${assetPath(target, target.icon)}" width="512" height="512" alt="${target.name}のアプリアイコン">`
    : `<span class="${className} icon-letter" aria-hidden="true">${target.name.trim().charAt(0)}</span>`;

const screen = (file, index, className = "product-screen") => `
  <figure class="${className}">
    <img src="${assetPath(app, file)}" width="1206" height="2622" alt="${app.name}のアプリ画面 ${index + 1}" ${index ? 'loading="lazy"' : ""}>
  </figure>`;

const screens = (className = "product-screen") =>
  app.screens.map((file, index) => screen(file, index, className)).join("");

const identityVisual = (label = blueprint.note) => app.screens.length
  ? screen(app.screens[0], 0, "product-screen identity-screen")
  : `<div class="identity-field">${icon(app, "identity-icon")}<span>${label}</span></div>`;

const storeAction = app.storeUrl
  ? `<a class="button button-primary" href="${app.storeUrl}" target="_blank" rel="noopener">App Storeで見る <span aria-hidden="true">↗</span></a>`
  : "";

const privacyAction = app.privacy
  ? `<a class="button button-secondary" href="../../products/${app.privacy}/">プライバシー情報</a>`
  : "";

const actions = `<div class="actions">${storeAction}${privacyAction}</div>`;

const nav = `
  <a class="skip-link" href="#main">本文へ移動</a>
  <header class="site-header">
    <div class="nav-shell">
      <a class="brand" href="../../" aria-label="Kizuna Apps ホーム"><span class="brand-mark">K</span><span>Kizuna Apps</span></a>
      <a class="index-link" href="../../#products">全24アプリ <span aria-hidden="true">↗</span></a>
    </div>
  </header>`;

const facts = `
  <dl class="facts">
    <div><dt>Category</dt><dd>${app.category}</dd></div>
    <div><dt>Platform</dt><dd>${app.platform}</dd></div>
    <div><dt>Status</dt><dd>${app.status}</dd></div>
  </dl>`;

const featureRows = (variant = "feature-row") => app.features
  .map(([title, detail], index) => `
    <article class="${variant}">
      <span class="feature-index">${String(index + 1).padStart(2, "0")}</span>
      <div><h3>${title}</h3><p>${detail}</p></div>
    </article>`)
  .join("");

const featureSteps = () => app.features
  .map(([title, detail], index) => `
    <article class="workflow-step">
      <div class="step-copy"><span class="feature-index">STEP ${index + 1}</span><h2>${title}</h2><p>${detail}</p></div>
      ${app.screens.length ? screen(app.screens[index % app.screens.length], index, "step-screen") : `<div class="step-symbol">${String(index + 1).padStart(2, "0")}</div>`}
    </article>`)
  .join("");

const commonIntro = (compact = false) => `
  <div class="product-identity${compact ? " compact" : ""}">
    ${icon()}
    <div><p class="product-name">${app.name}</p><p class="product-reading">${app.reading}</p></div>
  </div>
  <p class="eyebrow">${blueprint.note} · ${app.category}</p>`;

const workbench = () => `
  <main id="main" class="product product-workbench">
    <section class="workbench-hero page-shell enter">
      <div class="workbench-copy">${commonIntro()}<h1>${app.tagline}</h1><p class="lede">${app.description}</p>${actions}</div>
      <div class="workbench-view">${identityVisual()}${app.screens.slice(1).map((file, i) => screen(file, i + 1, "product-screen side-screen")).join("")}</div>
    </section>
    <section class="workbench-board page-shell" aria-labelledby="feature-title">
      <div class="section-marker"><p class="eyebrow">Decision surface</p><h2 id="feature-title">必要な情報へ、最短で。</h2></div>
      <div class="workbench-rows">${featureRows()}</div>
      <div class="workbench-meta">${facts}</div>
    </section>
    ${audienceSection()}
  </main>`;

const workflow = () => `
  <main id="main" class="product product-workflow">
    <section class="workflow-hero page-shell enter">
      <div>${commonIntro()}<h1>${app.tagline}</h1></div>
      <div class="workflow-summary"><p>${app.description}</p>${actions}</div>
    </section>
    <section class="workflow-track page-shell" aria-label="${app.name}の使い方">${featureSteps()}</section>
    <section class="workflow-close page-shell"><p class="eyebrow">Designed for</p><h2>${app.audience}</h2>${facts}</section>
  </main>`;

const marquee = () => `
  <main id="main" class="product product-marquee">
    <section class="marquee-hero enter">
      <div class="page-shell">${commonIntro(true)}<p class="marquee-note">${blueprint.note}</p><h1>${app.tagline}</h1></div>
    </section>
    <section class="marquee-intro page-shell">
      <div><p class="eyebrow">The idea</p><p class="marquee-lede">${app.description}</p>${actions}</div>
      ${identityVisual()}
    </section>
    <section class="marquee-features page-shell" aria-label="主な機能">${featureRows("marquee-feature")}</section>
    ${audienceSection()}
  </main>`;

const documentPage = () => `
  <main id="main" class="product product-document">
    <div class="document-shell page-shell enter">
      <aside class="document-aside">${commonIntro()}${facts}${actions}</aside>
      <article class="document-article">
        <header><p class="document-kicker">PRODUCT NOTE / ${new Date().getFullYear()}</p><h1>${app.tagline}</h1><p class="lede">${app.description}</p></header>
        ${app.features.map(([title, detail], index) => `<section><span class="feature-index">${String(index + 1).padStart(2, "0")}</span><h2>${title}</h2><p>${detail}</p>${index === 1 && app.screens.length ? screen(app.screens[0], 0, "document-screen") : ""}</section>`).join("")}
        <blockquote>${app.audience}</blockquote>
      </article>
    </div>
  </main>`;

const catalogue = () => `
  <main id="main" class="product product-catalogue">
    <section class="catalogue-hero page-shell enter">
      <div>${commonIntro()}<h1>${app.tagline}</h1></div>
      <div class="catalogue-summary"><p>${app.description}</p>${actions}</div>
    </section>
    ${app.screens.length ? `<section class="catalogue-gallery page-shell" aria-label="${app.name}の画面">${screens("catalogue-screen")}</section>` : `<section class="catalogue-gallery page-shell">${identityVisual()}</section>`}
    <section class="catalogue-shelf page-shell" aria-label="主な機能">${featureRows("shelf-item")}</section>
    ${audienceSection()}
  </main>`;

const mapPage = () => `
  <main id="main" class="product product-map">
    <section class="map-hero page-shell enter">
      <div class="map-title">${commonIntro()}<h1>${app.tagline}</h1><p>${app.description}</p>${actions}</div>
      <div class="map-field" aria-label="${app.name}の関係図">
        ${app.screens.length ? app.screens.map((file, index) => screen(file, index, `map-screen map-screen-${index + 1}`)).join("") : identityVisual()}
        ${app.features.map(([title], index) => `<span class="map-label map-label-${index + 1}">${title}</span>`).join("")}
      </div>
    </section>
    <section class="map-notes page-shell">${featureRows("map-note")}</section>
    ${audienceSection()}
  </main>`;

const photographic = () => `
  <main id="main" class="product product-photographic">
    <section class="photo-hero page-shell enter">
      <div class="photo-copy">${commonIntro()}<h1>${app.tagline}</h1><p class="lede">${app.description}</p>${actions}</div>
      ${identityVisual()}
    </section>
    <section class="photo-story page-shell">
      ${app.features.map(([title, detail], index) => `
        <article class="photo-chapter">
          ${app.screens.length ? screen(app.screens[index % app.screens.length], index, "chapter-screen") : `<div class="chapter-number">${String(index + 1).padStart(2, "0")}</div>`}
          <div><span class="feature-index">${String(index + 1).padStart(2, "0")}</span><h2>${title}</h2><p>${detail}</p></div>
        </article>`).join("")}
    </section>
    ${audienceSection()}
  </main>`;

function audienceSection() {
  return `
    <section class="audience page-shell">
      <p class="eyebrow">Made for you</p>
      <div><h2>${app.audience}</h2>${facts}</div>
    </section>`;
}

const renderers = { workbench, workflow, marquee, document: documentPage, catalogue, map: mapPage, photographic };

const related = [
  ...apps.filter((item) => item.slug !== app.slug && item.category === app.category),
  ...apps.filter((item) => item.slug !== app.slug && item.category !== app.category),
].slice(0, 3);

const footer = `
  <aside class="related page-shell">
    <p class="eyebrow">More products</p>
    <nav aria-label="関連プロダクト">${related.map((item) => `<a href="../${item.slug}/"><span>${item.name}</span><small>${item.tagline}</small><b aria-hidden="true">↗</b></a>`).join("")}</nav>
  </aside>
  <footer class="site-footer">
    <div class="footer-shell">
      <p class="footer-statement">小さな不便から、<br>次のプロダクトへ。</p>
      <nav aria-label="フッターナビゲーション">
        <a href="../../">すべてのアプリ</a>
        ${app.privacy ? `<a href="../../products/${app.privacy}/">${app.name}のプライバシー情報</a>` : ""}
        <a href="../../policy.html#legal-notice">通信販売に関する表示</a>
      </nav>
    </div>
  </footer>`;

root.innerHTML = `${nav}${renderers[blueprint.layout]()}${footer}`;
window.scrollTo({ top: 0, left: 0 });
