'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BrowserProvider } from 'ethers';

const ADMIN_ADDRESS = "0xYourAdminWalletAddress"; // Replace with the actual admin wallet address

export default function ConnectWalletButton() {
  const [isConnected, setIsConnected] = useState(false);
  const [userAddress, setUserAddress] = useState("");
  const router = useRouter();

  const connectWallet = async () => {
    if (!window.ethereum) {
      alert("Please Install MetaMask To Continue");
      return;
    }

    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      setIsConnected(true);
      const accounts = await provider.send("eth_requestAccounts", []);
      setUserAddress(accounts[0]);

      // Check if connected wallet is the admin and redirect
      if (accounts[0].toLowerCase() === ADMIN_ADDRESS.toLowerCase()) {
        router.push("/admin");
      } else {
        router.push("/user_dashboard");
      }
    } catch (error) {
      console.log("Connection error", error);
    }
  };

  const truncateAddress = (address) => {
    return address ? `${address.slice(0, 8)}...` : "";
  };

  return (
    <button
      onClick={connectWallet}
      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
    >
      {isConnected ? `Connected: ${truncateAddress(userAddress)}` : "Connect Wallet"}
    </button>
  );
}
