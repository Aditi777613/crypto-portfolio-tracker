// src/app/layout.tsx
"use client";
import "./globals.css";
import { useEffect, useState } from "react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const t = (localStorage.getItem("theme") as "light" | "dark") || "light";
    setTheme(t);
    document.documentElement.classList.toggle("dark", t === "dark");
  }, []);

  function toggle() {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
  }

  return (
    <html lang="en">
      <body className="bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100">
        <div className="p-3 border-b bg-white/60 dark:bg-slate-800/60">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            <div className="font-semibold">Crypto Portfolio Tracker</div>
            <div>
              <button onClick={toggle} className="px-3 py-1 border rounded">
                {theme === "light" ? "Dark" : "Light"} mode
              </button>
            </div>
          </div>
        </div>
        {children}
      </body>
    </html>
  );
}

