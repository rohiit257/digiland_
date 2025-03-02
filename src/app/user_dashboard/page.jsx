"use client";

import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ethers } from "ethers";
import { WalletContext } from "@/context/wallet";
import contractABI from "../landregistry.json";
import Navbar from "../components/Navbar";
import Link from "next/link";  // Import Next.js Link

const CONTRACT_ADDRESS = contractABI.address;

export default function UserDashboard() {
  const { isConnected, signer, userAddress } = useContext(WalletContext);
  const [properties, setProperties] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!isConnected || !signer || !userAddress) {
      console.log("Signer or user address not found. Connect wallet.");
      return;
    }
    fetchUserProperties();
    fetchTransactionHistory();
  }, [isConnected, signer, userAddress]);


  
async function fetchUserDetails(walletAddress) {
  try {
    const response = await axios.get(`/api/get_user_by_wa?walletAddress=${walletAddress}`);
    console.log("User Data:", response.data);
  } catch (error) {
    console.error("Error fetching user details:", error);
  }
}


  async function fetchUserProperties() {
    if (!signer) return;
    setLoading(true);
    try {
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI.abi, signer);
      console.log("Fetching properties for:", userAddress);

      const userProperties = await contract.getMyProperties();
      console.log("Fetched Properties:", userProperties);

      if (userProperties.length === 0) {
        console.warn("No properties found for user.");
      }

      setProperties(userProperties.length ? userProperties : []);
    } catch (error) {
      console.error("Error fetching user properties:", error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchTransactionHistory() {
    if (!signer) return;
    try {
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI.abi, signer);
      console.log("Fetching transactions for:", userAddress);

      const txHistory = await contract.getTransactionHistory();
      console.log("Fetched Transactions:", txHistory);

      setTransactions(txHistory.filter(tx => tx.sender === userAddress || tx.receiver === userAddress));
    } catch (error) {
      console.error("Error fetching transaction history:", error);
    }
  }


  return (
    <>
      {/* <Navbar /> */}
      <div className="flex min-h-screen bg-gray-900 text-white">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-800 p-6 min-h-screen">
          <h1 className="text-2xl font-bold text-center">User Dashboard</h1>
          <nav className="mt-6">
            <ul className="space-y-4">
              <li>
                <Link href="/user_dashboard" className="block px-4 py-2 bg-gray-700 rounded-md">
                  My Properties
                </Link>
              </li>
              <li>
                <Link href="/register_land" className="block px-4 py-2 hover:bg-gray-700 rounded-md">
                  Register Property
                </Link>
              </li>
              <li>
                <Link href="/user_dashboard/complete_registration" className="block px-4 py-2 hover:bg-gray-700 rounded-md">
                  KYC Verification
                </Link>
              </li>
              <li>
                <Link href="/user_dashboard/transfer_ownership" className="block px-4 py-2 hover:bg-gray-700 rounded-md">
                  Transfer OwnerShip
                </Link>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <h1 className="text-4xl font-bold text-center">User Dashboard</h1>

          <h2 className="text-2xl mt-10">My Properties</h2>
          <div className="overflow-x-auto mt-4">
            {loading ? (
              <p>Loading properties...</p>
            ) : properties.length > 0 ? (
              <table className="w-full text-sm text-left border border-gray-700">
                <thead className="bg-gray-800 text-white">
                  <tr>
                    <th className="px-4 py-2 border border-gray-700">Property ID</th>
                    <th className="px-4 py-2 border border-gray-700">Location</th>
                    <th className="px-4 py-2 border border-gray-700">Verified</th>
                  </tr>
                </thead>
                <tbody>
                  {properties.map((property, index) => (
                    property && property.id ? (
                      <tr key={index} className="border border-gray-700">
                        <td className="px-4 py-2">{property.id.toString()}</td>
                        <td className="px-4 py-2">{property.location || "N/A"}</td>
                        <td className="px-4 py-2">{property.isVerified ? "✅ Yes" : "❌ No"}</td>
                      </tr>
                    ) : null
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No registered properties found.</p>
            )}
          </div>

          <h2 className="text-2xl mt-10">Transaction History</h2>
          <div className="overflow-x-auto mt-4">
            {transactions.length > 0 ? (
              <table className="w-full text-sm text-left border border-gray-700">
                <thead className="bg-gray-800 text-white">
                  <tr>
                    <th className="px-4 py-2 border border-gray-700">Property ID</th>
                    <th className="px-4 py-2 border border-gray-700">Sender</th>
                    <th className="px-4 py-2 border border-gray-700">Receiver</th>
                    <th className="px-4 py-2 border border-gray-700">Transaction Hash</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx, index) => (
                    <tr key={index} className="border border-gray-700">
                      <td className="px-4 py-2">{tx.propertyId.toString()}</td>
                      <td className="px-4 py-2">{tx.sender}</td>
                      <td className="px-4 py-2">{tx.receiver}</td>
                      <td className="px-4 py-2">{tx.txHash}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No transactions found.</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
