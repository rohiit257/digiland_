import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { WalletContextProvider } from "@/context/wallet";
import { Toaster } from "./components/ui/sonner";
import { Analytics } from '@vercel/analytics/next';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "LandLedger",
  description: "This is a decentralized land record management system that leverages Blockchain, AI, and IPFS to securely store and verify property ownership records. It ensures transparency, immutability, and fraud detection in property transactions.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className={geistMono.className}>
        <WalletContextProvider>
          {children}
          <Analytics/>
          <Toaster/>
        </WalletContextProvider>
      </body>
    </html>
  );
}
