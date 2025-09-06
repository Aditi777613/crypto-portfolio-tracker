// src/pages/api/prices.ts
import type { NextApiRequest, NextApiResponse } from "next";

const COINS = [
  { id: "bitcoin", symbol: "BTC" },
  { id: "ethereum", symbol: "ETH" },
  { id: "tether", symbol: "USDT" },
  { id: "usd-coin", symbol: "USDC" },
  { id: "monero", symbol: "XMR" },
  { id: "solana", symbol: "SOL" },
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const ids = COINS.map((c) => c.id).join(",");
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`;
    const r = await fetch(url);
    if (!r.ok) return res.status(r.status).json({ error: "CoinGecko error" });
    const data = await r.json();

    const mapped = COINS.map((c) => ({
      id: c.id,
      symbol: c.symbol,
      price: data[c.id]?.usd ?? null,
      change_24h: data[c.id]?.usd_24h_change ?? null,
    }));

    // cache on Vercel edge for 30s
    res.setHeader("Cache-Control", "s-maxage=30, stale-while-revalidate=60");
    return res.status(200).json(mapped);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "internal" });
  }
}
