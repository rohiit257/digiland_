"use client";

import { useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { WalletContext } from "@/context/wallet";
import Navbar from "@/app/components/Navbar";
import { toast } from "sonner";
import Sidebar from "@/app/components/Sidebar";


const sidebarLinks = [
  { name: "My Properties", href: "/user_dashboard" },
  { name: "KYC", href: "/user_dashboard/complete_registration" },
  { name: "Register Land", href: "/register_land" },
  { name: "Transfer Ownership", href: "/user_dashboard/transfer_ownership" },
];

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
      setUserData(null);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!/^\d{12}$/.test(aadharNumber)) {
      toast("Aadhar number must be exactly 12 digits.");
      return;
    }

    if (!/^\d{10}$/.test(phone)) {
      toast("Phone number must be exactly 10 digits.");
      return;
    }

    const newUserData = {
      walletAddress: userAddress,
      name,
      aadharNumber,
      phone,
      address,
    };

    try {
      setLoading(true);
      const response = await axios.post("/api/create_user", newUserData);

      if (response.status === 200) {
        toast("✅ KYC Completed Successfully!");
        router.push("/user_dashboard");
      } else {
        toast(`⚠️ Error: ${response.data.error || "Registration failed."}`);
      }
    } catch (error) {
      console.error("❌ Error submitting KYC:", error);
      toast(`❌ Error: ${error.response?.data?.error || "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="flex min-h-screen bg-zinc-100 text-zinc-900">
        {/* Sidebar */}
        <Sidebar title="User Panel" links={sidebarLinks}/>
        

        {/* Main Content */}
        <div className="flex-1 p-6">
          <h1 className="text-4xl font-bold text-center text-zinc-800">Complete Registration (KYC)</h1>

          {loading ? (
            <p className="text-center mt-6 text-zinc-700">Loading user details...</p>
          ) : userData && userData.aadharNumber ? (
            <div className="max-w-lg mx-auto bg-green-600 p-6 rounded-lg mt-6 text-white text-center shadow-lg">
              <h2 className="text-2xl font-bold">✅ KYC Already Completed</h2>
              <p className="mt-2">Your KYC has been successfully verified.</p>
              <p className="mt-2"><strong>Name:</strong> {userData.name}</p>
              <p className="mt-2"><strong>Wallet Address:</strong> {userData.walletAddress}</p>
              <p className="mt-2"><strong>Aadhar Number:</strong> {userData.aadharNumber}</p>
              <p className="mt-2"><strong>Phone:</strong> {userData.phone}</p>
              <p className="mt-2"><strong>Address:</strong> {userData.address}</p>
              <a href="/user_dashboard" className="mt-4 block bg-zinc-900 hover:bg-zinc-700 text-white py-2 rounded-md">
                Go to Dashboard
              </a>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-6 rounded-lg mt-6 shadow-lg">
              <label className="block text-sm font-medium mb-2 text-zinc-700">Wallet Address</label>
              <input type="text" value={userAddress} disabled className="w-full p-2 bg-zinc-100 border border-zinc-400 text-zinc-900 mb-4 rounded-md" />

              <label className="block text-sm font-medium mb-2 text-zinc-700">Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full p-2 bg-zinc-100 border border-zinc-400 text-zinc-900 mb-4 rounded-md" />

              <label className="block text-sm font-medium mb-2 text-zinc-700">Aadhar Number</label>
              <input type="text" value={aadharNumber} onChange={(e) => setAadharNumber(e.target.value)} required className="w-full p-2 bg-zinc-100 border border-zinc-400 text-zinc-900 mb-4 rounded-md" />

              <label className="block text-sm font-medium mb-2 text-zinc-700">Phone Number</label>
              <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} required className="w-full p-2 bg-zinc-100 border border-zinc-400 text-zinc-900 mb-4 rounded-md" />

              <label className="block text-sm font-medium mb-2 text-zinc-700">Address</label>
              <textarea value={address} onChange={(e) => setAddress(e.target.value)} required className="w-full p-2 bg-zinc-100 border border-zinc-400 text-zinc-900 mb-4 rounded-md"></textarea>

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
