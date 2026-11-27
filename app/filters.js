// Filtering and sorting for the deal list. Every filter is pure: it takes
// the deals and a state object and returns a new array, so the list view can
// re-run it on any control change without touching the data.

import { discountPct, savedAmount, verdict } from "./signals.js";

export function applyFilters(deals, state) {
  const q = (state.q || "").trim().toLowerCase();
  let out = deals.filter((d) => {
    if (state.category && d.category !== state.category) return false;
    if (state.store && d.store !== state.store) return false;
    if (state.minDiscount && discountPct(d) < Number(state.minDiscount)) return false;
    if (state.onlyStrong && verdict(d).rank < 2) return false;
    if (q) {
      const hay = (d.title + " " + d.store + " " + d.category).toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
  switch (state.sort) {
    case "discount":
      out = out.slice().sort((a, b) => discountPct(b) - discountPct(a));
      break;
    case "saved":
      out = out.slice().sort((a, b) => savedAmount(b) - savedAmount(a));
      break;
    case "price-low":
      out = out.slice().sort((a, b) => a.price - b.price);
      break;
    case "price-high":
      out = out.slice().sort((a, b) => b.price - a.price);
      break;
    case "verdict":
    default:
      out = out.slice().sort((a, b) => verdict(b).rank - verdict(a).rank || discountPct(b) - discountPct(a));
      break;
  }
  return out;
}

export function countByCategory(deals) {
  const counts = {};
  for (const d of deals) counts[d.category] = (counts[d.category] || 0) + 1;
  return counts;
}

export function totalSavings(deals) {
  return deals.reduce((sum, d) => sum + savedAmount(d), 0);
}
