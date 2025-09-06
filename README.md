# Crypto Portfolio Tracker

A modern crypto portfolio tracking application with mock trading functionality for BTC, ETH, USDT, USDC, XMR, and SOL.

## Features

- **Live Crypto Prices**: Real-time prices from CoinGecko API with 30-second auto-refresh
- **Portfolio Dashboard**: Track holdings, cash balance, and profit/loss with $10,000 starting balance
- **Mock Trading**: Buy/sell functionality with real-time price conversion
- **Authentication**: Secure login/register system with NextAuth
- **Trade History**: View last 10 trades with detailed information
- **Responsive Design**: Mobile-friendly UI with dark/light mode toggle
- **Real-time Updates**: Auto-refreshing data across all pages

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Database**: SQLite with Prisma ORM
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS
- **API**: CoinGecko (free tier)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd crypto-portfolio-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Create .env.local file
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000
DATABASE_URL="file:./dev.db"
```

4. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. **Homepage**: View live crypto prices with 24h changes
2. **Register/Login**: Create an account or sign in
3. **Portfolio**: View your $10,000 starting balance and holdings
4. **Trade**: Buy/sell cryptocurrencies with real-time prices

## Deployment on Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set environment variables in Vercel dashboard:
   - `NEXTAUTH_SECRET`: Generate a random secret
   - `NEXTAUTH_URL`: Your Vercel domain
   - `DATABASE_URL`: Use a hosted database (e.g., PlanetScale, Supabase)
4. Deploy!

## Architecture

- **Frontend**: Next.js App Router with TypeScript
- **Backend**: Next.js API routes
- **Database**: Prisma ORM with SQLite (development) / PostgreSQL (production)
- **Authentication**: NextAuth.js with credentials provider
- **External APIs**: CoinGecko for live crypto prices

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── login/          # Authentication pages
│   ├── portfolio/      # Portfolio dashboard
│   ├── trade/          # Trading interface
│   └── page.tsx        # Homepage
├── pages/api/          # API routes
│   ├── auth/           # NextAuth configuration
│   ├── portfolio.ts    # Portfolio data
│   ├── prices.ts       # Crypto prices
│   ├── register.ts     # User registration
│   └── trades.ts       # Trading operations
└── prisma/             # Database schema and migrations
```

## Demo

[Live Demo on Vercel](https://your-app.vercel.app)

## License

MIT License
