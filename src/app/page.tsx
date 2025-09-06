// src/app/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";

type Coin = { id: string; symbol: string; price: number | null; change_24h: number | null };

export default function HomePage() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(false);

  async function fetchPrices() {
    try {
      setLoading(true);
      const res = await fetch("/api/prices");
      const data = await res.json();
      setCoins(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPrices();
    const id = setInterval(fetchPrices, 30_000); // 30s
    return () => clearInterval(id);
  }, []);

  return (
    <main className="min-h-screen p-4 max-w-4xl mx-auto">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Crypto Portfolio Tracker</h1>
        <div className="space-x-2">
          <Link href="/portfolio" className="px-3 py-1 border rounded">Portfolio</Link>
          <Link href="/trade" className="px-3 py-1 border rounded">Trade</Link>
          <Link href="/login" className="px-3 py-1 border rounded">Login</Link>
        </div>
      </header>

      <section className="bg-white/80 dark:bg-slate-800/80 rounded-lg p-4 shadow">
        <h2 className="text-lg font-medium mb-3">Live Prices</h2>
        {loading && coins.length === 0 ? (
          <div>Loading...</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {coins.map((c) => (
              <div key={c.id} className="p-3 border rounded">
                <div className="text-sm text-slate-500">{c.symbol}</div>
                <div className="text-xl font-semibold">{c.price ? `$${c.price.toFixed(2)}` : "—"}</div>
                <div className={`text-sm ${c.change_24h && c.change_24h >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {c.change_24h ? `${c.change_24h.toFixed(2)}% (24h)` : "—"}
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="mt-4 text-xs text-slate-500">Auto-refreshes every 30s</div>
      </section>
    </main>
  );
}
