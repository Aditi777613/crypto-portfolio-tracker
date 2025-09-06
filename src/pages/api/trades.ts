// src/pages/api/trades.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

const prisma = new PrismaClient();

const SYMBOL_TO_ID: Record<string, string> = {
  BTC: "bitcoin",
  ETH: "ethereum",
  USDT: "tether",
  USDC: "usd-coin",
  XMR: "monero",
  SOL: "solana",
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.email) return res.status(401).json({ error: "Not authenticated" });

  const email = session.user.email;

  if (req.method === "GET") {
    const trades = await prisma.trade.findMany({
      where: { user: { email } },
      orderBy: { createdAt: "desc" },
      take: 10,
    });
    return res.status(200).json(trades);
  }

  if (req.method === "POST") {
    const { coin, type, usd } = req.body as { coin: string; type: "buy" | "sell"; usd: number };
    if (!coin || !type || typeof usd !== "number") return res.status(400).json({ error: "Missing fields" });

    const coinId = SYMBOL_TO_ID[coin];
    if (!coinId) return res.status(400).json({ error: "Unsupported coin" });

    // fetch price
    const priceResp = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${coinId}&vs_currencies=usd`);
    if (!priceResp.ok) return res.status(500).json({ error: "Price fetch failed" });
    const priceJson = await priceResp.json();
    const price = priceJson[coinId]?.usd;
    if (!price) return res.status(500).json({ error: "Price unavailable" });

    const coinAmount = usd / price;
    const user = await prisma.user.findUnique({ where: { email }, include: { holdings: true } });
    if (!user) return res.status(404).json({ error: "User not found" });

    if (type === "buy") {
      if (user.balance < usd) return res.status(400).json({ error: "Insufficient balance" });

      // find holding
      const existing = user.holdings.find((h) => h.coin === coin);
      const ops: any[] = [];

      if (existing) {
        ops.push(prisma.holding.update({
          where: { id: existing.id },
          data: { amount: existing.amount + coinAmount },
        }));
      } else {
        ops.push(prisma.holding.create({
          data: { userId: user.id, coin, amount: coinAmount },
        }));
      }

      ops.push(prisma.trade.create({
        data: { userId: user.id, coin, amount: coinAmount, usdValue: usd, type: "buy" },
      }));

      ops.push(prisma.user.update({
        where: { id: user.id },
        data: { balance: user.balance - usd },
      }));

      await prisma.$transaction(ops);
      return res.status(201).json({ message: "Buy executed" });
    } else {
      // sell
      const existing = user.holdings.find((h) => h.coin === coin);
      if (!existing || existing.amount < coinAmount) {
        return res.status(400).json({ error: "Not enough holdings to sell" });
      }

      const ops: any[] = [];
      if (existing.amount - coinAmount <= 0) {
        ops.push(prisma.holding.delete({ where: { id: existing.id } }));
      } else {
        ops.push(prisma.holding.update({
          where: { id: existing.id },
          data: { amount: existing.amount - coinAmount },
        }));
      }

      ops.push(prisma.trade.create({
        data: { userId: user.id, coin, amount: coinAmount, usdValue: usd, type: "sell" },
      }));

      ops.push(prisma.user.update({
        where: { id: user.id },
        data: { balance: user.balance + usd },
      }));

      await prisma.$transaction(ops);
      return res.status(201).json({ message: "Sell executed" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
