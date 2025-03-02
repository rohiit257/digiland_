"use client";

import { motion } from "framer-motion";
import React, { useContext } from "react";
import { ImagesSlider } from "../components/ui/image-slider";
import { WalletContext } from "@/context/wallet";
import { useRouter } from "next/navigation";
import { BrowserProvider } from "ethers";
import { toast } from "sonner";

const ADMIN_ADDRESS = "0xf29bbCFB987F3618515ddDe75D6CAd34cc1855D7"; // Admin wallet address

export function HomeSec() { 
  const {
    isConnected,
    setIsConnected,
    userAddress,
    setUserAddress,
    signer,
    setSigner,
  } = useContext(WalletContext);

  const router = useRouter();

  const images = [
    "https://images.unsplash.com/photo-1642104704074-907c0698cbd9?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1665726010121-748a1916ccf2?q=80&w=1924&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1658487476833-f094aaf4a66c?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  ];

  const connectWallet = async () => {
    if (!window.ethereum) {
      toast("Please Install MetaMask To Continue");
      return;
    }

    try {
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      setSigner(signer);
      const accounts = await provider.send("eth_requestAccounts", []);
      setIsConnected(true);
      toast("Wallet Successfully Connected")
      setUserAddress(accounts[0]);

      // Redirect user based on wallet address
      if (accounts[0].toLowerCase() === ADMIN_ADDRESS.toLowerCase()) {
        router.push("/admin");
      } else {
        router.push("/user_dashboard");
      }
    } catch (error) {
      console.log("Connection error", error);
    }
  };

  return (
    <ImagesSlider className="w-full h-screen flex items-center justify-center" images={images}>
      <motion.div
        initial={{ opacity: 0, y: -80 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="z-50 flex flex-col justify-center items-center text-center"
      >
        <motion.p className="font-bold text-xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 py-4">
          Get Your Land Register & Decentralised <br /> Secure & Immutable
        </motion.p>

        <button
          onClick={connectWallet}
          className="px-4 py-2 backdrop-blur-sm border  hover:bg-emerald-400/30    bg-emerald-300/10 border-emerald-500/20 text-white rounded-full relative mt-4"
        >
          {isConnected ? "Connected" : "Connect Wallet →"}
        </button>
      </motion.div>
    </ImagesSlider>
  );
}
