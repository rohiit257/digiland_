"use client";

import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { Contract, BrowserProvider } from "ethers"; // ✅ Updated for ethers v6
import { WalletContext } from "@/context/wallet";
import contractABI from "../../landregistry.json";
import axios from "axios";
import Navbar from "@/app/components/Navbar";

const CONTRACT_ADDRESS = contractABI.address;

export default function TransferOwnership() {
  const { isConnected, signer, userAddress } = useContext(WalletContext);
  const [propertyId, setPropertyId] = useState("");
  const [newOwner, setNewOwner] = useState("");
  const [kycCompleted, setKYCCompleted] = useState(false);
  const [transferSuccess, setTransferSuccess] = useState(false);
  const [transactionData, setTransactionData] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!isConnected || !userAddress) {
      alert("Please connect your wallet.");
      router.push("/");
    } else {
      checkKYC();
    }
  }, [isConnected, userAddress]);

  async function checkKYC() {
    try {
      const response = await axios.get(`/api/get_user_by_wa?walletAddress=${userAddress}`);
      if (response.data && response.data.aadharNumber) {
        setKYCCompleted(true);
      } else {
        alert("KYC not completed. Please complete your registration.");
        router.push("/complete_registration");
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      alert("Error verifying KYC. Try again.");
      router.push("/");
    }
  }

  async function handleTransfer(e) {
    e.preventDefault();

    if (!propertyId.trim() || !newOwner.trim()) {
      alert("Please enter valid Property ID and New Owner Address.");
      return;
    }

    try {
      setLoading(true);
      
      // ✅ Setup ethers v6 provider & signer
      const provider = new BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new Contract(CONTRACT_ADDRESS, contractABI.abi, signer);

      // ✅ Call the transferOwnership function
      const tx = await contract.transferOwnership(propertyId, newOwner);
      const receipt = await tx.wait();

      console.log("Ownership Transferred:", receipt);

      setTransferSuccess(true);
      setTransactionData({
        propertyId,
        previousOwner: userAddress,
        newOwner,
        transactionHash: receipt.hash,
      });

      alert("Ownership Transfer Successful!");
    } catch (error) {
      console.error("Error transferring ownership:", error);
      alert("Error transferring ownership. Check the console for details.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />
      <div className="flex min-h-screen bg-gray-900 text-white">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-800 p-6 min-h-screen">
          <h1 className="text-2xl font-bold text-center">User Dashboard</h1>
          <nav className="mt-6">
            <ul className="space-y-4">
              <li>
                <a href="/user_dashboard" className="block px-4 py-2 bg-gray-700 rounded-md">My Properties</a>
              </li>
              <li>
                <a href="/register_land" className="block px-4 py-2 hover:bg-gray-700 rounded-md">Register Property</a>
              </li>
              <li>
                <a href="/complete_registration" className="block px-4 py-2 hover:bg-gray-700 rounded-md">KYC</a>
              </li>
              <li>
                <a href="/transfer_ownership" className="block px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-md">Transfer Ownership</a>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <h1 className="text-4xl font-bold text-center">Transfer Property Ownership</h1>

          {!transferSuccess ? (
            <form onSubmit={handleTransfer} className="max-w-lg mx-auto bg-gray-800 p-6 rounded-lg mt-6">
              <label className="block text-sm font-medium mb-2">Property ID</label>
              <input
                type="text"
                value={propertyId}
                onChange={(e) => setPropertyId(e.target.value)}
                required
                className="w-full p-2 bg-gray-700 border border-gray-600 text-white mb-4 rounded-md"
              />

              <label className="block text-sm font-medium mb-2">New Owner Address</label>
              <input
                type="text"
                value={newOwner}
                onChange={(e) => setNewOwner(e.target.value)}
                required
                className="w-full p-2 bg-gray-700 border border-gray-600 text-white mb-4 rounded-md"
              />

              <button
                type="submit"
                className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-md"
                disabled={loading}
              >
                {loading ? "Processing..." : "Transfer Ownership"}
              </button>
            </form>
          ) : (
            <div className="max-w-lg mx-auto bg-gray-800 p-6 rounded-lg mt-6 shadow-lg">
              <h2 className="text-2xl font-bold text-center text-green-400 mb-4">Ownership Transferred Successfully</h2>
              <p><strong>Property ID:</strong> {transactionData.propertyId}</p>
              <p><strong>Previous Owner:</strong> {transactionData.previousOwner}</p>
              <p><strong>New Owner:</strong> {transactionData.newOwner}</p>
              <p><strong>Transaction Hash:</strong> {transactionData.transactionHash}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
