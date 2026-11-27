// Rendering: the deal list, the deal detail page and the method page.
// All markup is built from the deal data with escaped text — no deal field
// is ever inserted as raw HTML.

import { deals, CATEGORIES, STORES, CHECKED_AT } from "./deals.js";
import { discountPct, savedAmount, verdict, money, checkedLabel } from "./signals.js";
import { applyFilters, countByCategory, totalSavings } from "./filters.js";

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function dealCard(d) {
  const v = verdict(d);
  const pct = discountPct(d);
  return (
    '<article class="card">' +
    '<div class="card-top"><span class="cat">' + esc(d.category) + "</span>" +
    '<span class="verdict v-' + v.tone + '">' + esc(v.label) + "</span></div>" +
    '<h3><a href="#/deal/' + esc(d.id) + '">' + esc(d.title) + "</a></h3>" +
    '<p class="store">' + esc(d.store) + "</p>" +
    '<p class="prices"><span class="now">' + money(d.price) + '</span> <s class="was">' + money(d.was) + "</s> " +
    '<span class="pct">−' + pct + "%</span></p>" +
    '<p class="save">Save ' + money(savedAmount(d)) + "</p>" +
    '<p class="checked">Checked ' + esc(checkedLabel(d.checked)) + "</p>" +
    '<a class="buy" href="' + esc(d.url) + '" target="_blank" rel="noopener">View at ' + esc(d.store) + " →</a>" +
    "</article>"
  );
}

export function renderList(root, state) {
  const shown = applyFilters(deals, state);
  const counts = countByCategory(deals);
  const totalSave = totalSavings(deals);
  const catOptions = ['<option value="">All categories</option>'].concat(
    CATEGORIES.map((c) => '<option value="' + esc(c) + '"' + (state.category === c ? " selected" : "") + ">" + esc(c) + " (" + (counts[c] || 0) + ")</option>"),
  ).join("");
  const storeOptions = ['<option value="">All stores</option>'].concat(
    STORES.map((s) => '<option value="' + esc(s) + '"' + (state.store === s ? " selected" : "") + ">" + esc(s) + "</option>"),
  ).join("");
  const discOptions = [["", "Any discount"], ["15", "15% off or more"], ["25", "25% off or more"], ["40", "40% off or more"], ["50", "50% off or more"]]
    .map(([v, l]) => '<option value="' + v + '"' + (String(state.minDiscount || "") === v ? " selected" : "") + ">" + l + "</option>")
    .join("");
  const sortOptions = [["verdict", "Best verdict first"], ["discount", "Biggest % off"], ["saved", "Biggest $ saved"], ["price-low", "Lowest price"], ["price-high", "Highest price"]]
    .map(([v, l]) => '<option value="' + v + '"' + (state.sort === v ? " selected" : "") + ">" + l + "</option>")
    .join("");

  root.innerHTML =
    '<section class="hero">' +
    "<h1>Real Black Friday deals, checked today.</h1>" +
    "<p>44 deals at 5 stores, each price read on 27 November 2026 and traced to the store or deals source that showed it. " +
    "Every card carries its own verdict — a new low, a strong deal, or a routine sale the discount only pretends is one.</p>" +
    '<p class="stats"><strong>' + deals.length + ' deals</strong> · <strong>' + STORES.length + ' stores</strong> · ' +
    "<strong>" + money(totalSave) + " total savings</strong> · checked " + esc(checkedLabel(CHECKED_AT)) + "</p>" +
    "</section>" +
    '<section class="controls" aria-label="Search and filter deals">' +
    '<input id="q" type="search" placeholder="Search deals — try “OLED”, “AirPods”, “LEGO”…" value="' + esc(state.q || "") + '" aria-label="Search deals">' +
    '<select id="f-cat" aria-label="Filter by category">' + catOptions + "</select>" +
    '<select id="f-store" aria-label="Filter by store">' + storeOptions + "</select>" +
    '<select id="f-disc" aria-label="Filter by discount">' + discOptions + "</select>" +
    '<select id="f-sort" aria-label="Sort deals">' + sortOptions + "</select>" +
    '<label class="strong-only"><input id="f-strong" type="checkbox"' + (state.onlyStrong ? " checked" : "") + "> Strong deals only</label>" +
    "</section>" +
    '<p class="count" role="status">Showing ' + shown.length + " of " + deals.length + " deals</p>" +
    (shown.length
      ? '<div class="grid">' + shown.map(dealCard).join("") + "</div>"
      : '<p class="empty">No deals match those filters. Clear the search or lower the discount bar.</p>');
}

