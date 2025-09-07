# Crypto Portfolio Tracker

A modern, full-stack cryptocurrency portfolio tracking application with mock trading functionality built with Next.js, TypeScript, and NextAuth.js.

## 🚀 Live Demo

[Deploy on Vercel](https://your-app.vercel.app) - *Coming Soon*

## 📋 Features

### Core Features (All Required)
- **Live Crypto Prices**: Real-time prices for BTC, ETH, USDT, USDC, XMR, and SOL
- **Auto-refresh**: Prices update every 30 seconds
- **24h Price Changes**: Visual indicators for price movements
- **Authentication**: Secure login/register with NextAuth.js
- **Portfolio Dashboard**: Track holdings, total value, and profit/loss
- **Mock Trading**: Buy/sell functionality with $10,000 starting balance
- **Trade History**: View last 10 trades with individual P/L tracking
- **Mobile Responsive**: Optimized for all device sizes

### Bonus Features
- **Real-time Updates**: Live price updates every 30 seconds
- **Dark/Light Mode**: Toggle between themes
- **PWA Ready**: Progressive Web App capabilities
- **Exit Positions**: Close holdings with one click
- **Individual Trade P/L**: Track performance of each trade

## 🛠️ Tech Stack

- **Framework**: Next.js 15.5.2 (App Router)
- **Language**: TypeScript
- **Authentication**: NextAuth.js with credentials provider
- **Database**: Prisma with SQLite (dev) / PostgreSQL (prod)
- **Styling**: Tailwind CSS
- **API**: CoinGecko (free tier)
- **Deployment**: Vercel

## 🏗️ Architecture

```
src/
├── app/                    # Next.js App Router
│   ├── login/             # Authentication pages
│   ├── register/          # User registration
│   ├── portfolio/         # Portfolio dashboard
│   ├── trade/             # Trading interface
│   ├── layout.tsx         # Root layout with providers
│   └── page.tsx           # Homepage with live prices
├── pages/api/             # API routes
│   ├── auth/              # NextAuth configuration
│   ├── portfolio.ts       # Portfolio data
│   ├── prices.ts          # Crypto prices from CoinGecko
│   ├── register.ts        # User registration
│   └── trades.ts          # Trading operations
└── prisma/                # Database schema and migrations
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/crypto-portfolio-tracker.git
   cd crypto-portfolio-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Add the following to `.env.local`:
   ```env
   NEXTAUTH_SECRET=your-secret-key-here
   NEXTAUTH_URL=http://localhost:3000
   DATABASE_URL="file:./dev.db"
   ```

4. **Set up the database**
   ```bash
   npx prisma migrate dev
   npx prisma generate
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 Usage

### Getting Started
1. **Register** a new account or **login** with existing credentials
2. **View live prices** on the homepage (auto-refreshes every 30 seconds)
3. **Start trading** with your $10,000 mock USD balance
4. **Track your portfolio** and see real-time profit/loss
5. **Exit positions** anytime with the Exit button

### Trading
- **Buy/Sell** any of the 6 supported cryptocurrencies
- **Real-time conversion** shows exact amounts
- **Portfolio updates** immediately after trades
- **View trade history** with individual P/L tracking

### Portfolio Management
- **Monitor holdings** and their current values
- **Track total portfolio** value and overall P/L
- **Exit positions** to close trades
- **View 24h changes** for each holding

## 🔧 API Endpoints

- `GET /api/prices` - Fetch live crypto prices
- `GET /api/portfolio` - Get user portfolio data
- `POST /api/trades` - Execute buy/sell trades
- `POST /api/register` - Register new user
- `POST /api/auth/signin` - User authentication

## 🎨 Design Features

- **Mobile-first responsive design**
- **Dark/Light mode toggle**
- **Clean, professional UI**
- **Color-coded profit/loss indicators**
- **Intuitive navigation**
- **Loading states and error handling**

## 🚀 Deployment

### Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Connect to Vercel**
   - Import your GitHub repository
   - Set environment variables in Vercel dashboard
   - Deploy automatically

3. **Environment Variables for Production**
   ```env
   NEXTAUTH_SECRET=your-production-secret
   NEXTAUTH_URL=https://your-app.vercel.app
   DATABASE_URL=your-production-database-url
   ```

## 🧪 Testing

The application includes:
- **Error handling** for API failures
- **Input validation** for forms
- **Authentication checks** for protected routes
- **Responsive design** testing

## 📊 Database Schema

```sql
User {
  id: String (Primary Key)
  email: String (Unique)
  password: String (Hashed)
  balance: Float (Default: 10000)
  trades: Trade[]
  holdings: Holding[]
}

Holding {
  id: String (Primary Key)
  userId: String (Foreign Key)
  coin: String
  amount: Float
}

Trade {
  id: String (Primary Key)
  userId: String (Foreign Key)
  coin: String
  amount: Float
  usdValue: Float
  type: String (buy/sell)
  createdAt: DateTime
}
```

## 🔒 Security Features

- **Password hashing** with bcrypt
- **JWT-based sessions** with NextAuth.js
- **Input validation** and sanitization
- **Protected API routes**
- **CSRF protection**

## 🎯 Performance

- **Auto-refresh** every 30 seconds
- **Optimized API calls** with caching
- **Lazy loading** for better performance
- **Mobile-optimized** images and assets

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

## 📞 Support

For questions or support, please open an issue on GitHub.

---

**Built with ❤️ using Next.js, TypeScript, and modern web technologies**