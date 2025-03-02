"use client";

import { useEffect, useState, useContext } from "react";
import { ethers } from "ethers";
import { WalletContext } from "@/context/wallet";
import contractABI from "../landregistry.json";
import Navbar from "../components/Navbar";

const CONTRACT_ADDRESS = contractABI.address;

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
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI.abi, signer);
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
    <>
      <Navbar />
      <div className="flex flex-col items-center min-h-screen bg-gray-900 text-white p-6">
        <h1 className="text-4xl font-bold mb-6">Transaction History</h1>

        {loading ? (
          <p>Loading transactions...</p>
        ) : transactions.length === 0 ? (
          <p>No transactions found.</p>
        ) : (
          <div className="overflow-x-auto w-full max-w-6xl">
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
                    <td className="px-4 py-2">{tx.propertyId?.toString() || "N/A"}</td>
                    <td className="px-4 py-2">{tx.sender || "N/A"}</td>
                    <td className="px-4 py-2">{tx.receiver || "N/A"}</td>
                    <td className="px-4 py-2">
                      {tx.txHash ? (
                        <a
                          href={`https://etherscan.io/tx/${tx.txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:underline"
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
    </>
  );
}
