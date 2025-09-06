// src/app/portfolio/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";

type Holding = { coin: string; amount: number };
type Price = { id: string; symbol: string; price: number | null; change_24h: number | null };

export default function PortfolioPage() {
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [balance, setBalance] = useState<number>(0);
  const [prices, setPrices] = useState<Price[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchAll() {
    setLoading(true);
    try {
      const [pRes, portRes] = await Promise.all([
        fetch("/api/prices").then((r) => r.json()),
        fetch("/api/portfolio").then((r) => r.json()),
      ]);
      setPrices(pRes || []);
      setHoldings(portRes.holdings || []);
      setBalance(portRes.balance ?? 0);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAll();
    const id = setInterval(fetchAll, 30_000);
    return () => clearInterval(id);
  }, []);

  const holdingsValue = holdings.reduce((acc, h) => {
    const p = prices.find((x) => x.symbol === h.coin);
    const value = p?.price ? p.price * h.amount : 0;
    return acc + value;
  }, 0);

  const total = holdingsValue + (balance ?? 0);
  const profitLoss = total - 10000;

  return (
    <main className="min-h-screen p-4 max-w-4xl mx-auto">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Portfolio</h1>
        <div className="space-x-2">
          <Link href="/" className="px-3 py-1 border rounded">Home</Link>
          <Link href="/trade" className="px-3 py-1 border rounded">Trade</Link>
        </div>
      </header>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <section className="bg-white/80 dark:bg-slate-800/80 rounded-lg p-4 shadow">
          <div className="mb-4">
            <div className="text-sm text-slate-500">Cash balance</div>
            <div className="text-xl font-semibold">${balance.toFixed(2)}</div>
          </div>

          <div className="mb-4">
            <div className="text-sm text-slate-500">Holdings value</div>
            <div className="text-xl font-semibold">${holdingsValue.toFixed(2)}</div>
          </div>

          <div className="mb-4">
            <div className="text-sm text-slate-500">Total portfolio value</div>
            <div className="text-xl font-semibold">${total.toFixed(2)}</div>
            <div className={`mt-1 ${profitLoss >= 0 ? "text-green-600" : "text-red-600"}`}>
              ${profitLoss.toFixed(2)} {profitLoss >= 0 ? "profit" : "loss"}
            </div>
          </div>

          <div className="mt-6">
            <h3 className="font-medium mb-2">Holdings</h3>
            <div className="grid gap-2">
              {holdings.length === 0 && <div>No holdings yet.</div>}
              {holdings.map((h) => {
                const p = prices.find((x) => x.symbol === h.coin);
                const value = p?.price ? p.price * h.amount : 0;
                return (
                  <div key={h.coin} className="p-3 border rounded flex justify-between">
                    <div>
                      <div className="text-sm">{h.coin}</div>
                      <div className="text-sm text-slate-500">{h.amount.toFixed(6)} {h.coin}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium">${value.toFixed(2)}</div>
                      <div className="text-xs text-slate-500">{p ? `$${p.price?.toFixed(4) ?? "—"}/unit` : "—"}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
