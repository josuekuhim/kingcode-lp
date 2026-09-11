import type { Metadata } from "next";
import "./globals.css";

const publicBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const metadata: Metadata = {
  title: "KingCode — Intelligent model orchestration",
  description:
    "The AI development orchestrator that routes every task to the best model.",
  icons: {
    icon: `${publicBasePath}/favicon.svg`,
  },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
