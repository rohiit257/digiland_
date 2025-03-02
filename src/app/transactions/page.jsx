"use client";

import { useEffect, useState, useContext } from "react";
import { ethers } from "ethers";
import { WalletContext } from "@/context/wallet";
import contractABI from "../landregistry.json";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const CONTRACT_ADDRESS = contractABI.address;

const sidebarLinks = [
  { name: "Dashboard", href: "/admin" },
  { name: "Transactions", href: "/transactions" },
];
export default function Transactions() {
  const { isConnected, signer } = useContext(WalletContext);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isConnected || !signer) return;
    fetchTransactionHistory();
  }, [isConnected, signer]);

  async function fetchTransactionHistory() {
    if (!signer) return;
    try {
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        contractABI.abi,
        signer
      );
      const transactionData = await contract.getTransactionHistory();

      console.log("Fetched Transactions:", transactionData); // 🔍 Debugging log

      if (!Array.isArray(transactionData)) {
        console.error("Unexpected transaction data format:", transactionData);
        setTransactions([]);
        return;
      }

      setTransactions(transactionData);
    } catch (error) {
      console.error("Error fetching transaction history:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex bg-white text-zinc-900 min-h-screen">
      <Sidebar title="Admin Panel" links={sidebarLinks} />{" "}
      <div className="flex flex-col flex-1 p-6">
        <h1 className="text-4xl font-bold mb-6 text-center">
          Transaction History
        </h1>

        {loading ? (
          <p className="text-center">Loading transactions...</p>
        ) : transactions.length === 0 ? (
          <p className="text-center">No transactions found.</p>
        ) : (
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-sm text-left shadow-md bg-white text-zinc-900">
              <thead className="bg-white text-zinc-900 border-b border-gray-400">
                <tr>
                  <th className="px-4 py-2">Property ID</th>
                  <th className="px-4 py-2">Sender</th>
                  <th className="px-4 py-2">Receiver</th>
                  <th className="px-4 py-2">Transaction Hash</th>
                </tr>
              </thead>
              <tbody className="bg-white text-zinc-900 divide-y divide-gray-300">
                {transactions.map((tx, index) => (
                  <tr key={index} className="hover:bg-gray-100 transition-all">
                    <td className="px-4 py-2">
                      {tx.propertyId?.toString() || "N/A"}
                    </td>
                    <td className="px-4 py-2">{tx.sender || "N/A"}</td>
                    <td className="px-4 py-2">{tx.receiver || "N/A"}</td>
                    <td className="px-4 py-2">
                      {tx.txHash ? (
                        <a
                          href={`https://etherscan.io/tx/${tx.txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          {tx.txHash.substring(0, 10)}...
                        </a>
                      ) : (
                        "N/A"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
