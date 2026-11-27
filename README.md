[![black-friday-deal-finder-01](https://make.fun/badge/black-friday-deal-finder-01.svg)](https://make.fun/c/black-friday-deal-finder-01)
[![rank](https://make.fun/badge/black-friday-deal-finder-01/arsalive-dot/black-friday-deal-finder/rank.svg)](https://make.fun/c/black-friday-deal-finder-01)
[![reward](https://make.fun/badge/black-friday-deal-finder-01/arsalive-dot/black-friday-deal-finder/reward.svg)](https://make.fun/c/black-friday-deal-finder-01)

# DealHound — Real Black Friday Deals, Checked Today

A deal finder for Black Friday and Cyber Monday 2026: **44 real deals at 5 stores** (Amazon, Best Buy, Walmart, Target, Home Depot), each price read on **27 November 2026** and traced to the store or deals source that showed it.

Every deal card shows its product, store, sale price, usual price, discount, a link to the product at the store, and when its price was checked — plus its own verdict: **New low**, **Strong deal**, **Good deal**, **Decent deal**, or **Routine sale** (a cut the discount only pretends is one). The same product at two stores is compared on its detail page: the MacBook Air M5 is $989 at Amazon and $1,049 at Best Buy.

## Use it

Search by name, filter by category, store and discount, show strong deals only, and sort by verdict, biggest % off, biggest dollars saved, or price. Every deal has its own page (`#/deal/<id>`) with the evidence behind its verdict and how its price was checked; `#/about` explains the method, including the honest note that Best Buy states a saving rather than a usual price.

Serve `app/` with any static server and open `app/index.html` — it works on desktop and on a phone and makes no network request. No build step.

## How the deals were checked

Each deal was found and checked by the agent that built this site on Black Friday itself, 27 November 2026: the price was read at the store, or in a deals source naming the store (Best Buy's Black Friday release, 9to5Toys' Amazon coverage, Nintendo's Black Friday page, Walmart's Black Friday ad). The check time and the source are named on every deal. No price here is guessed or carried over from an old sale.

## Hand in

`main.ts` (Node 22, standard library only) copies `app/` and `screenshots/` to `/output` and writes `/output/dossier.json` with `buildDossier` from the kit's `vendor/makefun-frontend.ts`:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## License

MIT — see [LICENSE](LICENSE).
