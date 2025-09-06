import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";
import type { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { email, password } = req.body;

  if (!email || !password) return res.status(400).json({ error: "Missing fields" });

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return res.status(400).json({ error: "User already exists" });

  const hashed = await hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashed,
      balance: 10000, // start with 10k USD
    },
  });

  return res.status(201).json({ message: "User created", user });
}
