"use client";

import { useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ethers } from "ethers";
import { WalletContext } from "@/context/wallet";
import contractABI from "../landregistry.json";
import { uploadFileToIPFS } from "../pinata";
import Navbar from "@/app/components/Navbar";
import Sidebar from "@/app/components/Sidebar";
import { toast } from "sonner";

const CONTRACT_ADDRESS = contractABI.address;



const sidebarLinks = [
  { name: "My Properties", href: "/user_dashboard" },
  { name: "KYC", href: "/user_dashboard/complete_registration" },
  { name: "Register Land", href: "/register_land" },
  { name: "Transfer Ownership", href: "/user_dashboard/transfer_ownership" },
];

export default function RegisterLand() {
  const { isConnected, signer, userAddress } = useContext(WalletContext);
  const [propertyNumber, setPropertyNumber] = useState("");
  const [location, setLocation] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [documentHash, setDocumentHash] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!isConnected || !signer) {
      toast("Please connect your wallet.");
    }
  }, [isConnected, signer]);

  async function fetchSuggestions(query) {
    if (!query) {
      setSuggestions([]);
      return;
    }
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${query}`
      );
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error("Error fetching location suggestions:", error);
    }
  }

  async function uploadDocument(e) {
    try {
      const file = e.target.files[0];
      if (!file) return;
      const data = new FormData();
      data.set("file", file);

      setLoading(true);
      const response = await uploadFileToIPFS(data);
      if (response.success) {
        setDocumentHash(response.pinataURL);
        toast("Document uploaded successfully!");
      } else {
        toast("Error uploading document.");
      }
    } catch (e) {
      console.error("Error during file upload:", e);
    } finally {
      setLoading(false);
    }
  }

  async function registerProperty() {
    if (!isConnected || !signer) {
      toast("Wallet not connected. Please connect your wallet.");
      return;
    }
    if (!propertyNumber.trim() || !location.trim() || !documentHash.trim()) {
      toast("All fields are required.");
      return;
    }

    try {
      setLoading(true);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI.abi, signer);
      const tx = await contract.registerProperty(propertyNumber, location, documentHash);
      await tx.wait();
      toast("Property Registered Successfully!");
      router.push("/user_dashboard");
    } catch (error) {
      console.error("Error registering property:", error);
      toast("Error registering property. Check the console for details.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-zinc-100 text-zinc-900">
      <Sidebar title="User Panel" links={sidebarLinks} />
      <div className="flex-1 flex flex-col">
        <div className="flex flex-col items-center justify-center p-6">
          <h1 className="text-4xl font-bold mt-10 mb-6">Register Land</h1>
          <div className="bg-white p-6 rounded-lg mt-7 shadow-md w-full max-w-lg border border-zinc-300">
            <label className="block text-sm font-medium mb-2">Property Number</label>
            <input
              type="text"
              className="w-full p-2 rounded-md bg-zinc-200 border border-zinc-300 mb-4"
              placeholder="Enter Property Number"
              value={propertyNumber}
              onChange={(e) => setPropertyNumber(e.target.value)}
            />
            <label className="block text-sm font-medium mb-2">Location</label>
            <input
              type="text"
              className="w-full p-2 rounded-md bg-zinc-200 border border-zinc-300 mb-2"
              placeholder="Enter location"
              value={location}
              onChange={(e) => {
                setLocation(e.target.value);
                fetchSuggestions(e.target.value);
              }}
            />
            {suggestions.length > 0 && (
              <ul className="bg-zinc-200 border border-zinc-300 rounded-md overflow-hidden">
                {suggestions.map((suggestion, index) => (
                  <li
                    key={index}
                    className="p-2 hover:bg-zinc-300 cursor-pointer"
                    onClick={() => {
                      setLocation(suggestion.display_name);
                      setSuggestions([]);
                    }}
                  >
                    {suggestion.display_name}
                  </li>
                ))}
              </ul>
            )}
            <label className="block text-sm font-medium mt-4 mb-2">Upload Document</label>
            <input
              type="file"
              className="w-full p-2 rounded-md bg-zinc-200 border border-zinc-300 mb-4"
              onChange={uploadDocument}
            />
            {documentHash && <p className="text-green-600 mb-4">Document uploaded successfully!</p>}
            <button
              onClick={registerProperty}
              className="w-full bg-zinc-900 hover:bg-zinc-700 text-white py-2 px-4 rounded-md mt-4"
              disabled={loading}
            >
              {loading ? "Registering..." : "Register Land"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
