import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import React from 'react';
import Link from 'next/link';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PairWiz",
  description: "Combination and Permutation Tool",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
      <header className="mx-auto flex flex-col justify-between w-full py-2 px-5 mb-4 bg-slate-500 sticky top-0 left-0 z-10 shadow-sm">
        <nav className="w-full flex items-center justify-center border-black">
          <Link className="grid place-items-center m-3 w-[38px] px-2 py-1 rounded-lg border border-gray-500 focus:border-2 focus:border-gray-800 bg-gray-300" href="/permute">
            ➕ <span className="hidden">Combinatorics</span>
          </Link>
          <Link className="grid place-items-center m-3 w-[38px] px-2 py-1 rounded-lg border border-gray-500 focus:border-2 focus:border-gray-800 bg-gray-300" href="/minuspermute">
            ➖ <span className="hidden">Combinatorics</span>
          </Link>
          <Link className="grid place-items-center m-3 w-[38px] px-2 py-1 rounded-lg border border-gray-500 focus:border-2 focus:border-gray-800 bg-gray-300" href="/productpermute">
            ❌ <span className="hidden">Combinatorics</span>
          </Link>
        
        </nav>
        <h1 className="flex-1 font-bold text-center text-xl text-white">Unleash the Power of Combinatorics & Permutation!</h1>
      </header>
      <main className={inter.className}>{children}
      </main>
    </body>
    </html >
  );
}
