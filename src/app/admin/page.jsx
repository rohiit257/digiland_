"use client";

import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ethers } from "ethers";
import { WalletContext } from "@/context/wallet";
import contractABI from "../landregistry.json";
import GetIpfsUrlFromPinata from "@/app/utils";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { toast } from "sonner";

const CONTRACT_ADDRESS = contractABI.address;
const ADMIN_ADDRESS = "0xf29bbCFB987F3618515ddDe75D6CAd34cc1855D7";
const GEMINI_API_KEY = "AIzaSyAdPHUPF3huKtTaD4pbbpSQsKsOppJY3GA"; // Replace with your actual API key

const sidebarLinks = [
  { name: "Dashboard", href: "/admin" },
  { name: "Transactions", href: "/transactions" },
];

export default function AdminDashboard() {
  const { isConnected, signer, userAddress } = useContext(WalletContext);
  const [properties, setProperties] = useState([]);
  const [totalProperties, setTotalProperties] = useState(0);
  const [registeredProperties, setRegisteredProperties] = useState(0);
  const [uniqueUsers, setUniqueUsers] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [fraudResult, setFraudResult] = useState("");

  const router = useRouter();

  useEffect(() => {
    if (!isConnected || !userAddress) return;
    if (userAddress.toLowerCase() !== ADMIN_ADDRESS.toLowerCase()) {
      alert("Access Denied: Only Admin Can View This Page");
      router.push("/");
    } else {
      fetchProperties();
    }
  }, [isConnected, userAddress]);

  async function fetchProperties() {
    if (!signer) return;
    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      contractABI.abi,
      signer
    );
    try {
      const propertiesList = await contract.getAllProperties();
      setProperties(propertiesList);
      setTotalProperties(propertiesList.length);
      const verifiedCount = propertiesList.filter((p) => p.isVerified).length;
      setRegisteredProperties(verifiedCount);
      const uniqueOwners = new Set(propertiesList.map((p) => p.owner));
      setUniqueUsers(uniqueOwners.size);
    } catch (error) {
      console.error("Error fetching properties:", error);
    }
  }

  async function verifyProperty(propertyId) {
    if (!signer || userAddress.toLowerCase() !== ADMIN_ADDRESS.toLowerCase())
      return;
    const contract = new ethers.Contract(
      CONTRACT_ADDRESS,
      contractABI.abi,
      signer
    );
    try {
      setLoading(true);
      const tx = await contract.verifyProperty(propertyId);
      await tx.wait();
      alert("✅ Property Verified Successfully!");
      fetchProperties();
      setSelectedDocument(null);
    } catch (error) {
      console.error("Error verifying property:", error);
    } finally {
      setLoading(false);
    }
  }

  async function detectFraud(propertyId) {
    try {
      if (!signer) return;
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        contractABI.abi,
        signer
      );

      // ✅ Explicitly call the correct function signature
      const transactions = await contract["getTransactionHistory(uint256)"](
        propertyId
      );

      console.log("Fetched Transactions:", transactions);

      // Constructing transaction details for AI analysis
      let transactionDetails = transactions
        .map(
          (tx) => `
        - Transaction Hash: ${tx.txHash}
        - From: ${tx.sender}
        - To: ${tx.receiver}
      `
        )
        .join("\n");

      const prompt = `
        Analyze the ownership history of property ID ${propertyId}.
        The transaction history is as follows:
        ${transactionDetails}
  
        Based on this information, summarize if there is any suspicious activity in ownership transfers.
      `;

      // 🔥 Send Request to Gemini AI
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        }
      );

      const result = await response.json();
      const responseText =
        result.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No fraud detected.";

      setFraudResult(responseText);
      toast("Fraud Analysis Complete: " + responseText);
    } catch (error) {
      console.error("Error analyzing fraud:", error);
    }
  }

  return (
    <>
      <div className="flex min-h-screen bg-slate-50 text-zinc-900">
        {/* Sidebar */}
        <Sidebar title="Admin Panel" links={sidebarLinks} />
        {/* <aside className="w-64 bg-gray-800 p-6 min-h-screen">
          <h1 className="text-2xl font-bold text-center">Admin Panel</h1>
          <nav className="mt-6">
            <ul className="space-y-4">
              <li>
                <Link href="/admin_dashboard" className="block px-4 py-2 bg-gray-700 rounded-md">
                  🏠 Dashboard
                </Link>
              </li>
              <li>
                <Link href="/transactions" className="block px-4 py-2 hover:bg-gray-700 rounded-md">
                  🔄 Transactions
                </Link>
              </li>
            </ul>
          </nav>
        </aside> */}

        {/* Main Content */}
        <div className="flex-1 p-6">
          <h1 className="text-4xl font-bold text-center">Admin Dashboard</h1>
          <h3 className="text-lg font-bold text-center m-5 text-zinc-500">Welcome {userAddress}</h3>

          <div className="p-4 bg-white rounded-2xl shadow-md text-zinc-900 flex justify-between text-center mt-5">
            <div className="p-4">
              <h2 className="text-lg font-semibold">Total Properties</h2>
              <p className="text-2xl font-bold">{totalProperties}</p>
            </div>
            <div className="p-4">
              <h2 className="text-lg font-semibold">Registered Properties</h2>
              <p className="text-2xl font-bold">{registeredProperties}</p>
            </div>
            <div className="p-4">
              <h2 className="text-lg font-semibold">Unique Users</h2>
              <p className="text-2xl font-bold">{uniqueUsers}</p>
            </div>
          </div>

          {/* Properties Table */}
          <h2 className="text-2xl text-zinc-500 font-bold mt-10">Registered Properties</h2>
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-sm text-left rounded-2xl shadow-md">
              <thead className="bg-slate-100 text-zinc-900 border-b border-gray-300">
                <tr>
                  <th className="px-4 py-2">Property ID</th>
                  <th className="px-4 py-2">Owner</th>
                  <th className="px-4 py-2">Location</th>
                  <th className="px-4 py-2">Verified</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {properties.map((property, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-100 transition-all rounded-lg"
                  >
                    <td className="px-4 py-2">
                      <Link
                        href={`/property/${property.id}`}
                        className="text-blue-500 hover:underline"
                      >
                        {property.id.toString()}
                      </Link>
                    </td>
                    <td className="px-4 py-2">{property.owner}</td>
                    <td className="px-4 py-2">{property.location}</td>
                    <td
                      className={`px-4 py-2 font-bold ${
                        property.isVerified ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {property.isVerified ? "Yes" : "No"}
                    </td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => {
                          setSelectedProperty(property);
                          setSelectedDocument(
                            GetIpfsUrlFromPinata(property.documentHash)
                          );
                        }}
                        className="px-3 py-1 bg-black text-white rounded-md hover:bg-zinc-800"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Dialog Box */}
          {selectedDocument && (
            <div className="fixed inset-0 flex items-center justify-center bg-zinc-900/40 bg-opacity-90">
              <div className="bg-white p-6 rounded-lg max-w-lg text-black">
                <h2 className="text-xl font-bold mb-4">Property Document</h2>
                <img
                  src={selectedDocument}
                  alt="Property Document"
                  className="w-full h-auto rounded-md mb-4"
                />
                <button
                  onClick={() => detectFraud(selectedProperty.id)}
                  className="mr-2 bg-yellow-500 text-white px-4 py-2 rounded-md"
                >
                  Detect Fraud
                </button>
                <button
                  onClick={() => verifyProperty(selectedProperty.id)}
                  className="mr-2 bg-green-500 text-white px-4 py-2 rounded-md"
                >
                  Verify
                </button>
                <button
                  onClick={() => setSelectedDocument(null)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
