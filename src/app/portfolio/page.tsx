// src/app/portfolio/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

type Holding = { coin: string; amount: number };
type Price = { id: string; symbol: string; price: number | null; change_24h: number | null };

export default function PortfolioPage() {
  const { data: session } = useSession();
  const [holdings, setHoldings] = useState<Holding[]>([]);
  const [balance, setBalance] = useState<number>(10000);
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
      // If user is not authenticated or not found, show initial balance
      setBalance(portRes.balance ?? 10000);
    } catch (e) {
      console.error(e);
      // On error, show initial balance
      setBalance(10000);
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
  const initialBalance = 10000;
  const profitLoss = total - initialBalance;
  const profitLossPercentage = (profitLoss / initialBalance) * 100;

  return (
    <main className="min-h-screen p-4 max-w-4xl mx-auto">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Portfolio</h1>
        <div className="space-x-2">
          <Link href="/" className="px-3 py-1 border rounded">Home</Link>
          <Link href="/trade" className="px-3 py-1 border rounded">Trade</Link>
          {session ? (
            <button
              onClick={() => signOut()}
              className="px-3 py-1 border rounded hover:bg-gray-50"
            >
              Logout
            </button>
          ) : (
            <Link href="/login" className="px-3 py-1 border rounded">Login</Link>
          )}
        </div>
      </header>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <section className="rounded-lg p-4 shadow card">
          <div className="mb-4">
            <div className="text-sm text-muted">Cash balance</div>
            <div className="text-xl font-semibold">${balance.toFixed(2)}</div>
          </div>

          <div className="mb-4">
            <div className="text-sm text-muted">Holdings value</div>
            <div className="text-xl font-semibold">${holdingsValue.toFixed(2)}</div>
          </div>

          <div className="mb-4">
            <div className="text-sm text-muted">Total portfolio value</div>
            <div className="text-xl font-semibold">${total.toFixed(2)}</div>
          </div>

          <div className="mb-4">
            <div className="text-sm text-muted">Profit/Loss</div>
            <div className={`text-xl font-semibold ${
              profitLoss === 0 ? "text-black" : 
              profitLoss > 0 ? "text-green-600" : "text-red-600"
            }`}>
              {profitLoss > 0 ? "+" : ""}${profitLoss.toFixed(2)}
            </div>
          </div>

          <div className="mt-6">
            <h3 className="font-medium mb-2">Holdings</h3>
            <div className="grid gap-2">
              {holdings.length === 0 && <div>No holdings yet.</div>}
              {holdings.map((h) => {
                const p = prices.find((x) => x.symbol === h.coin);
                const value = p?.price ? p.price * h.amount : 0;
                const change24h = p?.change_24h || 0;
                return (
                  <div key={h.coin} className="p-3 border rounded flex justify-between card">
                    <div>
                      <div className="text-sm font-medium">{h.coin}</div>
                      <div className="text-sm text-muted">{h.amount.toFixed(6)} {h.coin}</div>
                      {p && (
                        <div className={`text-xs ${change24h >= 0 ? "text-green-600" : "text-red-600"}`}>
                          {change24h >= 0 ? "+" : ""}{change24h.toFixed(2)}% (24h)
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="font-medium">${value.toFixed(2)}</div>
                      <div className="text-xs text-muted">{p ? `$${p.price?.toFixed(4) ?? "—"}/unit` : "—"}</div>
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
