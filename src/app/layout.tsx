// src/app/layout.tsx
"use client";
import "./globals.css";
import { useEffect, useState } from "react";
import { SessionProvider } from "next-auth/react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const t = (localStorage.getItem("theme") as "light" | "dark") || "light";
    setTheme(t);
    document.documentElement.setAttribute("data-theme", t);
  }, []);

  function toggle() {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.setAttribute("data-theme", next);
  }

  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <div className="p-3 border-b card">
            <div className="max-w-4xl mx-auto flex justify-between items-center">
              <div className="font-semibold">Crypto Portfolio Tracker</div>
              <div>
                <button 
                  onClick={toggle} 
                  className="px-3 py-1 border rounded hover:opacity-80 transition-opacity"
                  style={{ 
                    backgroundColor: theme === "light" ? "#f1f5f9" : "#334155",
                    color: theme === "light" ? "#0f172a" : "#f1f5f9"
                  }}
                >
                  {theme === "light" ? "🌙 Dark" : "☀️ Light"} mode
                </button>
              </div>
            </div>
          </div>
          {children}
        </SessionProvider>
      </body>
    </html>
  );
}

