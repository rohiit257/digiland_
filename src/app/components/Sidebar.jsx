"use client";

import Link from "next/link";
import { useContext } from "react";
import { WalletContext } from "@/context/wallet";

const Sidebar = ({ title, links }) => {
  const { isConnected, userAddress } = useContext(WalletContext);

  return (
    <aside className="w-64 bg-zinc-900 text-slate-50 p-6 min-h-screen flex flex-col justify-between">
      {/* Sidebar Header */}
      <div>
        <h1 className="text-2xl font-bold text-center">{title}</h1>
        <hr  className="mt-4"/>
        <nav className="mt-6">
          <ul className="space-y-4">
            {links.map((link, index) => (
              <li key={index}>
                <Link href={link.href} className="px-4 py-2 hover:bg-zinc-700 rounded-md flex items-center gap-2">
                  {link.icon} {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Wallet Address Section */}
      <div className="mt-6 p-4 bg-zinc-800 rounded-lg text-center text-white">
        {isConnected ? (
          <p className="text-sm">
            Connected: <span className="font-bold">{userAddress.slice(0, 6)}...{userAddress.slice(-4)}</span>
          </p>
        ) : (
          <p className="text-sm text-red-400">Wallet Not Connected</p>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
