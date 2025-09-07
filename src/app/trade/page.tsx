// src/app/trade/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

const COINS = ["BTC", "ETH", "USDT", "USDC", "XMR", "SOL"] as const;
type Coin = typeof COINS[number];

export default function TradePage() {
  const { data: session } = useSession();
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [coin, setCoin] = useState<Coin>("BTC");
  const [usd, setUsd] = useState<number>(100);
  const [type, setType] = useState<"buy" | "sell">("buy");
  const [trades, setTrades] = useState<Array<{
    id: string;
    coin: string;
    amount: number;
    usdValue: number;
    type: string;
    createdAt: string;
  }>>([]);
  const [loading, setLoading] = useState(false);

  async function fetchPrices() {
    const res = await fetch("/api/prices");
    const data = await res.json();
    const map: Record<string, number> = {};
    data.forEach((p: { symbol: string; price: number | null }) => {
      map[p.symbol] = p.price ?? 0;
    });
    setPrices(map);
  }

  async function fetchTrades() {
    try {
      const res = await fetch("/api/trades");
      const data = await res.json();
      // Ensure data is an array before setting it
      if (Array.isArray(data)) {
        setTrades(data);
      } else {
        setTrades([]);
      }
    } catch (error) {
      console.error("Error fetching trades:", error);
      setTrades([]);
    }
  }

  useEffect(() => {
    fetchPrices();
    fetchTrades();
    const id = setInterval(() => {
      fetchPrices();
      fetchTrades();
    }, 30_000);
    return () => clearInterval(id);
  }, []);

  const unitPrice = prices[coin] ?? 0;
  const coinAmount = unitPrice ? usd / unitPrice : 0;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/trades", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ coin, type, usd: Number(usd) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Trade failed");
      // refresh
      await Promise.all([fetchPrices(), fetchTrades()]);
      alert("Trade executed");
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen p-4 max-w-4xl mx-auto">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Trade</h1>
        <div className="space-x-2">
          <Link href="/" className="px-3 py-1 border rounded">Home</Link>
          <Link href="/portfolio" className="px-3 py-1 border rounded">Portfolio</Link>
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

      {!session && (
        <section className="rounded-lg p-4 shadow mb-6 card bg-yellow-50 border-yellow-200">
          <div className="text-center">
            <h3 className="text-lg font-medium text-yellow-800 mb-2">Authentication Required</h3>
            <p className="text-yellow-700 mb-4">
              You need to be logged in to make trades. Your portfolio data will be saved to your account.
            </p>
            <Link
              href="/login"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Sign In
            </Link>
          </div>
        </section>
      )}

      <section className="rounded-lg p-4 shadow mb-6 card">
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm">Coin</label>
            <select value={coin} onChange={(e) => setCoin(e.target.value as Coin)} className="mt-1 p-2 border rounded w-full">
              {COINS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm">Type</label>
            <select value={type} onChange={(e) => setType(e.target.value as "buy" | "sell")} className="mt-1 p-2 border rounded w-full">
              <option value="buy">Buy</option>
              <option value="sell">Sell</option>
            </select>
          </div>

          <div>
            <label className="block text-sm">Amount (USD)</label>
            <input type="number" value={usd} onChange={(e) => setUsd(Number(e.target.value))} className="mt-1 p-2 border rounded w-full" min="0" step="0.01"/>
            <div className="text-xs text-muted mt-1">≈ {coinAmount ? coinAmount.toFixed(6) : "0"} {coin} @ ${unitPrice?.toFixed(4) ?? "—"}</div>
          </div>

          <div>
            <button 
              type="submit" 
              disabled={loading || !session} 
              className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Processing..." : `${type === "buy" ? "Buy" : "Sell"} ${coin}`}
            </button>
          </div>
        </form>
      </section>

      <section className="rounded-lg p-4 shadow card">
        <h3 className="font-medium mb-2">Last 10 Trades</h3>
        {trades.length === 0 ? <div>No trades yet.</div> : (
          <table className="w-full text-sm">
            <thead className="text-left text-muted">
              <tr><th>Time</th><th>Type</th><th>Coin</th><th>Amount</th><th>USD</th></tr>
            </thead>
            <tbody>
              {trades.map((t) => (
                <tr key={t.id} className="border-t">
                  <td className="py-2">{new Date(t.createdAt).toLocaleString()}</td>
                  <td className="py-2">{t.type}</td>
                  <td className="py-2">{t.coin}</td>
                  <td className="py-2">{Number(t.amount).toFixed(6)}</td>
                  <td className="py-2">${Number(t.usdValue).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </main>
  );
}
