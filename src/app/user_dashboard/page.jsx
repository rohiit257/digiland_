"use client";

import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ethers } from "ethers";
import { WalletContext } from "@/context/wallet";
import contractABI from "../landregistry.json";
import Sidebar from "../components/Sidebar";

const CONTRACT_ADDRESS = contractABI.address;

const sidebarLinks = [
  { name: "My Properties", href: "/user_dashboard" },
  { name: "KYC", href: "/user_dashboard/complete_registration" },
  { name: "Register Land", href: "/register_land" },
  { name: "Transfer Ownership", href: "/user_dashboard/transfer_ownership" },
];

export default function UserDashboard() {
  const { isConnected, signer, userAddress } = useContext(WalletContext);
  const [properties, setProperties] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [userData, setUserData] = useState(null);
  const [loadingProperties, setLoadingProperties] = useState(true);
  const [loadingTransactions, setLoadingTransactions] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!isConnected || !signer || !userAddress) {
      console.log("Signer or user address not found. Connect wallet.");
      return;
    }
    fetchUserDetails();
    fetchUserProperties();
    fetchTransactionHistory();
  }, [isConnected, signer, userAddress]);

  // ✅ Fetch User Details
  async function fetchUserDetails() {
    try {
      const response = await axios.get(
        `/api/get_user_by_wa?walletAddress=${userAddress}`
      );
      setUserData(response.data);
    } catch (error) {
      console.error("Error fetching user details:", error);
      setUserData(null);
    }
  }

  // ✅ Fetch User Properties
  async function fetchUserProperties() {
    if (!signer) return;
    setLoadingProperties(true);
    try {
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        contractABI.abi,
        signer
      );

      const userProperties = await contract.getMyProperties();
      setProperties(userProperties.length ? userProperties : []);
    } catch (error) {
      console.error("Error fetching user properties:", error);
    } finally {
      setLoadingProperties(false);
    }
  }

  // ✅ Fetch Transaction History
  async function fetchTransactionHistory() {
    if (!signer) return;
    setLoadingTransactions(true);
    try {
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        contractABI.abi,
        signer
      );

      const txHistory = await contract.getTransactionHistory();

      const formattedTransactions = txHistory.map((tx) => ({
        propertyId: tx[0].toString(),
        sender: tx[1],
        receiver: tx[2],
        txHash: tx[3],
      }));

      setTransactions(
        formattedTransactions.filter(
          (tx) =>
            tx.sender.toLowerCase() === userAddress.toLowerCase() ||
            tx.receiver.toLowerCase() === userAddress.toLowerCase()
        )
      );
    } catch (error) {
      console.error("Error fetching transaction history:", error);
    } finally {
      setLoadingTransactions(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-white text-zinc-900">
      {/* Sidebar */}
      <Sidebar title="User Panel" links={sidebarLinks} />

      {/* Main Content */}
      <div className="flex-1 p-6">
        <h1 className="text-4xl font-bold text-center">User Dashboard</h1>

        {/* ✅ User Info Box */}
        <div className="mt-6 p-4 bg-gray-100 rounded-lg shadow-md w-fit">
          <h4 className="text-lg font-semibold">Welcome, {userAddress}</h4>
          {userData ? (
            <div className="mt-2">
              <h4 className="text-lg">Name: {userData.name}</h4>
              <h4 className="text-lg">Aadhar: {userData.aadharNumber}</h4>
            </div>
          ) : (
            <p className="text-red-500">User details not found.</p>
          )}
        </div>

        {/* ✅ Properties Section */}
        <h2 className="text-2xl mt-10">My Properties</h2>
        <div className="overflow-x-auto mt-4">
          {loadingProperties ? (
            <p>Loading properties...</p>
          ) : properties.length > 0 ? (
            <table className="w-full text-sm text-left bg-zinc-100 rounded-lg overflow-hidden shadow-md">
              <thead className="bg-zinc-200 text-zinc-900">
                <tr>
                  <th className="px-4 py-3">Property ID</th>
                  <th className="px-4 py-3">Location</th>
                  <th className="px-4 py-3">Verified</th>
                </tr>
              </thead>
              <tbody>
                {properties.map((property, index) =>
                  property && property.id ? (
                    <tr key={index} className="bg-white text-zinc-900">
                      <td className="px-4 py-3">{property.id.toString()}</td>
                      <td className="px-4 py-3">
                        {property.location || "N/A"}
                      </td>
                      <td className="px-4 py-3">
                        {property.isVerified ? "Yes" : "No"}
                      </td>
                    </tr>
                  ) : null
                )}
              </tbody>
            </table>
          ) : (
            <p>No registered properties found.</p>
          )}
        </div>

        {/* ✅ Transactions Section */}
        <h2 className="text-2xl mt-10">Transaction History</h2>
        <div className="overflow-x-auto mt-4">
          {loadingTransactions ? (
            <p>Loading transactions...</p>
          ) : transactions.length > 0 ? (
            <table className="w-full text-sm text-left bg-zinc-100 rounded-lg overflow-hidden shadow-md">
              <thead className="bg-zinc-200 text-zinc-900">
                <tr>
                  <th className="px-4 py-3">Property ID</th>
                  <th className="px-4 py-3">Sender</th>
                  <th className="px-4 py-3">Receiver</th>
                  <th className="px-4 py-3">Transaction Hash</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx, index) => (
                  <tr key={index} className="bg-white text-zinc-900">
                    <td className="px-4 py-3">{tx.propertyId}</td>
                    <td className="px-4 py-3">{tx.sender}</td>
                    <td className="px-4 py-3">{tx.receiver}</td>
                    <td className="px-4 py-3">
                      <a
                        href={`https://etherscan.io/tx/${tx.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        {tx.txHash.substring(0, 10)}...
                      </a>
                    </td>
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
  );
}
