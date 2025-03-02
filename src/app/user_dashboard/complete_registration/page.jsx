"use client";

import { useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios"; 
import { WalletContext } from "@/context/wallet";
import Navbar from "@/app/components/Navbar";

export default function CompleteRegistration() {
  const { isConnected, userAddress } = useContext(WalletContext);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [aadharNumber, setAadharNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (isConnected && userAddress) {
      fetchUserDetails();
    }
  }, [isConnected, userAddress]);

  async function fetchUserDetails() {
    try {
      const response = await axios.get(`/api/get_user_by_wa?walletAddress=${userAddress}`);
      setUserData(response.data);
    } catch (error) {
      console.error("Error fetching user details:", error);
      setUserData(null); // If user doesn't exist, allow registration
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!/^\d{12}$/.test(aadharNumber)) {
      alert("Aadhar number must be exactly 12 digits.");
      return;
    }

    if (!/^\d{10}$/.test(phone)) {
      alert("Phone number must be exactly 10 digits.");
      return;
    }

    const newUserData = { 
      walletAddress: userAddress, 
      name, 
      aadharNumber, 
      phone, 
      address
    };

    try {
      setLoading(true);
      const response = await axios.post("/api/create_user", newUserData);

      if (response.status === 200) {
        alert("✅ KYC Completed Successfully!");
        router.push("/user_dashboard");
      } else {
        alert(`⚠️ Error: ${response.data.error || "Registration failed."}`);
      }
    } catch (error) {
      console.error("❌ Error submitting KYC:", error);
      alert(`❌ Error: ${error.response?.data?.error || "Unknown error"}`);
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
                <a href="/user_dashboard" className="block px-4 py-2 bg-gray-700 rounded-md">
                  My Properties
                </a>
              </li>
              <li>
                <a href="/register_land" className="block px-4 py-2 hover:bg-gray-700 rounded-md">
                  Register Property
                </a>
              </li>
              <li>
                <a href="/complete_registration" className="block px-4 py-2 hover:bg-gray-700 rounded-md">
                  KYC
                </a>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <h1 className="text-4xl font-bold text-center">Complete Registration (KYC)</h1>

          {loading ? (
            <p className="text-center mt-6">Loading user details...</p>
          ) : userData && userData.aadharNumber ? (
            <div className="max-w-lg mx-auto bg-green-700 p-6 rounded-lg mt-6 text-center">
              <h2 className="text-2xl font-bold">✅ KYC Already Completed</h2>
              <p className="mt-2">Your KYC has been successfully verified.</p>
              <p className="mt-2"><strong>Name:</strong> {userData.name}</p>
              <p className="mt-2"><strong>Wallet Address:</strong> {userData.walletAddress}</p>
              <p className="mt-2"><strong>Aadhar Number:</strong> {userData.aadharNumber}</p>
              <p className="mt-2"><strong>Phone:</strong> {userData.phone}</p>
              <p className="mt-2"><strong>Address:</strong> {userData.address}</p>
              <a href="/user_dashboard" className="mt-4 block bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md">
                Go to Dashboard
              </a>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-gray-800 p-6 rounded-lg mt-6">
              <label className="block text-sm font-medium mb-2">Wallet Address</label>
              <input type="text" value={userAddress} disabled className="w-full p-2 bg-gray-700 border border-gray-600 text-white mb-4 rounded-md" />

              <label className="block text-sm font-medium mb-2">Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full p-2 bg-gray-700 border border-gray-600 text-white mb-4 rounded-md" />

              <label className="block text-sm font-medium mb-2">Aadhar Number</label>
              <input type="text" value={aadharNumber} onChange={(e) => setAadharNumber(e.target.value)} required className="w-full p-2 bg-gray-700 border border-gray-600 text-white mb-4 rounded-md" />

              <label className="block text-sm font-medium mb-2">Phone Number</label>
              <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} required className="w-full p-2 bg-gray-700 border border-gray-600 text-white mb-4 rounded-md" />

              <label className="block text-sm font-medium mb-2">Address</label>
              <textarea value={address} onChange={(e) => setAddress(e.target.value)} required className="w-full p-2 bg-gray-700 border border-gray-600 text-white mb-4 rounded-md"></textarea>

              <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md" disabled={loading}>
                {loading ? "Submitting..." : "Complete Registration"}
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
