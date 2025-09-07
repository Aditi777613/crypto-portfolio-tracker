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

// Simple in-memory cache to avoid hitting CoinGecko rate limits
type PriceItem = {
  id: string;
  symbol: string;
  price: number | null;
  change_24h: number | null;
};

let cachedData: PriceItem[] | null = null;
let lastFetch = 0;
const CACHE_DURATION = 30000; // 30 seconds

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const now = Date.now();
    
    // Return cached data if it's still fresh
    if (cachedData && (now - lastFetch) < CACHE_DURATION) {
      res.setHeader("Cache-Control", "no-cache");
      res.status(200).json(cachedData);
      return;
    }

    const ids = COINS.map((c) => c.id).join(",");
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`;
    
    const r = await fetch(url);
    
    if (!r.ok) {
      // If API fails, return cached data if available
      if (cachedData) {
        res.setHeader("Cache-Control", "no-cache");
        res.status(200).json(cachedData);
        return;
      }
      res.status(r.status).json({ error: "CoinGecko error" });
      return;
    }
    
    const data = (await r.json()) as Record<string, { usd?: number; usd_24h_change?: number }>;

    const mapped: PriceItem[] = COINS.map((c) => ({
      id: c.id,
      symbol: c.symbol,
      price: data[c.id]?.usd ?? null,
      change_24h: data[c.id]?.usd_24h_change ?? null,
    }));

    // Update cache
    cachedData = mapped;
    lastFetch = now;

    res.setHeader("Cache-Control", "no-cache");
    res.status(200).json(mapped);
  } catch (err) {
    console.error(err);
    // Return cached data if available on error
    if (cachedData) {
      res.setHeader("Cache-Control", "no-cache");
      res.status(200).json(cachedData);
      return;
    }
    res.status(500).json({ error: "internal" });
  }
}
