"use client";

import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { WalletContext } from "@/context/wallet";
import { BrowserProvider } from "ethers";

const ADMIN_ADDRESS = "0xf29bbCFB987F3618515ddDe75D6CAd34cc1855D7"; // Admin's wallet address

const Navbar = ({ className }) => {
  const {
    isConnected,
    setIsConnected,
    userAddress,
    setUserAddress,
    signer,
    setSigner,
  } = useContext(WalletContext);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter(); // For navigation

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Please Install MetaMask To Continue");
      return;
    }

    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      setSigner(signer);
      const accounts = await provider.send("eth_requestAccounts", []);
      setIsConnected(true);
      setUserAddress(accounts[0]);

      // Check if connected wallet is the admin and redirect
      if (accounts[0].toLowerCase() === ADMIN_ADDRESS.toLowerCase()) {
        router.push("/admin");
      }
      else{
        router.push("/user_dashboard")
      }
    } catch (error) {
      console.log("Connection error", error);
    }
  };

  const truncateAddress = (address) => {
    return address ? `${address.slice(0, 8)}...` : "";
  };

  return (
    <div className={`sticky top-0 z-50 w-full bg-black border border-zinc-950 ${className}`}>
      <div className="flex justify-between items-center max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
        {/* Left Side - Title */}
        <h1 className="text-lg font-bold text-slate-300 font-space-mono tracking-wide">
          Land Ledger
        </h1>

        {/* Right Side - Wallet Button */}
        <div className="flex items-center space-x-4">
          {isConnected ? (
            <button
              type="button"
              className="relative rounded-md bg-zinc-900 px-3 py-2 text-sm font-semibold text-pink-400 shadow-sm hover:bg-black/80  focus-visible:outline-offset-2 focus-visible:outline-black font-space-mono tracking-wide"
            >
              {truncateAddress(userAddress)}
            </button>
          ) : (
            <button
              type="button"
              onClick={connectWallet}
              className="rounded-md bg-sky-200 px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-sky-400/80  focus-visible:outline-offset-2 focus-visible:outline-black font-space-mono tracking-wide"
            >
              CONNECT WALLET
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
