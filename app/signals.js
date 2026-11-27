// The "is it really a deal" verdict. A percentage alone misleads, because the
// retailer picks the "was" price, so the verdict pairs the discount with the
// evidence the deal carries: a source-named all-time low beats a big
// percentage on a shaky reference price.

export function discountPct(deal) {
  if (!deal.was || deal.was <= deal.price) return 0;
  return Math.round(((deal.was - deal.price) / deal.was) * 100);
}

export function savedAmount(deal) {
  return Math.max(0, Math.round((deal.was - deal.price) * 100) / 100);
}

// Returns { label, rank, tone } — rank 4 is the strongest, for sorting.
export function verdict(deal) {
  const pct = discountPct(deal);
  if (deal.low) return { label: "New low", rank: 4, tone: "low" };
  if (pct >= 40) return { label: "Strong deal", rank: 3, tone: "strong" };
  if (pct >= 25) return { label: "Good deal", rank: 2, tone: "good" };
  if (pct >= 15) return { label: "Decent deal", rank: 1, tone: "decent" };
  return { label: "Routine sale", rank: 0, tone: "routine" };
}

export function money(n) {
  return "$" + n.toFixed(2).replace(/\.00$/, "");
}

export function checkedLabel(iso) {
  const d = new Date(iso);
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const hh = String(d.getUTCHours()).padStart(2, "0");
  const mm = String(d.getUTCMinutes()).padStart(2, "0");
  return months[d.getUTCMonth()] + " " + d.getUTCDate() + ", " + hh + ":" + mm + " UTC";
}