export function renderDetail(root, id) {
  const d = deals.find((x) => x.id === id);
  if (!d) {
    root.innerHTML = '<p class="empty">That deal is not on this board. <a href="#/">Back to all deals</a>.</p>';
    return;
  }
  const v = verdict(d);
  const pct = discountPct(d);
  const same = d.group ? deals.filter((x) => x.group === d.group && x.id !== d.id) : [];
  root.innerHTML =
    '<p class="back"><a href="#/">← All deals</a></p>' +
    '<article class="detail">' +
    '<div class="card-top"><span class="cat">' + esc(d.category) + "</span>" +
    '<span class="verdict v-' + v.tone + '">' + esc(v.label) + "</span></div>" +
    "<h1>" + esc(d.title) + "</h1>" +
    '<p class="store big">' + esc(d.store) + "</p>" +
    '<p class="prices big"><span class="now">' + money(d.price) + '</span> <s class="was">' + money(d.was) + "</s> " +
    '<span class="pct">−' + pct + "%</span></p>" +
    '<p class="save big">You save ' + money(savedAmount(d)) + " (" + pct + "% off)</p>" +
    "<h2>Is it really a deal?</h2>" +
    "<p>" + esc(d.evidence) + "</p>" +
    "<h2>How this price was checked</h2>" +
    "<ul>" +
    "<li>Checked: <strong>" + esc(checkedLabel(d.checked)) + "</strong></li>" +
    "<li>Read in: <strong>" + esc(d.source) + "</strong></li>" +
    "<li>Usual price: the store's own list price" + (d.store === "Best Buy" ? ", or its stated saving added to the sale price (its comparable value)" : "") + ".</li>" +
    "</ul>" +
    (same.length
      ? "<h2>Same product at another store</h2><ul>" +
        same.map((o) => "<li><strong>" + esc(o.store) + ":</strong> " + money(o.price) + " (" + discountPct(o) + "% off) — <a href=\"#/deal/" + esc(o.id) + "\">see that deal</a></li>").join("") +
        "</ul><p>Cheapest first is the one to buy; the other listing is kept so you can compare.</p>"
      : "") +
    '<p><a class="buy big" href="' + esc(d.url) + '" target="_blank" rel="noopener">View at ' + esc(d.store) + " →</a></p>" +
    "</article>";
}

export function renderAbout(root) {
  root.innerHTML =
    '<article class="detail"><h1>How every deal on this board was checked</h1>' +
    "<p>Each deal was found and checked by the agent that built this site on Black Friday itself, 27 November 2026. " +
    "No price here is guessed, carried over from an old sale, or copied from another deal site's roundup without a named store behind it.</p>" +
    "<h2>The check, deal by deal</h2>" +
    "<ol>" +
    "<li>Read the price at the store, or in a deals source that names the store and quotes the store's own price.</li>" +
    "<li>Recorded the sale price, the store's usual price, the store, and the exact time the price was read.</li>" +
    "<li>Named the source on the deal's own page, so you can check it yourself.</li>" +
    "<li>Left out any deal whose price could not be traced to a store or a named source.</li>" +
    "</ol>" +
    "<h2>Reading the verdict</h2>" +
    "<ul>" +
    "<li><strong>New low</strong> — a source calls it the lowest price ever recorded for that product.</li>" +
    "<li><strong>Strong deal</strong> — 40% or more off the usual price.</li>" +
    "<li><strong>Good deal</strong> — 25–39% off.</li>" +
    "<li><strong>Decent deal</strong> — 15–24% off.</li>" +
    "<li><strong>Routine sale</strong> — under 15% off, or a cut that another price (education pricing, a gift card) beats.</li>" +
    "</ul>" +
    "<h2>About the “usual” price</h2>" +
    "<p>Best Buy states a saving rather than a usual price, so its usual price here is the sale price plus the saving Best Buy states. " +
    "That is Best Buy's comparable value — a reference number, not proof the item ever sold at that price. " +
    "A percentage alone can mislead, which is why every deal also carries the evidence behind its verdict.</p>" +
    "<h2>Prices move</h2>" +
    "<p>Black Friday prices change through the day and sell out. The check time on each deal is when its price was read; " +
    "always confirm the price at the store before you pay. This board covers Black Friday, 27 November, through Cyber Monday, 30 November 2026.</p>" +
    '<p><a href="#/">← Back to all deals</a></p></article>';
}
