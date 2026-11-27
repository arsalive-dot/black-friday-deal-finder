// Boot and hash routing for the deal finder. The list keeps its filter state
// in memory; the detail and method pages are hash routes so every deal has
// its own address (#/deal/<id>) and the screenshots can link straight to it.

import { renderList, renderDetail, renderAbout } from "./views.js";

const root = document.getElementById("app");

const state = { q: "", category: "", store: "", minDiscount: "", sort: "verdict", onlyStrong: false };

// A filtered view is shareable: ?q=OLED, ?category=TVs, ?store=Amazon,
// ?minDiscount=40, ?sort=discount and ?strong=1 all seed the list on load.
function seedFromQuery() {
  const params = new URLSearchParams(location.search);
  const q = params.get("q");
  const category = params.get("category");
  const store = params.get("store");
  const minDiscount = params.get("minDiscount");
  const sort = params.get("sort");
  if (q) state.q = q;
  if (category) state.category = category;
  if (store) state.store = store;
  if (minDiscount) state.minDiscount = minDiscount;
  if (["verdict", "discount", "saved", "price-low", "price-high"].includes(sort || "")) state.sort = sort;
  if (params.get("strong") === "1") state.onlyStrong = true;
}
seedFromQuery();

function route() {
  const hash = location.hash || "#/";
  if (hash.startsWith("#/deal/")) {
    renderDetail(root, decodeURIComponent(hash.slice(7)));
    return;
  }
  if (hash === "#/about") {
    renderAbout(root);
    return;
  }
  renderList(root, state);
  wireControls();
}

function wireControls() {
  const q = document.getElementById("q");
  const cat = document.getElementById("f-cat");
  const store = document.getElementById("f-store");
  const disc = document.getElementById("f-disc");
  const sort = document.getElementById("f-sort");
  const strong = document.getElementById("f-strong");
  if (!q) return;
  q.addEventListener("input", () => { state.q = q.value; refresh(); });
  cat.addEventListener("change", () => { state.category = cat.value; refresh(); });
  store.addEventListener("change", () => { state.store = store.value; refresh(); });
  disc.addEventListener("change", () => { state.minDiscount = disc.value; refresh(); });
  sort.addEventListener("change", () => { state.sort = sort.value; refresh(); });
  strong.addEventListener("change", () => { state.onlyStrong = strong.checked; refresh(); });
  // Keep the caret where the shopper left it while they type.
  const end = q.value.length;
  q.setSelectionRange(end, end);
}

function refresh() {
  renderList(root, state);
  wireControls();
  const q = document.getElementById("q");
  if (q && document.activeElement !== q) {
    // Only refocus when the change came from the search box itself.
    if (state.q) q.focus();
  }
}

window.addEventListener("hashchange", route);
route();
